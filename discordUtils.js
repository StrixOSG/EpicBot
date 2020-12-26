module.exports = {
	async previousEmbedMessagesInclude(newMessage, channel) {
		const messages = await channel.messages.fetch({ limit: 30 });
		let matchFound = false;
		messages.forEach(message => {
			if (message.author.bot && message.embeds.length > 0) {
				if(message.embeds[0].description === newMessage) {
					matchFound = true;
				}
			}
		});
		return matchFound;
	},
};