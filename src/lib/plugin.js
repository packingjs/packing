/**
 * 思路：
 *   1. 在 done 时根据 entries 信息生成网页并存储到内存 pages 中
 *   2. 匹配出所有静态资源，生成 matches
 *   3. 根据 matches 信息拷贝文件并使用 hash 重命名文件名
 *   4. 把 pages 中的文件替换为新的文件路径
 *   5. 根据 assets 中输出的文件，动态向 pages 中插入脚本和样式
 *   6. 输出 html 文件
 */

/**
webpack plugin hooks 执行顺序：
--environment--
--afterEnvironment--
--entryOption--
--afterPlugins--
--afterResolvers--
--beforeRun--
--run--
--normalModuleFactory--
--contextModuleFactory--
--beforeCompile--
--compile--
--thisCompilation--
--compilation--
--make--
--afterCompile--
--shouldEmit--
--emit--
--afterEmit--
--done--
 */

import { existsSync, readFileSync, writeFileSync, statSync } from 'fs';
import { resolve, dirname, parse } from 'path';
import { isString, isFunction } from 'util';
import mkdirp from 'mkdirp';
import loaderUtils from 'loader-utils';
import glob from 'packing-glob';
import chunkSorter from './chunksorter';

export default class PackingTemplatePlugin {
  constructor(appConfig, options = {}) {
    const { CONTEXT } = process.env;
    const {
      path: { src: { root: src, templates } },
      templateExtension,
      templateInjectPosition
    } = appConfig;
    const templatePages = isString(templates) ? templates : templates.pages;
    this.context = CONTEXT ? resolve(CONTEXT) : process.cwd();
    this.appConfig = appConfig;
    this.options = {
      ...{
        template: resolve(this.context, src, `${templatePages}/default${templateExtension}`),
        inject: templateInjectPosition,
        charset: 'UTF-8',
        title: '',
        favicon: false,
        keywords: false,
        description: false,
        chunks: null,
        excludeChunks: null,
        chunksSortMode: 'commonChunksFirst',
        attrs: ['img:src', 'link:href']
      },
      ...options
    };
    this.pages = {};
  }

  apply(compiler) {
    // webpack v4
    if (compiler.hooks) {
      compiler.hooks.done.tap(this.constructor.name, (stats) => {
        this.done(compiler, stats);
      });
    } else {
      compiler.plugin('done', (stats) => {
        this.done(compiler, stats);
      });
    }
  }

  filterChunks(chunks) {
    chunks.filter((chunk) => {
      const chunkName = chunk.names[0];
      // This chunk doesn't have a name. This script can't handled it.
      if (chunkName === undefined) {
        return false;
      }
      // Skip if the chunk should be lazy loaded
      if (typeof chunk.isInitial === 'function') {
        if (!chunk.isInitial()) {
          return false;
        }
      } else if (!chunk.initial) {
        return false;
      }
      return true;
    });
  }

  sortChunks(chunks, sortMode, chunkGroups) {
    // Sort mode auto by default:
    if (typeof sortMode === 'undefined') {
      sortMode = 'commonChunksFirst';
    }
    if (sortMode === 'commonChunksFirst') {
      return chunkSorter.commonChunksFirst(chunks, Object.keys(this.appConfig.commonChunks));
    }
    // Custom function
    if (typeof sortMode === 'function') {
      return chunks.sort(sortMode);
    }
    // Disabled sorting:
    if (sortMode === 'none') {
      return chunkSorter.none(chunks);
    }
    if (sortMode === 'manual') {
      return chunkSorter.manual(chunks, this.options.chunks);
    }
    // Check if the given sort mode is a valid chunkSorter sort mode
    if (typeof chunkSorter[sortMode] !== 'undefined') {
      return chunkSorter[sortMode](chunks, chunkGroups);
    }
    throw new Error(`"${sortMode}" is not a valid chunk sort mode`);
  }

  done(compiler, stats) {
    const { templateEngine } = this.appConfig;
    this.generatePages();
    this.getAssetsMap(compiler);
    this.output(compiler, stats);

    if (templateEngine === 'pug') {
      this.copyAndReplaceLayout(compiler);
    }
  }

