var keystone = require('keystone');
var restful = require('restful-keystone-onode')(keystone);
import * as fileupload from './fileUpload';

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

const pages = (req, res, next) => {
  const Page = keystone.list('BasePage');
  
	Page.model.find({}, (err, pages)=>{
        if (err) return next(err)
        return res.send(JSON.stringify(
          {
            data: pages
          }
        ));
  })        
}

const setup = (app) => {
  app.all('/api*', keystone.middleware.api);
  
  restful.expose({
    BasePage : {
      path : "pages",
      envelop: false,
      // filter : {
      //   state: "published"
      // },
      // populate : ["categories", "skills", "images"],
    },
    Menu: {
      path : "menus",
      populate : ["pages"],
      envelop: false,
    },
    Text :{
      envelop: false,
    },
    CudeImage: true
  }).start();


  //File Upload Route
  app.get('/api/fileupload/list', fileupload.list);
  app.get('/api/fileupload/:id', fileupload.get);
  app.all('/api/fileupload/:id/update', fileupload.update);
  app.all('/api/fileupload/create', fileupload.create);
  app.get('/api/fileupload/:id/remove', fileupload.remove);
  
}


export {
  setup,
  configurations,
  pages
}