module.exports = (req, res, next) => {
  console.log('method: ', req.method, 'query param: ', req.query, 'param: ', req.params, 'body :', req.body, 'at url: ', req.url);
  next();
};
