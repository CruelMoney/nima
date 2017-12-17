var async = require('async'),
keystone = require('keystone');
var Overview = keystone.list('Overview');
var BasePage = keystone.list('BasePage');

/**
 * List pages
 */
exports.list = function(req, res) {
  BasePage.model.find(function(err, pages) {

    if (err) return res.apiError('database error', err);

    res.apiResponse({
      results: pages
    })
  });
}

/**
 * Get Overview by ID
 */
exports.get = function(req, res) {
  Overview.model.findById(req.params.id).exec(function(err, overview) {
    if (err) return res.apiError('database error', err);
    if (!overview) return res.apiError('not found');
    
    //Populate the children
    BasePage.model.find()
    .where('tags')
    .populate(['thumbnail', 'tags'])
    .in(overview.filters)
    .exec(function(err, posts) {
      overview.children = posts	
      res.apiResponse({
        overview,
        children: posts
      }); 
    });
  });
}