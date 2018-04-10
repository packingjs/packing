import { existsSync, readFileSync } from 'fs';
import { resolve, dirname, isAbsolute } from 'path';
import { isObject } from 'util';
import { requireDefault, getContext } from '..';
import getEntries from '../lib/getEntries';

function injectTitle(html, templateEngine, title) {
  if (title) {
    // 为 SEO 准备的页面 meta 信息
    if (templateEngine === 'pug') {
      html = `${html}\nblock title\n  title ${title}\n`;
    } else {
      html = html.replace('__title__', title);
    }
  }
  return html;
}

function injectMeta(html, templateEngine, favicon, keywords, description) {
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

function injectManifest(html, templateEngine, manifest) {
  if (templateEngine === 'pug') {
    return `${html}\nblock append meta\n  link(rel="manifest" href="${manifest}")\n`;
  }
  return html.replace('</head>', `  <link rel="manifest" href="${manifest}">\n  </head>`);
}

function injectStyles(html, templateEngine, chunkName, allChunks, commonChunks) {
  const publicPath = '/';
  const styles = Object.keys(allChunks)
    .filter(key => allChunks[key].endsWith('.css'))
    .filter(key => key === chunkName || Object.keys(commonChunks).indexOf(key) > -1)
    .map(key => allChunks[key]);

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

// eslint-disable-next-line
function injectScripts(html, templateEngine, chunkName, allChunks, commonChunks, scriptInjectPosition) {
  const publicPath = '/';
  const scripts = Object.keys(allChunks)
    .filter(key => allChunks[key].endsWith('.js'))
    .filter(key => key === chunkName || Object.keys(commonChunks).indexOf(key) > -1)
    .map(key => allChunks[key]);

  if (isObject(commonChunks)) {
    Object.keys(commonChunks).forEach((name) => {
      scripts.unshift(`${name}.js`);
    });
  }

  if (scripts.length > 0) {
    let scriptHtml;
    if (templateEngine === 'pug') {
      scriptHtml = `block append script\n${
        scripts
          .map(file => `  script(src="${publicPath + file}")`)
          .join('\n')
      }`;
      html = `${html}\n${scriptHtml}\n`;
    } else {
      scriptHtml = scripts
        .map(file => `  <script src="${publicPath + file}"></script>`)
        .join('\n');
      html = html.replace(`</${scriptInjectPosition}>`, `${scriptHtml}\n  </scriptInjectPosition>`);
    }
  }

  return html;
}

export default (app, appConfig) => {
  const context = getContext();
  const {
    path: {
      entries,
      src: {
        root: src,
        templates
      },
      mockPages
    },
    commonChunks,
    template: {
      engine,
      extension,
      scriptInjectPosition,
      injectManifestEnable,
      manifest,
      autoGeneration
    },
    rewriteRules
  } = appConfig;

  const templatePages = templates.pages || templates;

  // 根据 entry 信息在 express 中添加路由
  const entryPoints = getEntries(entries);
  Object.keys(entryPoints).forEach((chunkName) => {
    app.get(`/${chunkName}`, (req, res, next) => {
      const settingsFile = resolve(context, entryPoints[chunkName].replace('.js', '.settings.js'));
      let settings = {};
      if (existsSync(settingsFile)) {
        settings = requireDefault(settingsFile);
      }

      const {
        title,
        source,
        inject,
        favicon,
        keywords,
        description,
        ...templateData
      } = {
        ...appConfig.template,
        ...settings
      };

      const { assetsByChunkName } = res.locals.webpackStats.toJson();

      let html = '';
      const chunkNameMapTemplate = resolve(context, src, `${templatePages}/${chunkName}${extension}`);
      const parent = isAbsolute(source) ? source : resolve(context, source);
      if (autoGeneration && existsSync(parent)) {
        const templateString = readFileSync(parent, {
          encoding: 'utf-8'
        });
        html = templateString;
      } else if (existsSync(chunkNameMapTemplate)) { // 兼容 v3 以下版本
        const templateString = readFileSync(chunkNameMapTemplate, {
          encoding: 'utf-8'
        });
        html = templateString;
      } else {
        throw new Error(`Not found template at ${parent}`);
      }

      html = injectTitle(html, engine, title);
      html = injectMeta(html, engine, favicon, keywords, description);
      if (injectManifestEnable) {
        html = injectManifest(html, engine, manifest);
      }
      if (inject) {
        html = injectStyles(html, engine, chunkName, assetsByChunkName, commonChunks);
        html = injectScripts(html, engine, chunkName, assetsByChunkName, commonChunks, scriptInjectPosition); // eslint-disable-line
      }
      html = html
        // 替换格式为 __var__ 用户自定义变量
        .replace(/__(\w+)__/gm, (re, $1) => templateData[$1] || '');

      if (engine === 'html') {
        res.send(html);
      } else {
        // 将模版内容传递到下一个中间件处理
        res.filename = parent;
        res.basedir = dirname(resolve(context, src, templatePages));
        res.template = html;
        next();
      }
    });

    if (engine !== 'html') {
      const parser = require(`packing-template-${engine}`);
      app.get(`/${chunkName}`, parser({
        mockData: mockPages,
        // templates: dirname(templatePages),
        rewriteRules
      }));
    }
  });
};
