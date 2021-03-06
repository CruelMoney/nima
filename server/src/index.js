require('dotenv').config();
require('isomorphic-fetch');
const keystone = require('keystone');

keystone.import('models');
const { setupUniversal } = require('./app');
const createRoutes = require('./routes');

console.log({ mongoUrl: process.env.MONGO_URL });

keystone.init({
  name: 'nimacph.',
  brand: 'nimacph.',
  'auto update': false,
  mongo: process.env.MONGO_URL || 'mongodb://localhost/database',
  session: true,
  'session store': 'mongo',
  // "view cache" : false,
  auth: true,
  'user model': 'User',
  'signin redirect': '/',
  'signout redirect': '/',
  static: 'public',
  port: process.env.PORT || 3001,
  'cookie secret': process.env.COOKIE_SECRET || 'cookieSecret',
  'wysiwyg images': true,
  // 'wysiwyg cloudinary images' : true, Does not seem to work
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
    external_plugins: {
      uploadimage: '/assets/js/uploadimage.min.js',
    },
  },
});

keystone.set('pre:routes', (app) => {
  createRoutes(app);
  setupUniversal(app);
});

keystone.start(() => {});