  generatePages() {
    const { path: { entries }, commonChunks } = this.appConfig;

    // 该 entries 信息包含 commonChunks 配置
    const entryPoints = isFunction(entries) ? entries() : entries;
    Object.keys(entryPoints)
      // 排除 commonChunks 入口
      .filter(entry => Object.keys(commonChunks).indexOf(entry) < 0)
      .forEach((chunkName) => {
        let settings = {};
        if (isString(entryPoints[chunkName])) {
          const settingsFile = resolve(this.context, entryPoints[chunkName].replace('.js', '.settings.js'));
          if (existsSync(settingsFile)) {
            settings = require(settingsFile);
            if (settings.default) {
              settings = settings.default;
            }
          }
        }

        // 配置优先级：
        // 1. entry.settings.js（单个页面有效）
        // 2. 注册路由时传递的选项参数（所有页面有效）
        // 3. 默认参数
        const args = {
          ...this.options,
          ...settings
        };

        const {
          title,
          template,
          // inject,
          favicon,
          keywords,
          description,
          // chunks,
          // excludeChunks,
          // chunksSortMode,
          // attrs,
          ...templateData
        } = args;

        let html = '';
        if (existsSync(template)) {
          const templateString = readFileSync(template, {
            encoding: 'utf-8'
          });
          html = templateString;
        } else {
          throw new Error(`\nNot found template at ${template}\n`);
        }

        html = this.injectTitle(html, title);
        html = this.injectMeta(html, favicon, keywords, description);
        // 替换格式为 __var__ 用户自定义变量
        html = html.replace(/__(\w+)__/gm, (re, $1) => templateData[$1] || '');

        this.pages[chunkName] = { args, html };
      });
  }

  getAssetsMap(compiler) {
    const { fileHashLength, templateEngine } = this.appConfig;

    Object.keys(this.pages).forEach((chunkName) => {
      const matches = [];
      const { args, html } = this.pages[chunkName];
      args.attrs.forEach((a) => {
        const { tag, attribute } = this.parseAttribute(a);
        const reg = templateEngine === 'pug' ?
          new RegExp(`${tag}(?:\\(.*\\s+|\\()(?:${attribute})\\s*=\\s*["']([^"']+)`, 'g') :
          new RegExp(`${tag}.*\\s+(?:${attribute})\\s*=\\s*["']([^"']+)`, 'g');
        let result;

        while(result = reg.exec(html)) { // eslint-disable-line
          const value = result[1];
          if (!/^(https{0,1}:){0,1}\/\//.test(value)) {
            const head = result[0].replace(value, ''); // => src="
            const file = resolve(this.context, value);
            if (existsSync(file) && statSync(file).isFile()) {
              const content = readFileSync(file);
              const {
                name,
                ext,
                dir // ,
                // base
              } = parse(value);
              const hash = this.getHashDigest(content);
              const pattern = '[path][name]_[hash:8].[ext]';
              const newValue = pattern
                .replace('[path]', dir ? `${dir}/` : '')
                .replace('[name]', name)
                .replace('[ext]', ext.replace('.', ''))
                .replace('[hash:8]', hash.substr(0, fileHashLength));
              const dist = resolve(compiler.options.output.path, newValue);
              mkdirp.sync(dirname(dist));
              if (!existsSync(dist)) {
                writeFileSync(dist, content);
              }
              matches.push({
                start: result.index + head.length,
                length: value.length,
                value,
                newValue
              });
            }
          }
        }
      });
      matches.sort((a, b) => a.start > b.start);
      this.pages[chunkName].matches = matches;
    });
  }

