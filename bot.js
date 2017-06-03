// Create the configuration
var config = require('./config/irc.json');

// Get the libs
var irc = require("irc");
const fs = require("fs");

// Create the bot
var bot = new irc.Client(config.server, config["bot-name"], { channels: config.channels });

bot.addListener('message', function(from, to, message) {
  console.log('from : ' + from)
  console.log('to : ' + to)
  console.log('message : ' + message)
  if (config.accept_commands === false) {
    console.log('bot not accepting commands')
    return;
  } else if(from.includes(config["bot-name"])){
    console.log('I said this!')
  } else if (message.charAt(0) === config.user_command){
    //Command character found at index 0.
    var cmd;
    if (message.includes(' ')){
      cmd = message.substr(1, cmd-1).toLowerCase();
    } else {
      cmd = message.substr(1).toLowerCase();
    }
    if (cmd == "info"){
      bot.say(config.channels[0], config.info_message);
    }
    if (cmd == "weed") {
      bot.say(config.channels[0], "http://420.moe");
    }
    if (cmd == "sandwich"){
      bot.say(config.channels[0],"I made you a sandwich! :3");
    }
    if (cmd == "gif"){
      console.log("Random Line from gif.txt");
      sayRandomLine('./items/gif.txt');
    }
    if (cmd == "shit"){
      console.log("Random Line from shit.txt");
      sayRandomLine('./items/shit.txt');
    }
    if (cmd == "version"){
      console.log("Version Check");
      bot.say(config.channels[0], 'HOIIIII my version is 3.0 rite now');
    }
    if (cmd == "quote"){
      console.log("Quote!");
      sayRandomLine('./items/quote.txt');
    }
    if (cmd == "rng") {
      bot.say(config.channels[0], (Math.floor(Math.random() * (999999 - 1 + 1)) + 1))
    }
    if (cmd == "commands" || cmd == "help" || cmd == "list"){
      bot.say(config.channels[0], "!info, !weed, !rng, !gif, !shit, !version, !quote, !color, !commands/!help/!list, !sandwich")
    }
    if (cmd == "color") {
      bot.say(config.channels[0], irc.colors.wrap('magenta','TEST'));
    }
  }
});

// Pull file
function sayRandomLine(filename){
  fs.readFile(filename, "utf-8", function(err, data){
    if(err) throw err;
    var lines = data.split('\n');
    var randomLine = lines[Math.floor(Math.random()*lines.length)];
    console.log(randomLine);
    bot.say(config.channels[0], randomLine);
  })
}

// Send for Names (experiment with this)
//function getNames(){ Client.send('names', config.channels[0]); }

// List for names and output to console
//bot.addListener('names', function(channel, names) {
//  namekeys = Object.keys(names); //creates an array of all User Names in the channel
//  for (i=0; i < namekeys.length; ++i) { console.log(namekeys[i]); } //logs all names to console
// This actually needs to do two things
// This needs to See if anyone cool is online, match the name, and pull
// from a file that is specific for that purpose (maybe individual text
// files for each person). This also needs to have generic lines that fit
// any individual person, and that is pulled from a separate text file
// but this needs to be combined and random so that it doesn't always
// ping the same person. This is the difficult part. Potentially handle
// it by rolling a random number based on the number of people in chat
// and subtracting for each notable person in chat
// this might be able to be done by reading how many text files are in
// the directory and comparing the file names to the users
// this would be a semi decent way to do this to scale it out even while
// new people join chat that we talk shit about. This also allows for a
// much more equal perspective for randoms to get called as the random
// will benefit from each person in the chat. This however has to be
// completely random and is easier to write
//
//  });
