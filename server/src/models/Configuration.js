'use strict';
const keystone = require( 'keystone');
const Types = keystone.Field.Types;


var Configuration = new keystone.List('Configuration');
Configuration.add({});
Configuration.register();

var SocialConfiguration = new keystone.List('SocialConfiguration', {
    inherits: Configuration,
    plural: "Social",
    label: "Social",
    nocreate: true, //Single item
    nodelete: true, //Single item
});
SocialConfiguration.add({ 
    name: {type: String, default: "Social", noedit:true, hidden:true},
    social:{
        facebook:{ type: Types.Url },
        twitter:{ type: Types.Url },
        instagram:{ type: Types.Url },
        snapchat:{ type: Types.Url },
        youtube:{ type: Types.Url },
    },
});
SocialConfiguration.defaultColumns = 'name|16%, social.facebook|16%, social.twitter|16%, social.instagram|16%', 'social.snapchat|16%', 'social.youtube|16%';
SocialConfiguration.register();


var APIsConfiguration = new keystone.List('APIsConfiguration', {
    inherits: Configuration, 
    label: "APIs",
    nocreate: true, //Single item
    nodelete: true, //Single item
});
APIsConfiguration.add({ 
    name: {type: String, default: "APIs", noedit:true, hidden:true},
    key: {
        analytics: { type: String},
        facebookPixel: { type: String},
        twitter: { type: String },
        instagram: { type: String },
        stripePublic: { type: String },
        mailgun:  { type: String }
    },
});

APIsConfiguration.register();


var GeneralConfiguration = new keystone.List('GeneralConfiguration', { 
    inherits: Configuration,
    label: "General",
    nocreate: true, //Single item
    nodelete: true, //Single item
});
GeneralConfiguration.add({ 
    name: {type: String, default: "General", noedit:true, hidden:true},
    contact:{
        email: {type: Types.Email, displayGravatar: true},
        phone: {type: String},
        address: {type: Types.Location, defaults: { country: 'Denmark' }},
        cvr: { type: String, label: "CVR"},
    }
});
GeneralConfiguration.defaultColumns = 'name, contact.email|20%, contact.phone|20%, contact.cvr|20%';


GeneralConfiguration.register();

exports = module.exports = {
    GeneralConfiguration,
    SocialConfiguration,
    APIsConfiguration,
}

