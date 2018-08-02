var keystone = require('keystone');
var Types = keystone.Field.Types;
var namefunctions = require('keystone-storage-namefunctions')
/**
 * File Upload Model
 * ===========
 * A database model for uploading images to the local file system
 */

var FileUpload = new keystone.List('FileUpload');
var Adapter = keystone.Storage.Adapters.FS;

var myStorage = new keystone.Storage({
    adapter: Adapter,
    fs: {
        path: keystone.expandPath('public/uploads/files'), // required; path where the files should be stored
        publicPath: '/uploads/files', // path where files will be served
        whenExists: "overwrite",
        generateFilename: function(filename, callback){
            console.log({filename})
            return namefunctions.contentHashFilename(filename, callback)
        }
        
       
    },
});

FileUpload.add({
  name: { type: Types.Key, index: { unique: true } },
  file: { 
    type: Types.File,
    storage: myStorage,
    initial: true
	},
  createdTimeStamp: { type: Types.Datetime, default: Date.now },
  alt1: { type: String, initial: true },
  attributes1: { type: String },
  category: { type: String },      //Used to categorize widgets.
  priorityId: { type: String },    //Used to prioritize display order.
  parent: { type: String },
  children: { type: String },
  url: {type: String},
  fileType: {type: String}
});


FileUpload.defaultColumns = 'name';
FileUpload.register();

exports = module.exports = { FileUpload, myStorage }