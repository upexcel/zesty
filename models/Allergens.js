let keystone = require('keystone');
let Types = keystone.Field.Types;
const { Virtual } = require('@keystonejs/fields');

let Allergens = new keystone.List(('Allergens'), {
    hidden:true
});

Allergens.add({
name: { type: String }
});

Allergens.register();