  output(compiler, stats) {
    const {
      path: { dist: { root: dist, templates } },
      commonChunks,
      templateExtension,
      templateInjectPosition
    } = this.appConfig;

    const templatePages = isString(templates) ? templates : templates.pages;
    let { publicPath } = compiler.options.output;
    if (!publicPath.endsWith('/')) {
      publicPath = `${publicPath}/`;
    }

    const chunkOnlyConfig = {
      assets: true,
      cached: false,
      children: false,
      chunks: true,
      chunkModules: false,
      chunkOrigins: false,
      errorDetails: false,
      hash: false,
      modules: false,
      reasons: false,
      source: false,
      timings: false,
      version: false
    };
    const statsJson = stats.compilation.getStats().toJson(chunkOnlyConfig);
    let allChunks = statsJson.chunks;
    allChunks = this.sortChunks(
      allChunks,
      this.options.chunksSortMode,
      stats.compilation.chunkGroups
    );

    Object.keys(this.pages).forEach((chunkName) => {
      const { matches, args: { inject } } = this.pages[chunkName];
      let { html } = this.pages[chunkName];

      html = html.split('');
      matches.reverse().forEach((link) => {
        const url = publicPath + link.newValue;
        html.splice(link.start, link.length, url);
      });
      html = html.join('');

      if (templateInjectPosition) {
        html = this.injectStyles(html, chunkName, allChunks, commonChunks, publicPath);
        html = this.injectScripts(html, chunkName, allChunks, commonChunks, publicPath, inject);
      }

      const filename = resolve(this.context, dist, templatePages, `${chunkName + templateExtension}`);
      mkdirp.sync(dirname(filename));
      writeFileSync(filename, html);
    });
  }

  copyAndReplaceLayout(compiler) {
    const {
      path: {
        src: {
          root: src,
          templates: {
            layout: srcLayout
          }
        },
        dist: {
          root: distRoot,
          templates: {
            layout: distLayout
          }
        }
      },
      fileHashLength
    } = this.appConfig;
    const { attrs } = this.options;

    let { publicPath } = compiler.options.output;
    if (!publicPath.endsWith('/')) {
      publicPath = `${publicPath}/`;
    }

    const layouts = glob('**/*.pug', { cwd: resolve(this.context, src, srcLayout) });

    layouts.forEach((layout) => {
      const absPath = resolve(this.context, src, srcLayout, layout);
      let html = readFileSync(absPath, {
        encoding: 'utf-8'
      });
      const matches = [];
      attrs.forEach((a) => {
        const { tag, attribute } = this.parseAttribute(a);
        const reg = new RegExp(`${tag}(?:\\(.*\\s+|\\()(?:${attribute})\\s*=\\s*["']([^"']+)`, 'g');
        let result;

        while(result = reg.exec(html)) { // eslint-disable-line
          const value = result[1];
          if (!/^(https{0,1}:){0,1}\/\//.test(value)) {
            const head = result[0].replace(value, ''); // => src="
            const file = resolve(this.context, value);
            if (existsSync(file) && statSync(file).isFile()) {
              const content = readFileSync(file);
              const { name, ext, dir } = parse(value);
              const hash = this.getHashDigest(content);
              const pattern = '[path][name]_[hash:8].[ext]';
              const newValue = pattern
                .replace('[path]', dir ? `${dir}/` : '')
                .replace('[name]', name)
                .replace('[ext]', ext.replace('.', ''))
                .replace('[hash:8]', hash.substr(0, fileHashLength));
              const dist = resolve(compiler.options.output.path, newValue);
              mkdirp.sync(dirname(dist));
              if (!existsSync(dist)) {
                writeFileSync(dist, content);
              }
              matches.push({
                start: result.index + head.length,
                length: value.length,
                value,
                newValue
              });
            }
          }
        }
      });
      matches.sort((a, b) => a.start > b.start);

      // 输出 layout
      html = html.split('');
      matches.reverse().forEach((link) => {
        const url = publicPath + link.newValue;
        html.splice(link.start, link.length, url);
      });

      const filename = resolve(this.context, distRoot, distLayout, layout);
      mkdirp.sync(dirname(filename));
      writeFileSync(filename, html.join(''));
    });
  }

  getHashDigest(content) {
    return loaderUtils.getHashDigest(content);
  }

