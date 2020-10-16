let keystone = require('keystone');
let Types = keystone.Field.Types;

let Cart = new keystone.List(('Cart'), {
    hidden:true
});

Cart.add({
    userId: {type: Types.Relationship, ref: 'User'},
    foodId: {type: Types.Relationship, ref: 'Dishes'},
    quantity: {type: Number}
            
    }
);
Cart.register();