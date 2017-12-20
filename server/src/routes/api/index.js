var keystone = require('keystone');
var restful = require('restful-keystone-onode')(keystone);
import * as fileupload from './fileUpload';
import * as pages from './pages';

const configurations = (req, res, next) => {
	SocialConfiguration.model.findOne({}, (err, social)=>{
        if (err) return next(err)
        GeneralConfiguration.model.findOne({}, (err, general)=>{
            if (err) return next(err)
            APIsConfiguration.model.findOne({}, (err, apis)=>{
                if (err) return next(err)
                const result = {
                data:{
                    general,
                    social,
                    apis
                }}
                return res.send(JSON.stringify(result));
            })
        }) 
    });
}


const setup = (app) => {
  app.all('/api*', keystone.middleware.api);
  
  app.get('/api/overviews/:id', pages.get);  
  app.get('/api/pages', pages.list);  

  restful.expose({
    BasePage : {
      path: 'pages',
      envelop: false,
      populate : ["tags", 'thumbnail'],
    },
    Overview : {
      envelop: false,
      populate : ["filters"],
    },
    Menu: {
      path : "menus",
      populate : ["pages"],
      envelop: false,
    },
    Text :{
      envelop: false,
    }
  })
  .start();

  //File Upload Route
  app.get('/api/fileupload/list', fileupload.list);
  app.get('/api/fileupload/:id', fileupload.get);
  app.all('/api/fileupload/:id/update', fileupload.update);
  app.all('/api/fileupload/create', fileupload.create);
  app.get('/api/fileupload/:id/remove', fileupload.remove);

}


export {
  setup,
  configurations
}