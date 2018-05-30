var async = require('async'),
keystone = require('keystone');
var exec = require('child_process').exec;
var fs = require('fs');
var Text = keystone.list('Text');

/**
 * List Texts
 */
exports.list = function(req, res) {
  Text.model.find(function(err, items) {

    if (err) return res.apiError('database error', err);

    res.apiResponse({results:items})
  });
}


/**
 * Update Text 
 */
exports.update = function(req, res) {
  Text.model.findByIdAndUpdate(req.params.id, req.body, { upsert : true }, function(err, result){
    if (err) return res.apiError('database error', err);
    res.apiResponse(result)
  });
}

exports.post = function(req, res) {
  Text.model.create(req.body, function(err, result){
    if (err) return res.apiError('database error', err);
    res.apiResponse(result)
  });
}
