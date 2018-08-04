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

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }
  

var myStorage = new keystone.Storage({
    adapter: Adapter,
    fs: {
        path: keystone.expandPath('public/uploads/files'), // required; path where the files should be stored
        publicPath: '/uploads/files', // path where files will be served
        whenExists: "overwrite",
        generateFilename: function(file, i, callback){
            file.extension = getFileExtension(file.originalname);
            namefunctions.contentHashFilename(file, i, callback);
        }  
    }
});

FileUpload.add({
  name: { type: Types.Key },
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

// Capture stripe payment when order isSent
FileUpload.schema.pre('save', function(next) {
    this.url = ('/uploads/files/'+this.file.filename);
    next();
});


FileUpload.defaultColumns = 'name';
FileUpload.register();

exports = module.exports = { FileUpload, myStorage }