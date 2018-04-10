import path from 'path';

export default {
  template: path.resolve(__dirname, 'template.html'),
  favicon: 'images/favico.jpg',
  attrs: ['img:src', 'link:href', 'img:data-src', '*:test']
};
