require('dotenv').config();
const epicStoreApi = require('./modules/epicStoreApi');
const epicStoreFreeGames = require('./modules/epicStoreFreeGames');
const schedule = require('node-schedule');

const Discord = require('discord.js');
const client = new Discord.Client();
let discordChannel;

client.login(process.env.BOT_TOKEN);
client.on('ready', onDiscordReady);
client.on('message', onDiscordMessage);

async function onDiscordReady() {
	console.log('I\'m alive');
	await setDiscordChannel();
	scheduleJobsToFindFreeGames();
}

async function onDiscordMessage(msg) {
	if(msg.content.includes('Epic good')) {
		await fetchFreeGames();
	}
}

async function setDiscordChannel() {
	try {
		discordChannel = await client.channels.fetch(process.env.DISCORD_CHANNEL);
	}
	catch(error) { console.log(error); }
}

function scheduleJobsToFindFreeGames() {
	fetchFreeGames();
	// Attempt to find the new free game at 10:00, 10:01, and 10:05 am
	schedule.scheduleJob('00 10 * * *', fetchFreeGames);
	schedule.scheduleJob('01 10 * * *', fetchFreeGames);
	schedule.scheduleJob('05 10 * * *', fetchFreeGames);
}

async function fetchFreeGames() {
	const gameData = await epicStoreApi.getFreeGames();
	if (gameData.error) {
		console.log(gameData.error);
		return;
	}
	await epicStoreFreeGames.sendMessage(gameData.freeGamesData, discordChannel);
}