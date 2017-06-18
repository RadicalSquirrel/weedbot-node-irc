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
var staticcmds = require('./items/static.json');
youtube.setKey(googleoptions.ytkey);
// Get the libs
var irc = require("irc");
const fs = require("fs");
var user_commands = /[@!$]/;
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
  } else if (user_commands.test(message.charAt(0))){
    console.log("this is a command!");
    var cmd,
    subcmd;
    if (message.includes(' ')){
      const args = message.split(' ');
      console.log(args);
      cmd = args[0].toLowerCase();
      subcmd = args[1].toLowerCase();
    } else {
      cmd = message.toLowerCase();
    }
    const test = staticcmds.find(x => x.cmd === cmd.substring(1));
    console.log(test);
    if (test){
      bot.say(config.channels[0], test.message);
    }
    if (cmd == "!gif"){
      console.log("Random Line from gif.json");
      randomItem('gif.json', gif=>{
        bot.say(config.channels[0], gif);
      });
    }
    if (cmd == "!add"){
      console.log('Add!');
      const argstring = message.substr(message.toLowerCase().indexOf(subcmd) + subcmd.length).trim();
      if (subcmd=='gif'){
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
      } else if (subcmd=='quote') {
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
      } else if (subcmd=='static') {
        const args = message.split(' ');
        const subcmd2=args[2].toLowerCase();
        const argstring2 = message.substr(message.toLowerCase().indexOf(subcmd2) + subcmd2.length).trim();
        console.log(from + ' adding static' + argstring);
        fs.readFile('./items/static.json', 'utf-8', (err, data) => {
          if (err) console.log(err);
          else {
            const array = JSON.parse(data);
            const obj = {};
            obj.message = argstring2;
            obj.cmd = subcmd2;
            array.push(obj);
            staticcmds.push(obj);
            fs.writeFile('./items/static.json', JSON.stringify(array), 'utf-8', err => {
              if (err) { console.log(err);}
              else {
                bot.say(config.channels[0], "Added!");
              }
            });
          }
        });
      }
    }
    if (cmd == "!shit"){
      console.log("Random Line from shit.json");
      randomItem('shit.json', shit=>{
        bot.say(config.channels[0], shit);
      });
    }
    if (cmd == "!quote"){
      console.log("Quote!");
      randomItem('quote.json', quote =>{
        bot.say(config.channels[0], quote);
      });
    }
    if (cmd == "!rng") {
      bot.say(config.channels[0], (Math.floor(Math.random() * (999999 - 1 + 1)) + 1));
    }
    if (cmd == "!color") {
      bot.say(config.channels[0], irc.colors.wrap('magenta','TEST'));
    }
    if (cmd == '@gis') {
      const argstring = message.substr(message.toLowerCase().indexOf(cmd) + cmd.length).trim();
      console.log('searching image: ' + argstring);
      search.build({
        searchType: 'image',
        q: argstring
      }, (err,res) => {
        if (err) {console.log(err);}
        else if (res.queries.request[0].totalResults === "0") {
          console.log('full res: ' + JSON.stringify(res));
          console.log('No results');
          bot.say(config.channels[0], 'No results! :(');
        }
        else {
          console.log('full res: ' + JSON.stringify(res));
          console.log('item selected: ' + res.items[0].link);
          bot.say(config.channels[0], res.items[0].link);
        }
      });
    }
    if (cmd=='@g') {
      const argstring = message.substr(message.toLowerCase().indexOf(cmd) + cmd.length).trim();
      console.log('searching: ' + argstring);
      search.build({
        q: argstring
      }, (err,res)=>{
        if (err) {console.log(err);}
        else if (res.queries.request[0].totalResults === "0") {
          console.log('full res: ' + JSON.stringify(res));
          console.log('No results');
          bot.say(config.channels[0], 'No results! :(');
        }
        else {
          console.log('full res: ' + JSON.stringify(res));
          console.log('res from search: ' + res.items[0].link);
          bot.say(config.channels[0], res.items[0].link);
        }
      });
    }
    if (cmd=='@yt') {
      const argstring = message.substr(message.toLowerCase().indexOf(cmd) + cmd.length).trim();
      console.log('youtubing: ' + argstring);
      youtube.search(argstring,5,(err,res)=>{
        if (err) {console.log(err);}
        else {
          var id = 0;
          if (!res.items[0].id.videoId) id++;
          console.log('full res: ' + JSON.stringify(res));
          console.log('res from search: ' + res.items[id].id.videoId);
          bot.say(config.channels[0], 'https://youtu.be/' + res.items[id].id.videoId);
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
