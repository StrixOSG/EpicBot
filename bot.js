require("dotenv").config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);
client.on('ready', discordReady);

function discordReady() {
    console.log('I\'m alive');
}