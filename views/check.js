
var a = [{name:'king', work:'king'}, {name:'tom', work:'sleep'}];
console.log(a);
b = [{name:'ayyappa', work:'study'}];
console.log(a.concat(b));


/*
 * 

var MongoClient = require('mongodb').MongoClient
  , format = require('util').format;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
if(err) throw err;

db.collection('test').findAndModify(
  {hello: 'world'}, // query
  [['_id','asc']],  // sort order
  {$set: {hi: 'there'}}, // replacement, replaces only the field "hi"
  {}, // options
  function(err, object) {
      if (err){
          console.warn(err.message);  // returns error if no matching object found
      }else{
          console.dir(object);
      }
  });
});
* 
*/
