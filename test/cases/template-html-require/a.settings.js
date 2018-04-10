import path from 'path';

export default {
  source: path.resolve(__dirname, 'template.html'),
  favicon: 'images/favico.jpg',
  attrs: ['img:src', 'link:href', 'img:data-src', '*:test']
};
