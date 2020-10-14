let keystone = require('keystone');
let Types = keystone.Field.Types;

var Availability = new keystone.List(('Availability'), {
    hidden:true
});

Availability.add({
    name: { type: String }
});

Availability.register();