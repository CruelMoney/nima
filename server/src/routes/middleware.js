const adminOnly = (req, res, next) => {
  if(!res.locals.user || !res.locals.user.canAccessKeystone){
    res.status(401).json({ 'error': 'no access' });
  }
  next();
}

const initLocals = function(req, res, next) {
  var locals = res.locals;
  locals.user = req.user 
  next();
};

exports = module.exports = {
  adminOnly,
  initLocals
}
