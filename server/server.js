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


app.delete('/todos/:id', authenticate, async function(req, res) {

	try{
		var id = req.params.id;
		if (!ObjectID.isValid(id)) {
			return res.status(404).send();
		}
		const todo = await Todo.findOneAndRemove({
			_id : id,
			_creator : req.user._id
		}); 
	
		if(!todo){
			throw new Error(404);			
		}

		res.send({todo});
	
	}catch(e){
		if(e.message === '404'){
			res.status(404).send();
		}else{
			res.status(400).send();
		}
		
	}
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
app.post('/users', async function(req, res) {

	try{
		var body = _.pick(req.body, ['email', 'password']);
		var user = new User(body);
		await user.save();
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	}catch(e){
		res.status(400).send(e);
	}

});

app.get('/users/me', authenticate, function(req, res) {

	res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', async function(req, res){

	try{
		const body = _.pick(req.body, ['email', 'password']);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	
	}catch(e){
		res.status(400).send();
	}

});

app.delete('/users/me/token', authenticate, async function(req, res){

	try{
		await req.user.removeToken(req.token);
		res.status(200).send(200).send();
	}catch(e){
		res.status(400).send();
	}
	


});

app.listen(port, function() {

	console.log(`Started on port ${port}`);
});

module.exports = {
	app
};