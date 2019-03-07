//set up
let express = require('express');
let app = express();

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log("Hi! I am listening at http://localhost:3000");
