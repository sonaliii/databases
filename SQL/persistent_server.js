var mysql = require('mysql');
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

var createUser = function(username, password, settingId){
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
  var queryValues = [name];
  var query = 'INSERT INTO rooms (name, createdAt, updatedAt) VALUES (?, Now(), Now());';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var createMessage = function(message, author, recipient, room) {
  var authorId = getUserIdByName(author);
  var recipientId = 'NULL';
  if(recipient) {
    recipientId = getUserIdByName(recipient);
  }
  var roomId = getRoomIdByName(room);
  var queryValues = [message, authorId, recipientId, roomId];
  var query = 'INSERT INTO messages (message, authorId, recipientId, roomId, createdAt, updatedAt) VALUES (?, ?, ?, ?, Now(), Now());';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var getUserIdByName = function(name) {
  var queryValues = [name];
  var query = 'SELECT userId FROM users WHERE username = ?;';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var getRoomIdByName = function(room) {
  var queryValues = [name];
  var query = 'SELECT roomId FROM rooms WHERE name = ?;';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var getRooms = function() {
  var query = 'SELECT * FROM rooms;';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var getMessagesByRoom = function(room) {
  var roomId = getRoomIdByName(room);
  var queryValues = [roomId];
  var query = 'SELECT * FROM messages WHERE roomId = ?;';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var showMessagesByAuthor = function(author) {
  var authorId = getUserIdByName(author);
  var queryValues = [authorId];
  var query = 'SELECT * FROM messages WHERE authorId = ?;';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

var searchMessages = function(pattern) {
  var queryValues = [pattern];
  var query = 'SELECT * FROM messages WHERE message LIKE "%?%";';
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
  var userId = getUserIdByName(user);
  var byUserId = getUserIdByName(byUser);
  relationship = relationship || 'Likes';
  var queryValues = [userId, byUser, relationship];
  var query = 'INSERT INTO relationships (user, userBy, relationship, createdAt, updatedAt) VALUES (?, ?, ?, Now(), Now());';
  dbConnection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      console.log(fields);
    }
  });
};

dbConnection.end();