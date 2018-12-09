require('../server/config/config');
const _ = require('lodash');

const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = "5c04b75531b5e832233d02ed11";
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }
//
// Todo.find({_id: id}).then(function(todos){
//   console.log('Todos', todos);
// });
//
// Todo.findOne({_id: id}).then(function(todo){
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then(function(todo){
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('TodoBy Id', todo);
// }).catch((e) => console.log(e));


// User.findById
// user not found
// print user to screen
// handle errors


// var userId = '5c0369509a749cffdb4786fe';
// if(!ObjectID.isValid(userId)){
//   console.log('ID is not valid');
// }else{
//   User.findById(userId).then(function(user){
//     if(user){
//       console.log(user);
//     }else {
//       console.log('unable to find user');
//     }

//   }, function(e){
//     console.log(e);
//   }).catch((e) => console.log(e));
// }

var req = {
  body : {
    email: 'kawase@jhu.edu',
    password : 'aaabbbccc',
    tokens : [{
      access : 'user',
      token : 'adsfasdadsf'
    }]
  }
};

var body = _.pick(req.body, ['email', 'password', 'tokens']);

console.log(body);


var user = new User(body);

user.save().then(function(doc){
  console.log(doc);
}, function(e){
  console.log(e.message);
});






