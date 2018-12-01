// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function(err, client){
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // //deleteMany
  // db.collection('Todos').deleteMany({text:'Eat lunch'}).then(function(result){
  //   console.log(result);
  // });


  // //deleteOne
  // db.collection('Todos').deleteOne({text:'Eat lunch'}).then(function(result){
  //   console.log(result);
  // });


  // //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then(function(result){
  //   console.log(result);
  // });

  db.collection('Users').deleteMany({name:'Toshi'}).then(function(result){
    console.log(result);
  });

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5c028b733f3b9bf0f7b546e9')}).then(function(result){
    console.log(result);
  })



  // client.close();
});
