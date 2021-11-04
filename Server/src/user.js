const connectedUsers = [];

// joins the user to the specific chatroom
function addUser(id, username, room) {
  const user = { id, username, room };

  connectedUsers.push(user);
  console.log(connectedUsers);
  return user;
}

// Gets a particular user id to return the current user
function getCurrentUser(id) {
  return connectedUsers.find((user) => user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function userDisconnect(id) {
  const index = connectedUsers.findIndex((user) => user.id === id);

  if (index !== -1) {
    return connectedUsers.splice(index, 1)[0];
  }
}

module.exports = {
   addUser, 
   getCurrentUser,
   userDisconnect
};