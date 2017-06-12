/**
 * 模版文件初始化数据模拟文件
 * 对应的模版为template/index
 * @author Joe Zhong <zhong.zhi@163.com>
 * @module mock/pages/index
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 * @return {object} Mock json data
 */

 import axios from 'axios';

 export default function(req, res) {
    return new Promise(function(resolve, reject) {
      axios.get('http://httpbin.org/get').then((res) => {
        resolve({ ...res.data });
      }, (error) => {
        reject(error)
      })
    });
 };
