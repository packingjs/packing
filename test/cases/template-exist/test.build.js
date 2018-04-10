import { readFileSync, existsSync } from 'fs';
import rimraf from 'rimraf';
import { exec, getTestCaseName } from '../../util';

describe(`${getTestCaseName()}(${process.env.NODE_ENV})`, async () => {
  let html;
  let publicPath;
  before(async () => {
    publicPath = process.env.NODE_ENV === 'local' ?
      '/' :
      '//q.qunarzz.com/__xxxx__/prd/';
    const cmd = 'node_modules/.bin/babel-node src/bin/packing.js build';
    const stdout = await exec(cmd);
    if (process.env.DEBUG) {
      console.log(stdout);
    }
  });

  after(async () => {
    // 删除临时文件
    if (!process.env.DEBUG) {
      rimraf.sync(`${__dirname}/prd`);
    }
  });

  it('应该能正常编译出母模版', async () => {
    const htmlFile = `${__dirname}/prd/templates/layout/default.pug`;
    existsSync(htmlFile).should.be.true();
    html = readFileSync(htmlFile, 'utf8');
  });

  it('应该替换母模版中的一级目录图片地址', async () => {
    html.should.match(new RegExp(`src="${publicPath}assets/1_\\w{8}.jpg"`));
  });

  it('应该替换母模版中的二级目录图片地址', async () => {
    html.should.match(new RegExp(`src="${publicPath}assets/images/2_\\w{8}.jpg"`));
  });

  it('应该能复制已经存在的模版', async () => {
    const htmlFile = `${__dirname}/prd/templates/pages/a.pug`;
    existsSync(htmlFile).should.be.true();
    html = readFileSync(htmlFile, 'utf8');
  });

  it('应该替换入口网页中的一级目录图片地址', async () => {
    html.should.match(new RegExp(`src="${publicPath}assets/1_\\w{8}.jpg"`));
  });

  it('应该正确替换不同目录下同名的图片地址', async () => {
    html.should.match(new RegExp(`src="${publicPath}assets/images/1_\\w{8}.jpg"`));
  });

  it('网络图片应该保持原有网络地址', async () => {
    html.should.match(new RegExp('src="//qzz.com/assets/images/2.jpg"'));
  });

  it('应该替换多次引用的图片地址', async () => {
    const matches = html.match(new RegExp(`src="${publicPath}assets/1_\\w{8}.jpg"`, 'g'));
    matches.should.have.length(2);
  });

  it('应该替换 img 标签中的 data-src 属性', async () => {
    html.should.match(new RegExp(`data-src="${publicPath}assets/images/2_\\w{8}.jpg"`));
  });

  it('应该不替换 img 标签中的 alt 属性', async () => {
    html.should.match(/alt="\/assets\/images\/1.jpg"/);
  });

  it('应该替换所有标签中的 test 属性', async () => {
    const matches = html.match(new RegExp(`test="${publicPath}assets/images/2_\\w{8}.jpg"`, 'g'));
    matches.should.have.length(2);
  });
});
