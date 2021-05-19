import { Message, MessageEmbed } from "discord.js";
import commandManager from "../../commandManager";
import BaseCommand from "../BaseCommand";

class InfoCommand extends BaseCommand {
	execute(msg: Message, args: string[]) {
		msg.channel.send(
			new MessageEmbed({
				title: "Dev Info",
				description: "Hi, I'm a developer who has absolutly no idea what he's doing \n [GitHub](https://github.com/AsoDesu) \n [Twitch](https://www.twitch.tv/asodesu_) \n [Twitter](https://twitter.com/AsoDesu_)",
				color: 16775936,
				author: {
					icon_url: "https://pbs.twimg.com/profile_images/1393608926378307593/J5Ls7Go5_200x200.jpg",
					name: "Aso#0001",
				},
			})
		);
	}
	label = "dev";

	description = "Get the developer of this bot.";
	usage = ">dev";
}

commandManager.registerCommand(new InfoCommand());
