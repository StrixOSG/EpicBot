require("dotenv").config();
var epicStoreApi = require("./epicStoreApi");

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);
client.on('ready', onDiscordReady);
client.on("message", onDiscordMessage);

function onDiscordReady() {
    console.log('I\'m alive');
}

function onDiscordMessage(msg) {
    if(msg.content.includes('Epic good')) {
        fetchFreeGames(msg.channel);
    }
}

const sendFreeGamesMessage = (gameData, channel) => {
    console.log(gameData);
	if (gameData.length === 0) {
		// The empty game array means the data fetching failed
		channel.send("The bot is offline maybe a maintainace 🤒");
		return;
	}
	gameData.map((game) => {
		const embed = {
			title: game.title,
			thumbnail: { url: game.image },
			description: `Offer Ends: ${new Date(game.offerTill).toLocaleString()}`,
			url: `https://www.epicgames.com/store/en-US/product/${game.productSlug}`,
        };
        channel.send('@here New Free Game on Epic Today');
		channel.send({ embed: embed });
	});
}

const fetchFreeGames = async (channel) => {
	gameData = await epicStoreApi.getFreeGames();
	if (gameData.error) {
		console.log(data.error);
		return;
	}
	sendFreeGamesMessage(gameData.freeGamesData, channel);
};