var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	image: { type: Types.CloudinaryImage },
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, unique: true, index: true},
	emailVerified: {type: Boolean, index: true},
	type: {type: String},
	userId: { type: String},
	mobile: { type: String},
	facebookId: { type: String},
	password: { type: Types.Password, initial: true, required: true },
	workprofile: {type: String},
	orderForThisWeek: { type: Types.Relationship, ref: 'Foodplan', index:true},
	pauseSubscription: { type: Boolean, index: true, default: false},
	membership: {type : String, default: 'weekly'},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Relationships
 */
// User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
User.defaultColumns = 'name, email, mobile, orderForThisWeek, isAdmin';
User.register();
