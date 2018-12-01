// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function(err, client){
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text : 'Something to do',
  //   completed : false
  // }, function(err, result){
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // Insert new doc into Users(name,age, location)
  // db.collection('Users').insertOne({
  //   name: 'Toshi',
  //   age: 39,
  //   location: 'Seoul'
  // },function(err, result){
  //   if(err){
  //     return console.log('error inserting into Users',err);
  //   }
  //   // console.log(JSON.stringify(result.ops, undefined,2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });


  client.close();
});
