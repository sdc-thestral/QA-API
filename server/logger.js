module.exports = (req, res, next) => {
  console.log('method: ', req.method, 'query param: ', req.query, 'at url: ', req.url);
  next();
};
