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
const favicon = require('serve-favicon');
const uncap = require('express-uncapitalize');
const slash   = require('express-slash');
const debug = require('express-debug');


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
  storage: '.data/database.sqlite'
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
  User.sync({force: false}) // We use 'force: true' in this example to drop the table users if it already exists, and create a new one. You'll most likely want to remove this setting in your own apps
    .then(function(){
      // Add the default users to the database
      for(let i=0; i<users.length; i++){ // loop through all users
        User.create({ username: users[i][0], password: users[i][1]}); // create a new entry in the users table
      }
    });
  Inventory.sync({force: false})
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
app.use(express.static(__dirname + '/'));



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
      if(user !== null) {
          pass = user.get('password');
      } else {
          pass = "";
    }
    });
   await user;
    
  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    
    return done( null, false, { message:'user not found' })
  }else if( pass === password ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
      
      curUsername = username;
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
      
    return done( null, false, { message: 'incorrect password' })
  }
};

passport.use( new Local( myLocalStrategy ) );
app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) );
app.use(passport.initialize());
app.use( passport.session() );




passport.serializeUser( ( user, done ) => done( null, user.username ) );

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
    const user = User.findOne({
    where: {
      username: username
    }
  })
    
    console.log( 'deserializing:', username );

    if( user !== undefined ) {
        curUsername = username;
        done( null, user );
    }else{
        done( null, false, { message:'user not found; session not restored' });
    }
});

//app.use(favicon("https://cdn.glitch.com/1b6ba422-b77a-48e2-96fe-a31537973221%2Ffavicon.ico?v=1568611668241"));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  if(request.user){
    response.sendFile(__dirname + '/views/main.html');
  }else{
    response.sendFile(__dirname + '/views/index.html');
  }
});


app.post( 
  '/login',
  passport.authenticate( 'local', { successRedirect: '/main',
                                                    failureRedirect: '/fail',
                                                    failureFlash: false} ),
  
);

app.get('/fail', function(request, response){
   
   response.redirect('/');
});

app.get("/main", function (request, response){
    
    response.sendFile(path.join(__dirname+'/views/main.html'));

});

app.post("/createItem", function(request, response){
    

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
       
   })
});

app.post('/editSwitch', function(request, response){
    curID = request.body.id;
    response.sendFile(path.join(__dirname+'/views/editItem.html'));
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
       response.send(path.join(__dirname+'/views/main.html'));
   })
});

app.post('/deleteItem', function(request, response){
    Inventory.destroy({
        where: {
            id: request.body.id
        }
    }).then(response.send({}));
});

app.post('/createAct', function(request, response) {
    User.create({  username: request.body.username,
        password: request.body.password
    });
    response.sendStatus(200);
});


app.use(uncap);
app.use(slash);
app.use(debug);

// listen for requests :)
let listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
