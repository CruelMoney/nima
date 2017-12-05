'use strict';
const keystone = require( 'keystone');
const Types = keystone.Field.Types;

var BasePage = new keystone.List('BasePage', {
    map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	hidden: true
	});
BasePage.add(
	{
		title: { type: String, required: true },
		slug: { type: String, readonly: true },
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