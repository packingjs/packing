/**
 * 模版文件初始化数据模拟文件
 * 对应的URL为/
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module mock/pages/__global
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 * @return {object} Mock json data
 */

 export default function(req, res) {
   return {
     isLogin: true,
     deep: {
       a: {
         b: 'deep value'
       }
     }
   };
 };
