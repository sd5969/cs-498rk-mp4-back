var mongoose = require('mongoose');

var TaskSchema   = new mongoose.Schema({
	name : 				{type: String, required: [true, 'You must enter a name']},
	description : 		{type: String, default: ""},
	deadline : 			{type: Date, required: [true, 'You must enter a deadline']},
	completed : 		{type: Boolean, default: false},
	assignedUser : 		{type: String, default: ""},
	assignedUserName : 	{type: String, default: "unassigned"},
	dateCreated : 		{type: Date, default: Date.now}
});

module.exports = mongoose.model('Task', TaskSchema);