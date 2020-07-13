'use strict';

// Client stuff.

const EventEmitter = require('events');
const WebSocket = require('../WebSocket');

var GlobalSocket;
var GlobalUData;
var GlobalLocalUData;

//const eventEmitter = new Emitter();

const io = require('socket.io-client');

class Client extends EventEmitter {
    constructor (eventEmitter) {
        super();
        console.log(eventEmitter)
        this.eventEmitter = eventEmitter;
        //console.log(options)
        //this.emit('jobby')
    }

    async sendMessage(message, room) {
        GlobalSocket.emit('chat_message', {
            content: message,
            userData: GlobalLocalUData,
            room: room || GlobalLocalUData.room
        })
    }

    async changeRoom(room) {
        // Change room
        GlobalLocalUData = WebSocket.getLocalUserData();
        GlobalUData["room"].room = room
        GlobalLocalUData["room"].room = room

        socket.emit("userData_change", {
            type: "room",
            newRoom: room
        });
    }

    async login(UserData, eventEmitter) {
        return new Promise ( function ( resolve, reject ) {
            GlobalSocket = io.connect(UserData.serverIP, {
                reconnect: true
            });

            GlobalUData = UserData;

            var socket = GlobalSocket;
        
            // Initialise the libraries as if we're actually about to dive in.
            const WebSocket = require('../WebSocket').init(socket, UserData);
            socket.on('connect', function () {
                // Connected.
                console.log("[API] Connected.")
                WebSocket.onConnect(socket, UserData);
                eventEmitter.emit('ready')
                GlobalLocalUData = WebSocket.getLocalUserData();
            })

            socket.on('chat_message', function(data) {
                // Message. Make a message "object" then fire.
                GlobalLocalUData = WebSocket.getLocalUserData();
                var MsgObject = {
                    rawUserData: data.userData,
                    userID: data.userData.userID,
                    nickName: data.userData.nickName,
                    content: data.content,
                    room: data.userData.currentRoom,
                }

                eventEmitter.emit('message', MsgObject)
            })
        })
    }
}

module.exports = Client