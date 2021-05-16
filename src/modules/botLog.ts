import { Client, Guild, MessageEmbed, TextChannel } from "discord.js";

import path from "path";
import randomEmbedColor from "../randomColor";
import index from "../index";

process.on("unhandledRejection", (reason: Error) => {
	if (!reason) return;
	log(reason.stack, index.getClient(), "botLog.js");
});

function log(x: string, client: Client, caller: string) {
	var channel: TextChannel = client.guilds.cache.get(process.env.GUILDID).channels.cache.get(process.env.LOGCHANNEL) as TextChannel;
	if (channel.type != "text") {
		channel = channel as TextChannel;
	}

	channel.send(
		new MessageEmbed({
			author: {
				name: path.basename(caller),
				icon_url: client.user.avatarURL(),
			},
			description: `**${x}**`,
			footer: {
				text: new Date().toISOString(),
			},
			color: randomEmbedColor(),
		})
	);
}

export default log;
