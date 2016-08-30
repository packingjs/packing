/**
 * Ajax异步请求数据模拟文件
 * 对应的URL为/api/test
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {JSON} mock json data
 */
export default (req, res) => {
  const data = {
    name: 'Joe'
  };
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};
