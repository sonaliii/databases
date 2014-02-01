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

var createUser = 'INSERT INTO users (username, password, settingId, createdAt, updatedAt) VALUES (?, ?, ?, Now(), Now());';
var createSetting = 'INSERT INTO settings (signOffMessage, fontColor, fontStyle, createdAt, updatedAt) VALUES (?, ?, ?, Now(), Now());';
var createRoom = 'INSERT INTO rooms (name, createdAt, updatedAt) VALUES (?, Now(), Now());';
var createMessage = 'INSERT INTO messages (message, authorId, recipientId, roomId, createdAt, updatedAt) VALUES (?, ?, ?, ?, Now(), Now());';
var getRooms = 'SELECT * FROM rooms;';
var getRoomId = 'SELECT roomId FROM rooms WHERE name = ?;';
var getMessagesByRoomId = 'SELECT * FROM messages WHERE roomId = ?;';
var getUserIdByName = 'SELECT userId FROM users WHERE username = ?;';
var showMessagesByUser = 'SELECT * FROM messages WHERE authorId = ?;';
var searchMessages = 'SELECT * FROM messages WHERE message LIKE "%?%";';
var createRelationship = 'INSERT INTO relationships (verb, verbBy, relationship, createdAt, updatedAt) VALUES (?, ?, ?, Now(), Now());';

var user = ['Jon', 'Snow', 1, 'Now()', 'Now()'];

var query = mysql.format(createUser, user);

console.log(query);

dbConnection.query(query, function(err, rows, fields) {
  if (err) throw err;

  console.log(rows);
  console.log(fields);
});

dbConnection.end();