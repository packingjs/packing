export default (req, res) => {
  const data = {
    name: 'Joe'
  };
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};
