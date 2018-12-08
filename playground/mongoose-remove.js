const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then(function(result){
//   console.log(result);
// });

Todo.findOneAndRemove({_id : '5c0bba82f887b766e2d4fc14'}).then(function(todo){
  console.log(todo);
});

Todo.findByIdAndRemove('5c0bba82f887b766e2d4fc14').then(function(todo){
  console.log(todo);
});