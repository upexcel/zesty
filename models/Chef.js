let keystone = require('keystone');
let Types = keystone.Field.Types;

let Chef = new keystone.List(('Chef'), {
    hidden: true
});

Chef.add({
name: { type: String }
});

Chef.register();