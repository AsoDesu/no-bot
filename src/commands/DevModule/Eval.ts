import { Message } from "discord.js";
import commandManager from "../../commandManager";
import BaseCommand from "../BaseCommand";

class EvalCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.hasPermission("ADMINISTRATOR")) return;
		var result = await eval(msg.content.replace(`${process.env.PREFIX}eval `, "").replace(/`/g, ""));
		msg.channel.send(result).catch(() => {});
	}
	label = "eval";
	hidden = true;
}

commandManager.registerCommand(new EvalCommand());
