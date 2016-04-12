var mongoose = require('mongoose');

var UserSchema   = new mongoose.Schema({
	name : 			{type: String, required: [true, 'You must enter a name']},
	email : 		{type: String, required: [true, 'You must enter an email'], unique: true},
	pendingTasks : 	{type: [String], default: []},
	dateCreated : 	{type: Date, default: Date.now}
});

module.exports = mongoose.model('User', UserSchema);