//set up
let express = require('express')
let app = express();
let bodyParser = require('body-parser')
let databasePosts = null;

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
let posts = [];

//let a client GET the list
function sendPostsList(request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);
app.get('/post', function (request, response) {
   let searchId = request.query.id;
   console.log("Searching for post " + searchId);
   let post = posts.find(x => x.id == searchId);
   response.send(post);
});

function deleteHandler(request, response) {
console.log("client wants to delete this post: " + request.body.postId );
if (request.body.password === "1234") {
  //things that happen if the password was correct
  let postIdNumber = parseInt(request.body.postId);
  posts = posts.filter(post => post.id != postIdNumber);
  databasePosts.deleteOne({ id : postIdNumber })
 } else {
   console.log("Wrong password");
 }
}
app.post('/delete', deleteHandler);

function saveNewPost(request, response) {
  let post= {};
  post.id = Math.round(Math.random() * 10000);
  post.message = request.body.message;
  post.url = request.body.url;
  post.author = request.body.author;
   if (post.author === "") {
    post.author = "New post, who Dis?"
  }

  post.flavour = request.body.flavour;
  post.time = new Date;
  
  console.log(post)
  posts.push(post);
  response.send("thanks for your message. Press back to add another");
  databasePosts.insert(post);
}
//let a client POST an image

app.post('/posts', saveNewPost);

//pick and return a random element from the given list
function pickRandomFrom(list) {
  return list[Math.floor(Math.random()*list.length)];
};

//give the client a random post
function getRandomPost(request, response) {
  let randomPost = pickRandomFrom(posts);
  response.send(randomPost);
};

app.get('/random', getRandomPost);

//pick and return a random element from the given list
function pickRandomFrom(list) {
  return list[Math.floor(Math.random()*list.length)];
};

//give the client a random post
function getRandomPost(request, response) {
  let randomPost = pickRandomFrom(posts);
  response.send(randomPost);
};

app.get('/random', getRandomPost);

//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");

let MongoClient = require('mongodb').MongoClient;
let databaseUrl = 'mongodb://girlcode:hats123@ds213896.mlab.com:13896/girlcode2019term1';
let databaseName = 'girlcode2019term1';


MongoClient.connect(databaseUrl, {useNewUrlParser: true}, function(err, client) {
  if (err) throw err;
  console.log("yay we connected to the database");
  let database = client.db(databaseName);
  databasePosts = database.collection('posts');
  databasePosts.find({}).toArray(function(err, results) {
    if (err) throw err;
    console.log("Found " + results.length + " results");
    posts = results



  });
});
