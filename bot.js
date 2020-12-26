require('dotenv').config();
const epicStoreApi = require('./epicStoreApi');
const schedule = require('node-schedule');

const Discord = require('discord.js');
const client = new Discord.Client();
let discordChannel;

client.login(process.env.BOT_TOKEN);
client.on('ready', onDiscordReady);
client.on('message', onDiscordMessage);

async function onDiscordReady() {
	console.log('I\'m alive');
	discordChannel = await client.channels.fetch('162338237380165632');
	schedule.scheduleJob('51 17 * * *', fetchFreeGames);
}

function onDiscordMessage(msg) {
	if(msg.content.includes('Epic good')) {
		fetchFreeGames();
	}
}

function sendFreeGamesMessage(gameData) {
	console.log(gameData);
	if (gameData.length === 0) {
		return;
	}
	gameData.map((game) => {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${game.title} - New Free Game  ❤️`)
			.setImage(game.image)
			.setDescription(`Offer Ends: ${new Date(game.offerTill).toLocaleString()}`)
			.setURL(`https://www.epicgames.com/store/en-US/product/${game.productSlug}`);
		discordChannel.send({ embed: embed });
	});
}

async function fetchFreeGames() {
	const gameData = await epicStoreApi.getFreeGames();
	if (gameData.error) {
		console.log(gameData.error);
		return;
	}
	sendFreeGamesMessage(gameData.freeGamesData);
}