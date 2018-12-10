const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', function() {
	it('should create a new todo', function(done) {
		var text = 'test todo text'
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({text: text})
			.expect(200)
			.expect(function(res) {
				expect(res.body.text).toBe(text);
			})
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				Todo.find({text}).then(function(todos) {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch(function(e) {
					done(e);
				});
			});
	});

	it('should not create todo with invalid body data', function(done) {
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({
				text: ''
			})
			.expect(400)
			.end(function(err, res) {
				if (err) {
					return done(e);
				}
				Todo.find().then(function(todos) {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});

	});
});

describe('GET /todos', function() {
	it('should get all todos', function(done) {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(function(res) {
				expect(res.body.todos.length).toBe(1);
			})
			.end(done);
	});
});

describe('GET /todos/:id', function() {

	it('should return a todo doc', function(done){
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(function(res){
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should not return todo doc created by another user', function(done) {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});	

	it('should return 404 if todo not found', function(done) {
		// make sure you get a 404 back
		var hexId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', function(done) {
		// /todos/123
		request(app)
			.get('/todos/123')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done)
	});
});

describe('DELETE /todos/:id', function() {
	it('should remove a todo', function(done) {
		var hexId = todos[1]._id;
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect(function(res) {
				expect(res.body.todo.text).toBe(todos[1].text);
			})
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				Todo.findById(hexId).then(function(todo) {
					expect(todo).toBe(null);
					// expect(todo).toNotExist();
					done();
				}).catch(function(e) {
					done(e)
				});

			});

	});

	it('should not remove a todo created by another user', function(done) {
		var hexId = todos[0]._id;
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				Todo.findById(hexId).then(function(todo) {
					expect(todo).toBeDefined();
					// expect(todo).toNotExist();
					done();
				}).catch(function(e) {
					done(e)
				});
			});
	});


	it('should return a 404 if todo not found', function(done) {

		// make sure you get a 404 back
		var hexId = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);

	});

	it('should return a 404 if object id is invalid', function(done) {
		// /todos/123
		request(app)
			.delete('/todos/123')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done)
	})
});

describe('PATCH /todos/:id', function() {
	it('should update the todo', function(done) {
		// grab id of first item
		var hexId = todos[0]._id.toHexString();
		var sampleText = 'aaabbbccc';

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				text: sampleText,
				completed: true
			})
			.expect(200)
			.expect(function(res) {
				expect(res.body.todo.text).toBe(sampleText);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof(res.body.todo.completedAt)).toBe('number');
			})
			.end(done);
	});

	it('should not update the todo owned by other user', function(done) {
		// grab id of first item
		var hexId = todos[0]._id.toHexString();
		var sampleText = 'aaabbbccc';

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({
				text: sampleText,
				completed: true
			})
			.expect(404)
			.end(done);
	});


	it('should clear completed at when todo is not completed', function(done) {
		// grab id of second todo item
		var hexId = todos[1]._id.toHexString();
		var sampleText = 'aaabbbccc';

		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.send({
				text: sampleText,
				completed: false
			})
			.expect(200)
			.expect(function(res) {
				expect(res.body.todo.text).toBe(sampleText);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toBe(null);
			})
			.end(done);
	});
});

describe('GET /users/me', function(){
	it('should return a user if authenticated', function(done){
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(function(res){
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return a 401 if not authenticated', function(done){
		request(app)
			.get('/users/me')
			.expect(401)
			.expect(function(res){
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', function(){
	it('should create a user', function(done){
		var email = 'example@example.com';
		var password = '123mnb!';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect(function(res){
				expect(res.headers['x-auth']).toBeDefined();
				expect(res.body._id).toBeDefined();
				expect(res.body.email).toBeDefined();
			})
			.end(function(err){
				if(err){
					return done(err);
				}
				User.findOne({email}).then(function(user){
					expect(user).toBeDefined();
					expect(user.password).not.toBe(password);
					done();
				}).catch(function(e){
					done(e);
				});
			});
	});

	it('should return a validatio errors if request invalid', function(done){
		var email = 'asdf';
		var password = '12';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', function(done){
		var email = users[0].email;
		var password = '1231233';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});
});

describe('POST /users/login', function(){
	it('should login user and return auth token', function(done){
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password : users[1].password
			})
			.expect(200)
			.expect(function(res){
				expect(res.headers['x-auth']).toBeDefined();
			})
			.end(function(err, res){
				if(err){
					return done(err);
				}
				User.findById(users[1]._id).then(function(user){
					expect(user.tokens[1].access).toBe('auth');
					expect(user.tokens[1].token).toBe(res.header['x-auth']);
					done();
				}).catch(function(e){
					done(e);
				});
			});
				
	});

	it('should reject invalid login', function(done){
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password : 'somepass'
			})
			.expect(400)
			.expect(function(res){
				expect(res.headers['x-auth']).not.toBeDefined();
			})
			.end(function(err, res){
				if(err){
					return done(err);
				}
				User.findById(users[1]._id).then(function(user){
					expect(user.tokens.length).toBe(1);
					done();
				}).catch(function(e){
					done(e)
				});

			});
	});
});

describe('DELETE /users/me/token', function(){
	it('should remove auth token on logout', function(done){
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.send()
			.expect(200)
			.end(function(err, res){
				if(err){
					return done(err);
				}
				User.findById(users[0]._id).then(function(user){
					expect(user.tokens.length).toBe(0);
					done();
				}).catch(function(e){
					done(e);
				});
			});
	});
});