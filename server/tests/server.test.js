const expect = require ('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach(function(done){
  Todo.remove({}).then(function(){
    done();
  });
});

describe('POST /todos', function(){
  it('should create a new todo', function(done){
    var text='test todo text'
    request(app)
      .post('/todos')
      .send({
        text : text
      })
      .expect(200)
      .expect(function(res){
        expect(res.body.text).toBe(text);
      })
      .end(function(err, res){
        if(err){
          return done(err);
        }
        Todo.find().then(function(todos){
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(function(e){
          done(e);
        });
      });
  });

  it('should not create todo with invalid body data', function(done){
    request(app)
      .post('/todos')
      .send({text:''})
      .expect(400)
      .end(function(err,res){
        if(err){
          return done(e);
        }
        Todo.find().then(function(todos){
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });

  });
})