  parseAttribute(attribute) {
    const arr = attribute.split(':');
    if (arr.length !== 2) {
      throw new Error(`[error] PackingTemplatePlugin: attributes 参数格式错误：${attribute}`);
    }
    return {
      tag: arr[0] === '*' ? '' : arr[0],
      attribute: arr[1].replace('-', '\\-')
    };
  }

  injectTitle(html, title) {
    const { templateEngine } = this.appConfig;
    if (title) {
      // 为 SEO 准备的页面 meta 信息
      if (templateEngine === 'pug') {
        html = `${html}\nblock title\n  title ${title}\n`;
      } else {
        html = html.replace(/__title__/g, title);
      }
    }
    return html;
  }

  injectMeta(html, favicon, keywords, description) {
    const { templateEngine } = this.appConfig;
    // 为 SEO 准备的页面 meta 信息
    if (templateEngine === 'pug') {
      const metaTags = [];
      if (keywords) {
        metaTags.push(`  meta(name="keywords" content="${keywords}")`);
      }
      if (description) {
        metaTags.push(`  meta(name="description" content="${description}")`);
      }
      if (favicon) {
        metaTags.push(`  link(rel="icon" type="image/png" href="${favicon}")`);
      }
      const metaHtml = metaTags.join('\n');
      if (metaHtml) {
        html = `${html}\nblock append meta\n${metaHtml}\n`;
      }
    } else {
      const metaTags = [];
      if (keywords) {
        metaTags.push(`  <meta name="keywords" content="${keywords}">`);
      }
      if (description) {
        metaTags.push(`  <meta name="description" content="${description}">`);
      }
      if (favicon) {
        metaTags.push(`  <link rel="icon" type="image/png" href="${favicon}">`);
      }
      const metaHtml = metaTags.join('\n');
      if (metaHtml) {
        html = html.replace('</head>', `${metaHtml}\n  </head>`);
      }
    }

    return html;
  }

  injectStyles(html, chunkName, allChunks, commonChunks, publicPath) {
    const { templateEngine } = this.appConfig;
    const styles = [];
    allChunks
      .filter((chunk) => {
        const name = chunk.names[0];
        return name === chunkName || Object.keys(commonChunks).indexOf(name) > -1;
      })
      .forEach((chunk) => {
        chunk.files
          .filter(file => file.endsWith('.css'))
          .forEach((file) => {
            styles.push(file);
          });
      });

    if (styles.length > 0) {
      let styleHtml;
      if (templateEngine === 'pug') {
        styleHtml = `block append style\n${
          styles
            .map(file => `  link(href="${publicPath + file}" rel="stylesheet")`)
            .join('\n')
        }`;
        html = `${html}\n${styleHtml}\n`;
      } else {
        styleHtml = styles
          .map(file => `  <link href="${publicPath + file}" rel="stylesheet">`)
          .join('\n');
        html = html.replace('</head>', `${styleHtml}\n  </head>`);
      }
    }

    return html;
  }

  injectScripts(html, chunkName, allChunks, commonChunks, publicPath, inject) {
    const { templateEngine } = this.appConfig;

    // common chunks 和 page chunk 脚本引用代码
    allChunks = allChunks
      // .filter(chunk => chunk.files[0].endsWith('.js'))
      .filter((chunk) => {
        const name = chunk.names[0];
        return name === chunkName || Object.keys(commonChunks).indexOf(name) > -1;
      });

    if (allChunks.length > 0) {
      const scriptHtml = allChunks
        .map((chunk) => {
          if (templateEngine === 'pug') {
            return chunk.files
              .filter(file => file.endsWith('.js'))
              .map(file => `  script(src="${publicPath + file}")`)
              .join('\n');
          }
          return chunk.files
            .filter(file => file.endsWith('.js'))
            .map(file => `  <script src="${publicPath + file}"></script>`)
            .join('\n');
        })
        .join('\n');

      if (templateEngine === 'pug') {
        html = `${html}\nblock append script\n${scriptHtml}\n`;
      } else {
        html = html.replace(`</${inject}>`, `${scriptHtml}\n  </${inject}>`);
      }
    }

    return html;
  }
}
