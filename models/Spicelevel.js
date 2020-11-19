let keystone = require('keystone');
let Types = keystone.Field.Types;

let Spicelevel = new keystone.List('Spicelevel');

Spicelevel.add({
    name: { type: String }
});

Spicelevel.register();