'use strict';
// Entry point for all things API.

// Initialise socketing client libs.
const io = require('socket.io-client');

// Initialise Client class.
var Client = require('./client/Client')

// Create an event so we can do some hacky things.
const EventEmitter = require('events');
const BotEvents = new EventEmitter();

// Instantise bot.
var bot = new Client();

BotEvents.on('ready', () => {
    console.log("[BOT] Bot connected successfully!")
})

BotEvents.on('message', msg => {
    if ( msg.content == "ping" ) {
        bot.sendMessage("[" + msg.nickName + "] Pong!")
    }

})

bot.login({serverIP:"http://localhost:3000",username:'funey-testingAPI',bio:'testing new api'}, BotEvents)


//myEmitter.emit('event');