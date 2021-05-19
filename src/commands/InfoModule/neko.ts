import { Message, TextChannel } from "discord.js";
import got from "got";
import commandManager from "../../commandManager";
import BaseCommand from "../BaseCommand";

class NekoCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (args[0] == "lewd") {
			if (!(msg.channel as TextChannel).nsfw && msg.guild) {
				msg.channel.send("This command has to be run in an NSFW chat.");
				return;
			}
			var data = JSON.parse((await got("https://nekos.life/api/v2/img/lewd")).body);
			msg.channel.send(data.url);
			return;
		}
		var data = JSON.parse((await got("https://nekos.life/api/v2/img/neko")).body);
		msg.channel.send(data.url);
	}
	label = "neko";
	allowedInDM = true;

	description = "Get a random catgirl from the nekos.life API";
	usage = ">neko [lewd]";
}

commandManager.registerCommand(new NekoCommand());
