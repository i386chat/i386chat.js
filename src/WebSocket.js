'use strict';
// Stuff for handling websocket.

var LocalUserData;

module.exports.init = function(socket, UserData) {
    // We're connecting to the socket, so we want to initialise all handlers here.
    return {
        // Do stuff here on client init.
        onConnect: function() {
            socket.emit('userData_init',{
                nickName: UserData.username,
                bio: UserData.bio
            })

            socket.on('userData_local', (data) => {
                // Got our local user data.
                LocalUserData = data;
                console.log(LocalUserData);
            })
        },
        getLocalUserData: function() {
            return LocalUserData;
        },
        // Send message to server.
        sendMessage: function(message) {
            socket.emit('chat_message', {
                userData: LocalUserData,
                content: message
            })
        }
    }
}