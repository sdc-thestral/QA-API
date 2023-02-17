module.exports = (req, res, next) => {
  console.log('method: ', req.method, 'query param: ', req.query, 'body :', req.body, 'at url: ', req.url);
  next();
};
