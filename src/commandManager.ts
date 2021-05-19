import { Message } from "discord.js";
import Command from "./commands/BaseCommand";

var commands: Command[] = [];

function registerCommand(cmd: Command) {
	if (cmd.label == "") {
		console.log("A command you're trying to register does not have a label.");
		return;
	}
	commands.push(cmd);
}

function executeCommand(msg: Message, args: string[], label: string): boolean {
	var targetCmd = commands.find((c) => c.label == label || (c.aliases && c.aliases.includes(label)));
	if (!targetCmd) return false;

	if (!msg.guild && !targetCmd.allowedInDM) {
		msg.channel.send("You can't run this command in DM.");
		return false;
	}

	if (targetCmd.whitelistedServers.length != 0 && !targetCmd.whitelistedServers.includes(msg.guild.id)) {
		msg.channel.send("You can't run that command in this server.");
		return false;
	}

	targetCmd.execute(msg, args);
	return true;
}

export default {
	commands,
	registerCommand,
	executeCommand,
};
