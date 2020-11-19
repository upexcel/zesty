let keystone = require('keystone');
let Types = keystone.Field.Types;

let Sweetlevel = new keystone.List('Sweetlevel');

Sweetlevel.add({
    name: { type: String }
});

Sweetlevel.register();