import { Message } from "discord.js";
import commandManager from "../../commandManager";
import BaseCommand from "../BaseCommand";

class ScuffedCommand extends BaseCommand {
	execute(msg: Message, args: string[]) {
		msg.channel.send("We are friends with scuffed tourneys, you could go check them out: https://discord.gg/KkNrSyVTcd");
	}
	label = "scuffed";
	whitelistedServers = ["777110342291554306"];
	hidden = true;
}

commandManager.registerCommand(new ScuffedCommand());
