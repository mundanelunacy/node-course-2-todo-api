// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function(err, client){
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   _id:new ObjectID('5c0293b486c93b802ee9c9bd')
  // },{
  //   $set :{
  //     completed : true
  //   }
  // },{
  //   returnOriginal : false
  // }).then(function(result){
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id : new ObjectID('5c028aa3f2c100f0b1963c4c')
  },{
    $set : {
      name: 'Toshi'
    },
    $inc : {
      age : 1
    }
  },{
    returnOriginal : false
  }).then(function(result){
    console.log(result);
  });



  // client.close();
});
