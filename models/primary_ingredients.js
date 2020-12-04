let keystone = require('keystone');
let Types = keystone.Field.Types;

let primary_ingredeints = new keystone.List('primary_ingredeints');

primary_ingredeints.add({
    name: { type: String }
});

primary_ingredeints.register();