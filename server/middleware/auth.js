module.exports = function(req, res, next) {
  if (!req?.headers?.authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
    next();
};