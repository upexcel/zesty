let keystone = require('keystone');
let Types = keystone.Field.Types;

var Date = new keystone.List(('Date'));

Date.add({
    date: {type: Types.Datetime},
    // availability: { type: Types.Relationship, ref: 'Availability', many: true, index: true },

});

Date.register();