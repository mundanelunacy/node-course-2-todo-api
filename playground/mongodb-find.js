// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function(err, client){
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // //.find() returns pointer only
  // db.collection('Todos').find({
  //   _id:new ObjectID('5c028d9e86c93b802ee9c780')
  // }).toArray().then(function(docs){
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, function(err){
  //   console.log('Unable to fetch todos', err)
  // });

  //.find() returns pointer only
  // db.collection('Todos').find().count().then(function(count){
  //   console.log(`Todos count: ${count}`);
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, function(err){
  //   console.log('Unable to fetch todos', err)
  // });

  db.collection('Users').find({name:'Toshi'}).toArray().then(function(docs){
    console.log('Toshi users');
    console.log(JSON.stringify(docs, undefined,2));
  }, function(err){
    console.log('Unable to fetch users');
  });




  // client.close();
});
