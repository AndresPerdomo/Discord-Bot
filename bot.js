const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const {championList} = require('./championList');
const queue = new Map();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;
    if (message.content.startsWith('!Tochito play')) {
      // Only try to join the sender's voice channel if they are in one themselves
      const msg = message.content.split(' ');
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
          .then(connection => { // Connection is an instance of VoiceConnection
            // const dispatcher = connection.playFile('./Song.mp3');
            const dispatcher = connection.playStream(ytdl(msg[2]), { filter : 'audioonly'});
            dispatcher.on('message', message => {
                if(message.content.startsWith("!Tochito stop")){
                    message.reply("Me voy a desconectar");
                    message.member.voiceChannel.leave(); 
                }
            })
            client.on('message', message => {
                if(message.content.startsWith("!Tochito stop")){
                    message.reply("Me voy a desconectar");
                    message.member.voiceChannel.leave(); 
                }
            })
            dispatcher.on('end', () => {
                message.reply("Song ended");
                message.member.voiceChannel.leave();
              });
              dispatcher.on('error', e => {
                // Catch any errors that may arise
                console.log(e);
              });
          })
          .catch(console.log);
      } else {
        message.reply('You need to join a voice channel first!');
      }
    }
  });


// storing jokes in a variable jokes

var jokes = [
    { name: 'Dozen', answer: 'anybody want to let me in?' },
    { name: 'Avenue', answer: 'knocked on this door before?' },
    { name: 'Ice Cream', answer: 'if you don\'t let me in!' },
    { name: 'Adore', answer: 'is between us. Open up!' },
    { name: 'Lettuce', answer: 'in. Its cold out here!' },
    { name: 'Mikey', answer: 'doesnt fit through this keyhole' }
]

//choosing a random joke from the array

var knock = function() {
    var joke = jokes[Math.floor(Math.random() * jokes.length)]
    return formatJoke(joke)
}

//Formatting the output to return in a new line and plug in the output variables
function formatJoke(joke) {
    return [
        'Knock, knock.',
        'Who’s there?',
        joke.name + '.',
        joke.name + ' who?',
        joke.name + ' ' + joke.answer
    ].join('\n')
}
    
//Turn the discordjs on to listen to a message
    client.on('message', async message => {

//Listens to each instance of the message /knock and executes the code below
        if (message.content.startsWith(prefix + "knock")) {
            const msg = message.content.split(' ');
//Function knock() returns the formatted joke
                message.reply(knock());
        } else if (message.content.startsWith(prefix + 'cat')){
            fetch('https://aws.random.cat/meow')
            .then(response => response.json())
            .then(body => message.reply(body.file));
        }
    });  

client.login(process.env.BOT_TOKEN);