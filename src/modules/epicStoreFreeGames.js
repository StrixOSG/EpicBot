const Discord = require('discord.js');
const discordUtils = require('./discordUtils');

module.exports = {
	async sendMessage(gameData, channel) {
		console.log(`Attempting to send new free game message ${JSON.stringify(gameData)}`);
		if (gameData.length === 0) {
			return;
		}
		gameData.map(async (game) => {
			const offerEndDate = `Offer Ends: ${game.offerTill}`;
			const newGame = !(await discordUtils.previousEmbedMessagesInclude(offerEndDate, channel));
			if(newGame) {
				const embed = new Discord.MessageEmbed()
					.setTitle(`${game.title} - New Free Game 💸`)
					.setImage(game.image)
					.setDescription(offerEndDate)
					.setURL(`https://www.epicgames.com/store/en-US/product/${game.productSlug}`);
				channel.send({ embed: embed });
			}
		});
	},
};