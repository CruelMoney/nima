const apiAuthenticate = (req, res, next) => {
  if(!res.locals.user || !res.locals.user.canAccessKeystone){
     return res.apiNotAllowed('Authentication error', {message:"You are not authenticated to modify content."});
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
