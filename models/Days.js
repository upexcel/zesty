let keystone = require('keystone');
let Types = keystone.Field.Types;

var Days = new keystone.List(('Days'), {
    hidden:true
});

Days.add({
    name: { type: String }
});

Days.register();