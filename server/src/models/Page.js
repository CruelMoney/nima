'use strict';
const keystone = require('keystone');
const Types = keystone.Field.Types;

const Tag = new keystone.List('Tag', {
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
		hidden: false,
		track: {
			createdAt: true,
			createdBy: false,
			updatedAt: true,
			updatedBy: false,
		}
	});
BasePage.add(
	{
		title: { type: String, required: true },
		description: {type: String},
		slug: { type: String, readonly: true },
		thumbnail: { type: Types.Relationship, ref: 'FileUpload', many: false, createInline: true },
		tags: { type: Types.Relationship, ref: 'Tag', many: true, createInline: true },
		order: {type: Types.Number },
	}
);
BasePage.register();


var Overview = new keystone.List('Overview', { 
    inherits: BasePage
});
Overview.add({
	filters: { type: Types.Relationship, ref: 'Tag', many: true },
});


Overview.register();


var Product = new keystone.List('Product', { 
	inherits: BasePage, 
	defaultColumns: "title, tags, price",
});
Product.add({
	price: { type: Types.Money, format: '0.0,00 DKK'},
	stock: { type: Types.Text },
	SKU: { type: String, required: true, initial:true },
	// stock format:
	// {
	//   sizes: {
	//     "small": { stock: 10 },
	//     "medium": { stock: 10 }
	//   }
	// }
});
  
Product.register();





exports = module.exports = {
    BasePage
}

