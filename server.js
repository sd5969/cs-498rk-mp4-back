// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var Task = require('./models/task');
var bodyParser = require('body-parser');
var router = express.Router();

mongoose.connect('mongodb://insecureUserName:unsecuredPassword@ds017070.mlab.com:17070/cs-498rk-mp4-back');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

/*

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	next();
};
app.use(allowCrossDomain);

*/

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
	extended: true
}));

// this does something?
app.use(bodyParser.json());

// preflight stuffs from https://gist.github.com/cuppster/2344435
// app.use(express.methodOverride());

// ## CORS middleware
// 
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

// intercept OPTIONS method
if ('OPTIONS' == req.method) {
	res.sendStatus(200);
}
else {
	next();
}
};
app.use(allowCrossDomain);

// All our routes will start with /api
app.use('/api', router);

var homeRoute = router.route('/');
var usersRoute = router.route('/users');
var userRoute = router.route('/users/:id');
var tasksRoute = router.route('/tasks');
var taskRoute = router.route('/tasks/:id');




homeRoute.get(function(req, res) {
	res.status(404).json({
		message : 'Nothing here. Go to ./users or ./tasks to play with the API.',
		data : []
	});
});




usersRoute.get(function(req, res) {

	var query = User.find({});

	var where = "";
	if(req.query.where) {
		try {
			where = eval("("+ req.query.where + ")");
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var sort = "";
	if(req.query.sort) {
		try {
			sort = eval("("+ req.query.sort + ")");
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var select = "";
	if(req.query.select) {
		try {
			select = eval("("+ req.query.select + ")");
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var skip = "";
	if(req.query.skip) {
		try {
			skip = parseInt(req.query.skip);
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
		if(skip < 0) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var limit = "";
	if(req.query.limit) {
		try {
			limit = parseInt(req.query.limit);
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
		if(limit <= 0) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var count = "";
	if(req.query.count) {
		count = req.query.count; // this is a string
	}

	if(where) query.where(where);
	if(sort) query.sort(sort);
	if(select) query.select(select);
	if(skip) query.skip(skip);
	if(limit) query.limit(limit);
	
	if(count === "true") query.count(function(err, count) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else {
			res.json({"message" : "OK", "data" : count});
			return;
		}
	});

	else query.exec(function(err, users) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else {
			res.json({"message" : "OK", "data" : users});
			return;
		}
	});
});




usersRoute.post(function(req, res) {

	var name = req.body.name ? req.body.name : "";
	var email = req.body.email ? req.body.email : "";
	var user = new User({
		name: name,
		email : email
	});
	user.save(function(err, user) {
		if(err && err.code == 11000){
			res.status(500).json({"message" : 'Error: That email is already in use.', "data" : []});
			return;
		}
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else {
			res.status(201).json({"message": "User created", "data" : user});
			return;
		}
	});

})




tasksRoute.get(function(req, res) {
	
	var query = Task.find({});

	var where = "";
	if(req.query.where) {
		try {
			where = eval("("+ req.query.where + ")");
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var sort = "";
	if(req.query.sort) {
		try {
			sort = eval("("+ req.query.sort + ")");
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var select = "";
	if(req.query.select) {
		try {
			select = eval("("+ req.query.select + ")");
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var skip = "";
	if(req.query.skip) {
		try {
			skip = parseInt(req.query.skip);
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
		if(skip < 0) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var limit = "";
	if(req.query.limit) {
		try {
			limit = parseInt(req.query.limit);
		} catch(e) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
		if(limit <= 0) {
			console.error("Can't parse parameter.");
			res.status(500).json({"message" : 'Error: Your query syntax is invalid.', "data" : []});
			return;
		}
	}

	var count = "";
	if(req.query.count) {
		count = req.query.count; // this is a string
	}

	if(where) query.where(where);
	if(sort) query.sort(sort);
	if(select) query.select(select);
	if(skip) query.skip(skip);
	if(limit) query.limit(limit);
	
	if(count === "true") query.count(function(err, count) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else {
			res.json({"message" : "OK", "data" : count});
			return;
		}
	});

	else query.exec(function(err, tasks) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else {
			res.json({"message" : "OK", "data" : tasks});
			return;
		}
	});

});




tasksRoute.post(function(req, res) {
	if(!req.body.name) {
		res.status(500).json({"message" : 'Error: A name is required.', "data" : []});
		return;
	}
	if(!req.body.deadline) {
		res.status(500).json({"message" : 'Error: A deadline is required.', "data" : []});
		return;
	}
	var name = req.body.name;
	var deadline = req.body.deadline;
	var description = req.body.description ? req.body.description : "";
	var completed = req.body.completed ? req.body.completed : "false";
	var assignedUser = req.body.assignedUser ? req.body.assignedUser : "";
	var assignedUserName = req.body.assignedUserName ? req.body.assignedUserName : "unassigned";

	var task = new Task({
		name: name,
		deadline: deadline,
		description: description,
		completed: completed,
		assignedUser: assignedUser,
		assignedUserName: assignedUserName
	});

	task.save(function(err, user) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else {
			res.status(201).json({"message": "Task created", "data" : task});
			return;
		}
	});
});




usersRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});




tasksRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});




userRoute.get(function(req, res) {
	var userID = req.params.id;
	if (!userID.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).json({"message" : "Error: User not found.", data : []});
		return;
	}

	User.findById(userID, function(err, user) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else if(user) {
			res.json({"message" : "OK", "data" : user});
			return;
		}
		else {
			res.status(404).json({"message" : "Error: User not found.", data : []});
			return;
		}
	});
});




userRoute.put(function(req, res) {
	var userID = req.params.id;
	if (!userID.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).json({"message" : "Error: User not found.", data : []});
		return;
	}

	User.findById(userID, function(err, user) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else if(user) {

			user.name = req.body.name ? req.body.name : '';
			user.email = req.body.email ? req.body.email : '';
			// user.pendingTasks = req.body.pendingTasks ? eval("(" + req.body.pendingTasks + ")") : [];
			user.pendingTasks = req.body.pendingTasks ? req.body.pendingTasks : [];
			
			user.save(function(err, user) {
				if(err && err.code == 11000){
					res.status(500).json({"message" : 'ValidationError: That email is already in use.', "data" : []});
					return;
				}
				if(err) {
					res.status(500).json({"message" : '' + err, "data" : []});
					return;
				}
				else {
					res.status(200).json({"message": "User updated", "data" : user});
					return;
				}
			});

		}
		else {
			res.status(404).json({"message" : "Error: User not found.", data : []});
			return;
		}
	});
});




userRoute.delete(function(req, res) {
	var userID = req.params.id;

	if (!userID.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).json({"message" : "Error: User not found.", data : []});
		return;
	}

	User.findByIdAndRemove(userID, function(err, user) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else if(user) {
			res.json({"message" : "User deleted.", "data" : []});
			return;
		}
		else {
			res.status(404).json({"message" : "Error: User not found.", data : []});
			return;
		}
	});
});




taskRoute.get(function(req, res) {
	var taskID = req.params.id;
	if (!taskID.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).json({"message" : "Error: Task not found.", data : []});
		return;
	}

	Task.findById(taskID, function(err, task) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else if(task) {
			res.json({"message" : "OK", "data" : task});
			return;
		}
		else {
			res.status(404).json({"message" : "Error: Task not found.", data : []});
			return;
		}
	});
});




taskRoute.put(function(req, res) {
	var taskID = req.params.id;
	if (!taskID.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).json({"message" : "Error: Task not found.", data : []});
		return;
	}

	Task.findById(taskID, function(err, task) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else if(task) {

			task.name = req.body.name ? req.body.name : '';
			task.deadline = req.body.deadline ? req.body.deadline : '';
			task.description = req.body.description ? req.body.description : '';
			task.completed = req.body.completed ? req.body.completed : '';
			task.assignedUser = req.body.assignedUser ? req.body.assignedUser : '';
			task.assignedUserName = req.body.assignedUserName ? req.body.assignedUserName : 'unassigned';
			
			task.save(function(err, task) {
				if(err) {
					res.status(500).json({"message" : '' + err, "data" : []});
					return;
				}
				else {
					res.status(200).json({"message": "Task updated", "data" : task});
					return;
				}
			});

		}
		else {
			res.status(404).json({"message" : "Error: Task not found.", data : []});
			return;
		}
	});
});




taskRoute.delete(function(req, res) {
	var taskID = req.params.id;

	if (!taskID.match(/^[0-9a-fA-F]{24}$/)) {
		res.status(404).json({"message" : "Error: Task not found.", data : []});
		return;
	}

	Task.findByIdAndRemove(taskID, function(err, task) {
		if(err) {
			res.status(500).json({"message" : '' + err, "data" : []});
			return;
		}
		else if(task) {
			res.json({"message" : "Task deleted.", "data" : []});
			return;
		}
		else {
			res.status(404).json({"message" : "Error: Task not found.", data : []});
			return;
		}
	});
});




app.listen(port);
console.log('Server running on port ' + port);
