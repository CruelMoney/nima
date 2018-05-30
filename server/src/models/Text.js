var keystone = require('keystone'),
Types = keystone.Field.Types;

var Text = new keystone.List('Text', {
hidden: false
});

Text.add({
key: { 
    type: String, 
    required: true, 
    initial: true
},
content: { type: String }
});


Text.register();