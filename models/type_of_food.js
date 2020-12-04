let keystone = require('keystone');
let Types = keystone.Field.Types;

let type_of_food = new keystone.List('type_of_food');

type_of_food.add({
    name: { type: String }
});

type_of_food.register();