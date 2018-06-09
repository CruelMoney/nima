const apiAuthenticate = (req, res, next) => {
  console.log(res.locals.user )
  if(!res.locals.user || !res.locals.user.canAccessKeystone){
     return res.status(401).json({ 'error': 'no access' });
  }
  next()
}

const initLocals = function(req, res, next) {
  var locals = res.locals;
  locals.user = req.user 
  next();
};

exports = module.exports = {
  apiAuthenticate,
  initLocals
}
