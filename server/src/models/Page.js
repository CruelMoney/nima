'use strict';
const keystone = require( 'keystone');
const { myStorage } = require('./FileUpload');
const Types = keystone.Field.Types;

var Tag = new keystone.List('Tag', {
	hidden: true
	});
Tag.add(
	{
		name: { type: String, required: true, unique: true },
	}
);
Tag.register();

var BasePage = new keystone.List('BasePage', {
    map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	hidden: false
	});
BasePage.add(
	{
		title: { type: String, required: true },
		slug: { type: String, readonly: true },
		thumbnail:  { 
			type: Types.File,
			storage: myStorage
		},
		tags: { type: Types.Relationship, ref: 'Tag', many: true, createInline: true }		
	}
);
BasePage.register();


var Homepage = new keystone.List('Homepage', { 
    inherits: BasePage, 
	hidden: false,
	label: "homepage",
    nocreate: true, //Single item
    nodelete: true, //Single item
});
Homepage.add({ });

Homepage.register();

exports = module.exports = {
    BasePage
}