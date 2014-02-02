var mysql = require('mysql');
var http = require('http');
var path = require('path');
var helpers = require('./http-helpers');
var url = require('url');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chatterBox"
});

dbConnection.connect();
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

var corsOptions = function(request, response) {
  helpers.sendResponse(response, null);
};

var getHandler = function(request, response) {
  var urlPath = url.parse(request.url).pathname;
  console.log(url.parse(request.url));
  if( urlPath === '/' ){
    urlPath = '/index.html';
  }
  if( urlPath === '/1/classes/chatterbox') {
    getAllMessages(function(messages){
      sendResponse(response, JSON.stringify(messages));
    });
  } else if ( urlPath === '/1/classes/chatterbox/rooms/all') {
    getRooms(function(rooms){
      console.log(rooms);
      sendResponse(response, JSON.stringify(rooms));
    });
  } else {
    helpers.serveAssets(response, urlPath);
  }
};

var postHandler = function(request, response) {
  helpers.collectData(request, function(data) {
    data = JSON.parse(data);
    createMessage(data.message, data.author, data.roomname, data.recipient, function(result){
      sendResponse(response, result);
    });
  });
};

var methods = {
  'OPTIONS': corsOptions,
  'GET': getHandler,
  'POST': postHandler
};

var handleRequest = function (request, response) {
  var method = methods[request.method];
  console.log('Processing ' + request.method + ' request for ' + request.url);
  if(method) {
    method(request, response);
  } else {
    helpers.sendResponse(response, null, 404);
  }
};

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

// DB Stuff

var createUser = function(username, password, settingId){
  // '/1/classes/chatterbox/users/new'
  settingId = settingId || 1;
  var queryValues = [username, password, settingId, 'Now()', 'Now()'];
  var query = 'INSERT INTO users (username, password, settingId, createdAt, updatedAt) VALUES (?, ?, ?, Now(), Now());';
  query = mysql.format(query, queryValues);
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var createSetting = function(signOffMessage, fontColor, fontStyle) {
  // '/1/classes/chatterbox/settings/new'
  signOffMessage = signOffMessage || "Goodbye!";
  fontColor = fontColor || "#000000";
  fontStyle = fontStyle || "Verdana";
  var queryValues = [signOffMessage, fontColor, fontStyle, 'Now()', 'Now()'];
  var query = 'INSERT INTO settings (signOffMessage, fontColor, fontStyle, createdAt, updatedAt) VALUES (?, ?, ?, Now(), Now());';
  query = mysql.format(query, queryValues);
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var createRoom = function(name) {
  // '/1/classes/chatterbox/rooms/new'
  var queryValues = [name];
  var query = 'INSERT INTO rooms (name, createdAt, updatedAt) VALUES (?, Now(), Now());';
  query = mysql.format(query, queryValues);
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var createMessage = function(message, author, room, recipient, callback) {
  // '/1/classes/chatterbox/messages/new'
  var recipientId = null;
  var query = 'INSERT INTO messages (message, authorId, recipientId, roomId, createdAt, updatedAt) VALUES (?, ?, ?, ?, Now(), Now());';
  getUserIdByName(author, function(authorId){
    if(recipient) {
      getUserIdByName(recipient, function(recipientId){
        getRoomIdByName(room, function(roomId){
          var queryValues = [message, authorId, recipientId, roomId];
          query = mysql.format(query, queryValues);
          callback(query);
          dbConnection.query(query, function(err, rows, fields) {
            if (err) {
              console.log(err);
            } else {
              callback(rows);
            }
          });
        });
      });
    } else {
      getRoomIdByName(room, function(roomId){
        var queryValues = [message, authorId, recipientId, roomId];
        query = mysql.format(query, queryValues);
        dbConnection.query(query, function(err, rows, fields) {
          if (err) {
            console.log(err);
          } else {
            callback(rows);
          }
        });
      });
    }
  });
};

var getUserIdByName = function(name, callback) {
  // '/1/classes/chatterbox/users/new' ???
  var queryValues = [name];
  var query = 'SELECT userId FROM users WHERE username = ?;';
  query = mysql.format(query, queryValues);
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      callback(rows[0]['userId']);
    }
  });
};

var getRoomIdByName = function(room, callback) {
  // '/1/classes/chatterbox/users/new' ???
  var queryValues = [room];
  var query = 'SELECT roomId FROM rooms WHERE name = ?;';
  query = mysql.format(query, queryValues);
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      callback(rows[0]['roomId']);
    }
  });
};

var getRooms = function(callback) {
  // '/1/classes/chatterbox/rooms/all'
  var query = 'SELECT * FROM rooms;';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      callback(rows);
    }
  });
};

var getAllMessages = function(callback) {
  // '/1/classes/chatterbox/messages/all'
  var query = 'SELECT * FROM messages;';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      callback(rows);
    }
  });
};

var getMessagesByRoom = function(room) {
  // '/1/classes/chatterbox/room/1/messages/all'
  room = room || 'Global';
  getRoomIdByName(room, function(roomId){
    var queryValues = [roomId];
    var query = 'SELECT * FROM messages WHERE roomId = ?;';
    query = mysql.format(query, queryValues);
    dbConnection.query(query, function(err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(fields);
      }
    });
  });
};

var getMessagesByAuthor = function(author) {
  // '/1/classes/chatterbox/users/1/messages/all'
  getUserIdByName(author, function(authorId){
    var queryValues = [authorId];
    var query = 'SELECT * FROM messages WHERE authorId = ?;';
    query = mysql.format(query, queryValues);
    dbConnection.query(query, function(err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(rows);
        console.log(fields);
      }
    });
  });
};

var searchMessages = function(pattern) {
  // '/1/classes/chatterbox/messages?pattern=pattern'
  var queryValues = ['%' + pattern + '%'];
  var query = 'SELECT * FROM messages WHERE message LIKE ?;';
  query = mysql.format(query, queryValues);
  console.log(query);
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var createRelationship = function(user, byUser, relationship) {
  // '/1/classes/chatterbox/users/1?relationship={user:1, verb:'Like'}'
  relationship = relationship || 'Likes';
  getUserIdByName(user, function(userId){
    getUserIdByName(byUser, function(byUserId){
      var queryValues = [userId, byUserId, relationship];
      var query = 'INSERT INTO relationships (userId, userById, relationship, createdAt, updatedAt) VALUES (?, ?, ?, Now(), Now());';
      query = mysql.format(query, queryValues);
      dbConnection.query(query, function(err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log(rows);
          console.log(fields);
        }
      });
    });
  });
};

// createSetting('So Long, and Thanks for all the Fish!', '#0000FF');
// createUser('Sonali', 'Snow');
// createRoom('Global');
// createMessage('Winter is coming!', 'Jon', 'Winterfell');
// getUserIdByName('Jon');
// getRoomIdByName('Winterfell');
// getRooms();
// getMessagesByRoom('Winterfell');
// getMessagesByAuthor('Jon');
// searchMessages('is');
// createRelationship('Sonali', 'Jon');


// dbConnection.end();