/* jshint esversion: 6*/

// Create the configuration
var config = require('./config/irc.json');
var users = require('./config/users.json');
var googleoptions = require('./config/google.json');
var google = require('google-search');
var search = new google(googleoptions);
var Youtube = require('youtube-node');
var youtube = new Youtube();
var talk = false;
youtube.setKey(googleoptions.ytkey);
// Get the libs
var irc = require("irc");
const fs = require("fs");

// Create the bot
var bot = new irc.Client(config.server, config["bot-name"], { channels: config.channels, retryCount: 50, autoRejoin: true });

setTimeout(talkTrue,3000);

bot.addListener('message', (from, to, message) => {
  console.log('from : ' + from + '\nto: ' + to + '\nmessage: ' + message);
  if (config.accept_commands === false || talk === false) {
    console.log('bot not accepting commands');
    return;
  } else if(from.includes(config["bot-name"])){
    console.log('I said this!');
  } else if (message.charAt(0) === config.user_command){
    var cmd,
    subcmd,
    argstring = '';
    if (message.includes(' ')){
      const args = message.split(' ');
      console.log(args);
      cmd = args[0].substr(1).toLowerCase();
      if (args[1]) {
        subcmd = args[1].toLowerCase();
      }
      if (args[2]) {
        for (var i = 2; i < args.length; i++) {
          argstring += args[i] + ' ';
        }
        argstring = argstring.trim();
      }
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
      console.log("Random Line from gif.json");
      randomItem('gif.json', gif=>{
        bot.say(config.channels[0], gif);
      });
    }
    if (cmd == "add"){
      console.log('Add!');
      if (subcmd=='gif'&&argstring){
        console.log(from + ' adding gif' + argstring);
        fs.readFile('./items/gif.json', 'utf-8', (err, data) => {
          if (err) console.log(err);
          else {
            const array = JSON.parse(data);
            array.push(argstring);
            fs.writeFile('./items/gif.json', JSON.stringify(array), 'utf-8', err => {
              if (err) { console.log(err);}
              else {
                bot.say(config.channels[0], "Added!");
              }
            });
          }
        });
      } else if (subcmd=='quote'&&argstring){
        console.log(from + ' adding quote' + argstring);
        fs.readFile('./items/quote.json', 'utf-8', (err, data) => {
          if (err) console.log(err);
          else {
            const array = JSON.parse(data);
            array.push(argstring);
            fs.writeFile('./items/quote.json', JSON.stringify(array), 'utf-8', err => {
              if (err) { console.log(err);}
              else {
                bot.say(config.channels[0], "Added!");
              }
            });
          }
        });
      }
    }
    if (cmd == "shit"){
      console.log("Random Line from shit.json");
      randomItem('shit.json', shit=>{
        bot.say(config.channels[0], shit);
      });
    }
    if (cmd == "version"){
      console.log("Version Check");
      bot.say(config.channels[0], config.version);
    }
    if (cmd == "quote"){
      console.log("Quote!");
      randomItem('quote.json', quote =>{
        bot.say(config.channels[0], quote);
      });
    }
    if (cmd == "rng") {
      bot.say(config.channels[0], (Math.floor(Math.random() * (999999 - 1 + 1)) + 1));
    }
    if (cmd == "commands" || cmd == "help" || cmd == "list"){
      bot.say(config.channels[0], "!info, !weed, !rng, !gif, !shit, !version, !quote, !color, !commands/!help/!list, !sandwich");
    }
    if (cmd == "color") {
      bot.say(config.channels[0], irc.colors.wrap('magenta','TEST'));
    }
  } else if (message.charAt(0)=='@'){
    var split_message,cmd2,argstring2;
    if (message.includes(' ')){
      split_message = message.split(' ');
      cmd2 = split_message[0];
      argstring2 = message.substr(message.indexOf(cmd2)+cmd2.length);
    }
    if (cmd2=='@gis') {
      console.log('searching image: ' + argstring2);
      search.build({
        searchType: 'image',
        q: argstring2
      }, (err,res) => {
        if (err) {console.log(err);}
        else {
          console.log('full res: ' + JSON.stringify(res));
          console.log('item selected: ' + res.items[0].link);
          bot.say(config.channels[0], res.items[0].link);
        }
      });
    } else if (cmd2=='@g') {
      console.log('searching: ' + argstring2);
      search.build({
        q: argstring2
      }, (err,res)=>{
        if (err) {console.log(err);}
        else {
          console.log('full res: ' + JSON.stringify(res));
          console.log('res from search: ' + res.items[0].link);
          bot.say(config.channels[0], res.items[0].link);
        }
      });
    } else if (cmd2=='@yt') {
      console.log('youtubing: ' + argstring2);
      youtube.search(argstring2,5,(err,res)=>{
        if (err) {console.log(err);}
        else {
          console.log('full res: ' + JSON.stringify(res));
          console.log('res from search: ' + res.items[0].id.videoId);
          bot.say(config.channels[0], 'https://youtu.be/' + res.items[0].id.videoId);
        }
      });
    }
  }
});

bot.addListener('error', err => {
  console.log('error: ' + err);
});

bot.addListener('pm', (from, message) => {
  console.log('pm from: ' + from + '\nmessage: ' + message);
  if (from.includes(users.admins)){
    bot.say(from, "You're an admin!!");
    if(message == 'reload'){
      console.log('reload actions here');
    }
  } else {
    bot.say("I don't want to talk to you!");
  }
});

function randomItem(filename,item) {
  fs.readFile('./items/'+filename, 'utf-8', (err, data) => {
    let items = JSON.parse(data);
    console.log('Array Length: ' + items.length);
    let random_index = Math.floor(Math.random()*((items.length-1)+1));
    console.log('random index: ' + random_index);
    let random_item = items[random_index];
    console.log('random item for ' + filename + ' :' + random_item);
    item(random_item);
  });
}

function talkTrue(){
  talk=true;
  console.log('talk: ' + talk);
  return;
}

/* todo list:
#3 Anime integration


*/
// Send for Names (experiment with this)
//function getNames(){ Client.send('names', config.channels[0]); }

// List for names and output to console;
//bot.addListener('r  console.log('random index: ' + random_index);ndom_indexnames', function(channel, names) {
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
