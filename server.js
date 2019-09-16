// server.js
// where your node app starts

// init project

const express = require('express');
const Sequelize = require('sequelize');
const session = require('express-session');
const passport = require('passport');
const Local = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const path  = require('path');


const app = express();

app.use(bodyParser.json());


// default user list
let users = [
      ["Employee","Employee"]
    ];
let initItems = [
    ["Employee", "Board", 5, "a1s2d3f4", "wooden planks"],
    ["Employee", "Sticks", 10, "as1d3432", "wooden sticks"]
    ];
let User;
let Inventory;
let curUsername = "";
let curID = -1;

// setup a new database
// using database credentials set in .env
let sequelize = new Sequelize('database', process.env.DB_USER, process.env.DB_PASS, {
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
  storage: 'resources/database.sqlite'
});

// authenticate with the database
sequelize.authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
    // define a new table 'users'
    User = sequelize.define('users', {
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    });

    Inventory = sequelize.define('items', {
        username: {
            type: Sequelize.STRING
        },
        itemName: {
            type: Sequelize.STRING
        },
        itemQuantity: {
            type: Sequelize.INTEGER
        },
        itemID: {
            type: Sequelize.STRING
        },
        itemDescription: {
            type: Sequelize.STRING
        }
    });
    
    setup();
  })
  .catch(function (err) {
    console.log('Unable to connect to the database: ', err);
  });

// populate table with default users
function setup(){
  User.sync({force: true}) // We use 'force: true' in this example to drop the table users if it already exists, and create a new one. You'll most likely want to remove this setting in your own apps
    .then(function(){
      // Add the default users to the database
      for(let i=0; i<users.length; i++){ // loop through all users
        User.create({ username: users[i][0], password: users[i][1]}); // create a new entry in the users table
      }
    });
  Inventory.sync({force: true})
      .then(function(){
          for(let i=0; i<initItems.length; i++) {
              Inventory.create({
                  username: initItems[i][0],
                  itemName: initItems[i][1],
                  itemQuantity: initItems[i][2],
                  itemID: initItems[i][3],
                  itemDescription: initItems[i][4]
              })
          }
      });
};

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = async function( username, password, done ) {
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  let pass = "";
   const user = User.findOne({
    where: {
      username: username
    }
  }).then(user => {
      console.log(user.get('password'));
      pass = user.get('password')
    });
   await user;
    console.log(pass);
  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    console.log("1");
    return done( null, false, { message:'user not found' })
  }else if( pass === password ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
      console.log("2");
      curUsername = username;
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
      console.log("3");
    return done( null, false, { message: 'incorrect password' })
  }
};

passport.use( new Local( myLocalStrategy ) );
app.use(passport.initialize());

passport.serializeUser( ( user, done ) => done( null, user.username ) );

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
    const user = users.find( u => u.username === username );
    console.log( 'deserializing:', name )

    if( user !== undefined ) {
        done( null, user )
    }else{
        done( null, false, { message:'user not found; session not restored' })
    }
});

app.post( 
  '/login',
  passport.authenticate( 'local', { successRedirect: '/main',
                                                    failureRedirect: '/',
                                                    failureFlash: true } ),
  /*function( req, res ) {
    //console.log( 'user:', req.user );
    //res.json({ status:true };
    res.redirect('/main');
  }*/
);

app.get("/main", function (request, response){
    //console.log(__dirname + '/views/main.html');
    //response.render(__dirname + '/views/main.html');
    response.sendFile(path.join(__dirname+'/views/main.html/'));

});

app.post("/createItem", function(request, response){
    //console.log(request.body.itemName);

    Inventory.create({  username: curUsername,
                        itemName: request.body.itemName,
                        itemQuantity: request.body.itemQuantity,
                        itemID: request.body.itemID,
                        itemDescription: request.body.itemDescription});
    response.sendStatus(200);
});

app.get("/getTable", function(request, response){
   let invItems = [];
   Inventory.findAll({
       where: {
           username: curUsername
       }
   }).then(function(items){
       items.forEach(function(item) {
           invItems.push([item.itemName, item.itemQuantity, item.itemID, item.itemDescription, item.id]);
       });
       response.json(invItems);
       //response.send(["why", "you", "do", "dis"]);
   })
});

app.post('/editSwitch', function(request, response){
    curID = request.body.id;
    response.sendFile(path.join(__dirname+'/views/editItem.html/'));
});

app.post('/updateItem', function(request, response){
   Inventory.findOne({
       where: {
           id: curID
       }
   }).then(function(item){
       item.update({
           itemName: request.body.itemName,
           itemQuantity: request.body.itemQuantity,
           itemID: request.body.itemID,
           itemDescription: request.body.itemDescription
       });
       curID = -1;
       response.send({});
   })
});

app.post('/deleteItem', function(request, response){
    Inventory.destroy({
        where: {
            id: request.body.id
        }
    }).then(response.send({}));
});


app.get("/users", function (request, response) {
  let dbUsers=[];
  User.findAll().then(function(users) { // find all entries in the users tables
    users.forEach(function(user) {
      dbUsers.push([user.firstName,user.lastName]); // adds their info to the dbUsers value
    });
    response.send(dbUsers); // sends dbUsers back to the page
  });
});

// creates a new entry in the users table with the submitted values
app.post("/users", function (request, response) {
  User.create({ firstName: request.query.fName, lastName: request.query.lName});
  response.sendStatus(200);
});

// drops the table users if it already exists, populates new users table it with just the default users.
app.get("/reset", function (request, response) {
  setup();
  response.redirect("/");
});

// removes all entries from the users table
app.get("/clear", function (request, response) {
  User.destroy({where: {}});
  response.redirect("/");
});

// listen for requests :)
let listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});