/**
 * 思路：
 *   1. 在 done 时根据 entries 信息生成网页并存储到 this.pages
 *      如果 autoGeneration=false 就读取存在的模版文件并存储到 this.pages
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
import { resolve, join, dirname, parse, isAbsolute } from 'path';
import { isString } from 'util';
import mkdirp from 'mkdirp';
import loaderUtils from 'loader-utils';
import glob from 'packing-glob';
import { requireDefault, getContext } from '..';
import getEntries from '../lib/get-entries';

export default class PackingTemplatePlugin {
  constructor(appConfig) {
    this.context = getContext();
    this.appConfig = appConfig;
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

  done(compiler, stats) {
    const {
      template: {
        options: {
          engine,
          autoGeneration
        }
      }
    } = this.appConfig;
    const statsJson = stats.compilation.getStats().toJson({
      all: false,
      entrypoints: true
    });
    // 记录所有页面入口和入口对应的 assets
    this.entrypoints = statsJson.entrypoints;

    if (autoGeneration) {
      this.generatePages();
    } else {
      this.readPages();
    }
    this.getAssetsMap(compiler);
    this.output(compiler);

    if (engine === 'pug') {
      this.copyAndReplaceLayout(compiler);
    }
  }

  generatePages() {
    const {
      path: { entries },
      commonChunks,
      template: {
        options: templateOptions
      }
    } = this.appConfig;

    // 该 entries 信息包含 commonChunks 配置
    const entryPoints = getEntries(entries);
    Object.keys(entryPoints)
      // 排除 commonChunks 入口
      .filter(entry => Object.keys(commonChunks).indexOf(entry) < 0)
      .forEach((chunkName) => {
        let settings = {};
        if (isString(entryPoints[chunkName])) {
          const settingsFile = resolve(this.context, entryPoints[chunkName].replace('.js', '.settings.js'));
          if (existsSync(settingsFile)) {
            settings = requireDefault(settingsFile);
          }
        }

        const args = { ...templateOptions, ...settings };
        const {
          title,
          master,
          favicon,
          keywords,
          description,
          ...templateData
        } = args;

        let html = '';
        const parent = isAbsolute(master) ? master : resolve(this.context, master);
        if (existsSync(parent)) {
          const templateString = readFileSync(parent, {
            encoding: 'utf-8'
          });
          html = templateString;
        } else {
          throw new Error(`\nNot found template at ${parent}\n`);
        }

        html = this.injectTitle(html, title);
        html = this.injectMeta(html, favicon, keywords, description);
        // 替换格式为 __var__ 用户自定义变量
        html = html.replace(/__(\w+)__/gm, (re, $1) => templateData[$1] || '');

        this.pages[chunkName] = { args, html };
      });
  }

  /**
   * 读取已有的模版文件
   */
  readPages() {
    const {
      path: {
        src: {
          root: src,
          templates
        }
      },
      template: {
        options: {
          extension
        }
      }
    } = this.appConfig;

    const tempagePages = templates.pages || templates;
    const templateRoot = resolve(getContext(), src, tempagePages);
    glob(`**/*${extension}`, { cwd: templateRoot }).forEach((file) => {
      const html = readFileSync(resolve(templateRoot, file), {
        encoding: 'utf-8'
      });
      const args = this.appConfig.template.options;
      this.pages[file.replace(extension, '')] = { args, html };
    });
  }

  getAssetsMap(compiler) {
    const { engine, path: outputPath } = this.appConfig.template.options;

    Object.keys(this.pages).forEach((chunkName) => {
      const matches = [];
      const { args, html } = this.pages[chunkName];
      args.attrs.forEach((a) => {
        const { tag, attribute } = this.parseAttribute(a);
        const reg = engine === 'pug' ?
          new RegExp(`${tag}(?:\\(.*\\s+|\\()(?:${attribute})\\s*=\\s*["']([^"']+)`, 'g') :
          new RegExp(`${tag}.*\\s+(?:${attribute})\\s*=\\s*["']([^"']+)`, 'g');

        let result;
        while(result = reg.exec(html)) { // eslint-disable-line
          const value = result[1];
          if (!/^(https{0,1}:){0,1}\/\//.test(value)) {
            const head = result[0].replace(value, ''); // => src="
            const file = join(this.context, value);
            if (existsSync(file) && statSync(file).isFile()) {
              const content = readFileSync(file);
              const { name, ext, dir } = parse(value);
              const hash = this.getHashDigest(content);
              const newValue = outputPath
                .replace('[path]', dir ? `${dir}/` : '')
                .replace('[name]', name)
                .replace('[ext]', ext.replace('.', ''))
                .replace(/\[hash(:{0,1}\d{0,2})\]/, (pattern) => {
                  let hashLength = 32;
                  if (pattern) {
                    const hashLengthMatches = pattern.match(/\[hash:(\d{1,2})\]/);
                    if (hashLengthMatches && hashLengthMatches[1]) {
                      [, hashLength] = hashLengthMatches; // eslint disable line
                    }
                  }
                  return hash.substr(0, hashLength);
                });

              const dist = join(compiler.options.output.path, newValue);
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

  output(compiler) {
    const {
      path: { dist: { root: dist, templates } },
      template: {
        options: {
          extension,
          injectManifest
        }
      }
    } = this.appConfig;

    const templatePages = templates.pages || templates;
    let { publicPath } = compiler.options.output;
    if (!publicPath.endsWith('/')) {
      publicPath = `${publicPath}/`;
    }
    Object.keys(this.pages).forEach((chunkName) => {
      const { matches, args: { inject } } = this.pages[chunkName];
      let { html } = this.pages[chunkName];

      html = html.split('');
      // 替换模版中的 src="x.png" -> src="x_xxxxxxxx.png"
      matches.reverse().forEach((link) => {
        const url = publicPath + (link.newValue.startsWith('/') ? link.newValue.substring(1, link.newValue.length) : link.newValue);
        html.splice(link.start, link.length, url);
      });
      html = html.join('');

      // 当前页面使用到的所有 asets
      const { assets } = this.entrypoints[chunkName];
      if (inject && assets) {
        html = this.injectStyles(html, chunkName, assets, publicPath);
        html = this.injectScripts(html, chunkName, assets, publicPath);
      }

      if (injectManifest) {
        html = this.injectManifest(html, this.getManifestFileName(compiler), publicPath);
      }

      const filename = resolve(this.context, dist, templatePages, `${chunkName + extension}`);
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
      template: {
        options: templateOptions
      }
    } = this.appConfig;
    const { attrs } = templateOptions;

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
              const newValue = templateOptions.path
                .replace('[path]', dir ? `${dir}/` : '')
                .replace('[name]', name)
                .replace('[ext]', ext.replace('.', ''))
                .replace(/\[hash(:{0,1}\d{0,2})\]/, (pattern) => {
                  let hashLength = 32;
                  if (pattern) {
                    const hashLengthMatches = pattern.match(/\[hash:(\d{1,2})\]/);
                    if (hashLengthMatches && hashLengthMatches[1]) {
                      [, hashLength] = hashLengthMatches;
                    }
                  }
                  return hash.substr(0, hashLength);
                });
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

  getManifestFileName(compiler) {
    let pwaAssets;

    compiler.options.plugins
      .filter(p => p.constructor.name === 'WebpackPwaManifest')
      .forEach((p) => {
        pwaAssets = p.assets;
      });

    if (pwaAssets) {
      return pwaAssets.filter(asset => /manifest\w*.json/.test(asset.output))[0].output;
    }
    return '';
  }

  injectTitle(html, title) {
    const { template: { options: { engine } } } = this.appConfig;
    if (title) {
      // 为 SEO 准备的页面 meta 信息
      if (engine === 'pug') {
        html = `${html}\nblock title\n  title ${title}\n`;
      } else {
        html = html.replace(/__title__/g, title);
      }
    }
    return html;
  }

  injectMeta(html, favicon, keywords, description) {
    const { template: { options: { engine } } } = this.appConfig;
    // 为 SEO 准备的页面 meta 信息
    if (engine === 'pug') {
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

  injectManifest(html, filename, publicPath) {
    const { template: { options: { engine } } } = this.appConfig;
    // 为 SEO 准备的页面 meta 信息
    if (engine === 'pug') {
      return `${html}\nblock append meta\n  link(rel="manifest" href="${publicPath}${filename}")\n`;
    }
    return html.replace('</head>', `  <link rel="manifest" href="${publicPath}${filename}">\n  </head>`);
  }

  injectStyles(html, chunkName, assets, publicPath) {
    const { template: { options: { engine } } } = this.appConfig;
    const styles = assets.filter(asset => asset.endsWith('.css'));

    if (styles.length > 0) {
      let styleHtml;
      if (engine === 'pug') {
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

  injectScripts(html, chunkName, assets, publicPath) {
    const { template: { options: { engine, scriptInjectPosition } } } = this.appConfig;

    const scripts = assets.filter(asset => asset.endsWith('.js'));
    if (engine === 'pug') {
      const scriptPug = scripts
        .map(asset => `  script(src="${publicPath + asset}")`)
        .join('\n');
      html = `${html}\nblock append script\n${scriptPug}\n`;
    } else {
      const scriptHtml = scripts
        .map(asset => `  <script src="${publicPath + asset}"></script>`)
        .join('\n');
      html = html.replace(`</${scriptInjectPosition}>`, `${scriptHtml}\n  </${scriptInjectPosition}>`);
    }

    return html;
  }
}
