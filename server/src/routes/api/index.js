var keystone = require('keystone');
var restful = require('restful-keystone-onode')(keystone);
import * as fileupload from './fileUpload';
import * as text from './text';
import * as pages from './pages';
import * as checkout from './checkout';
import * as coupon from './coupon';
import * as newsletter from './newsletter';
import * as shipping from './shipping';
import * as order from './order';
import * as instagram from './instagram';

const setup = (app) => {
  app.all('/api*', keystone.middleware.api);
  
  app.get('/api/overviews/:id', pages.get);  
  app.all('/api/pages', pages.list);  
  app.all('/api/checkout', checkout.post);
  app.post('/api/deliveryPoints', checkout.deliveryPoints);
  app.post('/api/confirm', checkout.confirmOrder);
  app.get('/api/coupon/:coupon_code', coupon.get);
  app.post('/api/newsletter', newsletter.post);
  app.get('/api/payment/:chargeID', order.getPaymentStatus)
  app.post('/api/admin/refund', order.refund);

  app.get('/api/shipment/:id', shipping.get);
  app.get('/api/shipping/countries', shipping.getAvailableCountries);
  // app.get('/api/shipping', shipping.getAll);
  // app.post('/api/shipping', shipping.post);

  app.get('/api/instagram', instagram.get);

  restful.expose({
    BasePage : {
      path: 'pages',
      envelop: false,
      populate : ["tags", 'thumbnail'],
    },
    Configuration: {
      path: 'configuration',
      populate : ["siteMeta.image"],
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
      path : "shipping/option",
      envelop: false,
    },
    ShippingZone: {
      path : "shipping/zone",
      envelop: false,
      populateAdv : { 
        path: 'shippingRates',
        populate : { 
          path: 'shippingMethod',
        }
      }
    },
    ShippingRate: {
      path : "shipping/rate",
      envelop: false,
      populate : "shippingMethod"
    },
    ShippingMethod: {
      path : "shipping/method",
      envelop: false,
    },
    Order : {
      envelop: false,
      path: 'admin/orders',
    },
    Coupon : {
      envelop: false,
      path: 'admin/discounts',
    },
    User : {
      envelop: false,
      path: 'admin/customers',
    },
    Product : {
      envelop: false,
      path: 'admin/products',
      populate : ["tags", 'thumbnail'],
    },
  })
  .start();

  // Text
  app.get('/api/texts', text.list);
  app.post('/api/texts', text.post);
  app.all('/api/texts/:id', text.update);

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