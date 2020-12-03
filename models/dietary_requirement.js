let keystone = require('keystone');
let Types = keystone.Field.Types;

let dietary_requirement = new keystone.List('dietary_requirement');

dietary_requirement.add({
    name: { type: String }
});

dietary_requirement.register();