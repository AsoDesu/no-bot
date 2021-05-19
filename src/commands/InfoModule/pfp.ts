import { Message } from "discord.js";
import BaseCommand from "../BaseCommand";

import scoresaber from "../../scoresaberApiGrabber";
import got from "got/dist/source";
import commandManager from "../../commandManager";

class PfpCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (msg.mentions.users.size == 0) {
			msg.channel.send("You need to provide a user");
			return;
		}
		msg.channel.send(msg.mentions.users.first().avatarURL({ dynamic: args.length > 1 && args[1] == "gif" }));
	}
	label = "pfp";

	description = "Get someones profile picture from discord";
	usage = ">pfp (@User) [gif]";
}

commandManager.registerCommand(new PfpCommand());
