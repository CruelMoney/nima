var keystone = require('keystone');
var restful = require('restful-keystone-onode')(keystone);
import * as fileupload from './fileUpload';
import * as pages from './pages';
import * as checkout from './checkout';
import * as coupon from './coupon';
import * as newsletter from './newsletter';

const setup = (app) => {
  app.all('/api*', keystone.middleware.api);
  
  app.get('/api/overviews/:id', pages.get);  
  app.all('/api/pages', pages.list);  

  app.all('/api/checkout', checkout.post);
  app.get('/api/coupon/:coupon_code', coupon.get);
  app.post('/api/newsletter', newsletter.post);

  restful.expose({
    BasePage : {
      path: 'pages',
      envelop: false,
      populate : ["tags", 'thumbnail'],
    },
    Configuration: {
      path: 'configuration',
      envelop: false
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
    ShippingOption: {
      path : "shipping",
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
  setup
}