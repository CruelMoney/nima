require('dotenv').config();
require('isomorphic-fetch');
const keystone = require('keystone');
keystone.import('models');
const {setupUniversal} = require('./app');

console.log(process.env)

keystone.init({
  'name': 'NIMA CPH',
  'brand': 'NIMA CPH',
  'auto update': true,
  'mongo': process.env.MONGO_URL || 'mongodb://localhost/database',
  'session': true,
  'session store' : 'mongo',
  //"view cache" : false,
  'auth': true,
  'user model': 'User',
  'signin redirect': '/',
  'signout redirect': '/',
  'static': 'public',
  'port': process.env.PORT || 3001,
  'cookie secret': process.env.COOKIE_SECRET || "cookieSecret",
  'wysiwyg images': true,
  //'wysiwyg cloudinary images' : true, Does not seem to work
  'wysiwyg menubar': true,
  // 'wysiwyg additional buttons': 'searchreplace visualchars,'
  //   + ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
  //   +' emoticons media, preview print ',
   'wysiwyg additional plugins': 'autolink, paste, contextmenu',
   // 'example, table, advlist, anchor,'
  //   + ' autolink, autosave, bbcode, charmap, contextmenu, '
  //   + ' directionality, emoticons, fullpage, hr, media, pagebreak,'
  //   + ' paste, preview, print, searchreplace, textcolor,'
  //   + ' visualblocks, visualchars, wordcount ',
 // 'wysiwyg importcss': '/main.css',
 'wysiwyg additional options': { 
   'external_plugins': { 
     'uploadimage': '/assets/js/uploadimage.min.js' 
    }
  }
});

keystone.set('pre:routes', (app) => {
  setupUniversal(app);
});

keystone.start(()=>{
  // var route, routes = [];
  
  // keystone.app._router.stack.forEach(function(middleware){
  //     if(middleware.route){ // routes registered directly on the app
  //         routes.push(middleware.route);
  //     } else if(middleware.name === 'router'){ // router middleware 
  //         middleware.handle.stack.forEach(function(handler){
  //             route = handler.route;
  //             route && routes.push(route);
  //         });
  //     }
  // });
  
  // console.log(routes);

});





