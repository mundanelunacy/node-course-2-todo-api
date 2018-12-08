var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
var {mongoose} = require ('./db/mongoose');
var {Todo} = require ('./models/todo');
var {User} = require ('./models/user');
const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', function(req,res){
  var todo = new Todo({
    text:req.body.text
  });
  todo.save().then(function(doc){
    res.send(doc);
  },function(e){
    res.status(400).send(e);
  });
});


app.get('/todos', function(req, res){
  Todo.find().then(function(todos){
    res.send({todos});
  }, function(e){
    res.status(400).send(e);
  });
});

// GET /todos/123423

app.get('/todos/:id', function(req, res){
  var id = req.params.id;

  // validate id is isValid
  if(ObjectID.isValid(id)){
    // findById
    Todo.findById(id).then(function(todo){
      if(todo){
        res.send({todo}); 
      }else{
        res.status(404).send();
      }
    }).catch(function(e){
      // error
      res.status(400).send();
    });    
  }  
  else{
    res.status(404).send();
  }
});


app.listen(port, function(){
  console.log(`Started on port ${port}`);
});


module.exports = {app};
