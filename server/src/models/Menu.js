'use strict';
const keystone = require( 'keystone');
const Types = keystone.Field.Types;

var Menu = new keystone.List('Menu', {
	  autokey: { path: 'slug', from: 'name', unique: true },
	});
Menu.add(
	{
	name: { type: String, required: true },
	bannerText: { type: String, required: false },
    pages: { type: Types.Relationship, ref: 'BasePage', many: true }
	}
);
Menu.register();

exports = module.exports = {
    Menu
}