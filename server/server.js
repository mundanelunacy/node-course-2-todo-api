require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require ('./middleware/authenticate');

const port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, function(req, res) {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	todo.save().then(function(doc) {
		res.send(doc);
	}, function(e) {
		res.status(400).send(e);
	});
});


app.get('/todos', authenticate, function(req, res) {
	Todo.find({_creator : req.user._id}).then(function(todos) {
		res.send({todos});
	}, function(e) {
		res.status(400).send(e);
	});
});

// GET /todos/123423

app.get('/todos/:id', authenticate, function(req, res) {
	var id = req.params.id;

	// validate id is isValid
	if (ObjectID.isValid(id)) {
		Todo.findOne({
			_id: id, 
			_creator: req.user._id
		}).then(function(todo) {
			if (todo) {
				res.send({todo});
			} else {
				res.status(404).send();
			}
		}).catch(function(e) {
			// error
			res.status(400).send();
		});
	} else {
		res.status(404).send();
	}
});


app.delete('/todos/:id', authenticate, function(req, res) {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	// Todo.findByIdAndDelete(id)
	Todo.findOneAndRemove({
		_id : id,
		_creator : req.user._id
	})
		.then(function(todo) {
			if (!todo) {
				return res.status(404).send();
			}
			res.send({todo});
		}).catch(function(e) {
			res.status(400).send();
		});
});

app.patch('/todos/:id', authenticate, function(req, res) {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	// Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(function(todo) {
	Todo.findOneAndUpdate({_id: id, _creator : req.user._id}, {$set: body}, {new: true}).then(function(todo) {
		if (!todo) {
			res.status(404).send();
		}

		res.send({todo});

	}).catch(function(e) {
		res.status(400).send();
	});
});

// POST /users
app.post('/users', function(req, res) {

	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(function() {
		return user.generateAuthToken();
	}).then(function(token) {
		res.header('x-auth', token).send(user);
	}).catch(function(e) {
		res.status(400).send(e);
	});
});

app.get('/users/me', authenticate, function(req, res) {
	res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', function(req, res){
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then(function(user){
		return user.generateAuthToken().then(function(token){
			res.header('x-auth', token).send(user);
		});
	}).catch(function(e){
		res.status(400).send();
	});
});

app.delete('/users/me/token', authenticate, function(req, res){
	req.user.removeToken(req.token).then(function(){
		res.status(200).send();
	}, function(){
		res.status(400).send();
	});
});

app.listen(port, function() {
	console.log(`Started on port ${port}`);
});

module.exports = {
	app
};