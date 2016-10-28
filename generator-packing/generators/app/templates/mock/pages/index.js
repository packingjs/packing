/**
 * 模版文件初始化数据模拟文件
 * 对应的URL为/
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module mock/pages/index
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 * @return {object} Mock json data
 */

 export default function(req, res) {
   return {
     name: 'Joe',
     greeting: 'Hi, there are some JScript books you may find interesting:',
     books : [
       {
         title: 'JavaScript: The Definitive Guide',
         author: 'David Flanagan',
         price: '31.18'
       },
       {
         title: 'Murach JavaScript and DOM Scripting',
         author: 'Ray Harris',
       },
       {
         title: 'Head First JavaScript',
         author: 'Michael Morrison',
         price: '29.54'
       }
     ]
   };
 };
