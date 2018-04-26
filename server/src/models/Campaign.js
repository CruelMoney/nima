const keystone = require( 'keystone');
const mongoose = require('mongoose')
const Types = keystone.Field.Types;

const Campaign = new keystone.List('Campaign', {
  defaultColumns: "name, campaignType",
  defaultSort: '-name',
});

Campaign.add({
    name          : { type: String        , required  : true, initial: true               },
    campaignType: { type: Types.Select  , numeric: true, options: [{ value: 1, label: 'Coupon code on order' }], required: true, initial: true },
    type      : { dependsOn: { campaignType: [1] }, type: Types.Select  , options   : 'Percentage, Value', required: true, initial: true, note: "Is the discount a percentage of the order or a fixed amount?" },
    discount  : { dependsOn: { campaignType: [1] }, type: Number        , required  : true, initial: true, note: "The actual discount, if the type is percentage enter a number between 0 and 100, otherwise any number."                                },
});

Campaign.register();

