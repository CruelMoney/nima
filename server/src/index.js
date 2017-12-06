require('dotenv').config();
require('isomorphic-fetch');
const {setupUniversal} = require('./app');
const keystone = require('keystone');
const PORT = process.env.PORT || 3001;
const cookieSecret = process.env.cookieSecret || 'secretCookie';

keystone.init({
  'name': 'Cude cms',
  'brand': 'Cude cms',
  'auto update': true,
  'mongo': process.env.MONGO_URL || 'mongodb://localhost/database',
  'session': true,
  'auth': true,
  'user model': 'User',
  'signin redirect': '/',
  'signout redirect': '/',
  'cookie secret': process.env.COOKIE_SECRET || cookieSecret,
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

keystone.import('models');

keystone.set('pre:routes', (app) => {
  setupUniversal(app);
});

keystone.start();



