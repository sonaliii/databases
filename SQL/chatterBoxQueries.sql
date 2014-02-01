-- Create User
INSERT INTO users (username, password, settingId, createdAt, updatedAt)
VALUES (username, password, settingId, createdAt, updatedAt);
-- Create Settings
INSERT INTO settings (signOffMessage, fontColor, fontStyle, createdAt, updatedAt)
VALUES (signOffMessage, fontColor, fontStyle, createdAt, updatedAt);
-- Create a Room
INSERT INTO rooms (name, createdAt, updatedAt)
VALUES (name, createdAt, updatedAt);
-- Post a Message
INSERT INTO messages (message, authorId, recipientId, roomId, createdAt, updatedAt)
VALUES (message, authorId, recipientId, roomId, createdAt, updatedAt);
-- Show Rooms
SELECT * FROM rooms;
-- Show RoomId
SELECT roomId FROM rooms WHERE name = roomname;
-- Show Messages by RoomId
SELECT * FROM messages WHERE roomId = roomId;
-- Show UserId
SELECT userId FROM users WHERE username = username;
-- Show Messages by User
SELECT * FROM messages WHERE authorId = userId;
-- Show Messages by Text
SELECT * FROM messages WHERE message LIKE '%message%';
-- Create relationship between users
INSERT INTO relationships (verb, verbBy, relationship, createdAt, updatedAt)
VALUES (userId, userId, relationship, createdAt, updatedAt);