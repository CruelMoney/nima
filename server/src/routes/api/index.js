var keystone = require('keystone');
var restful = require('restful-keystone-onode')(keystone);

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
      populate : ["pages"],
      envelop: false,
    },
    Text : true,
    CudeImage: true
  }).start();
}


export {
  setup,
  configurations,
  pages
}