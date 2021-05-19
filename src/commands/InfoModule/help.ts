import { EmbedFieldData, Message, MessageEmbed } from "discord.js";
import commandManager from "../../commandManager";
import BaseCommand from "../BaseCommand";

class HelpCommand extends BaseCommand {
	execute(msg: Message, args: string[]) {
		var GuildID = msg.guild.id;
		var cmds = commandManager.commands.filter((c) => c.whitelistedServers.length == 0 || c.whitelistedServers.includes(GuildID));
		if (args[0] == "all") cmds = commandManager.commands;
		msg.channel.send(
			new MessageEmbed({
				title: "Help (1/1)",
				fields: generateFeilds(cmds),
			})
		);
	}
	label = "help";

	usage = ">help";
	description = "Get the help menu.";
}

function generateFeilds(cmds: BaseCommand[]): EmbedFieldData[] {
	var fields: EmbedFieldData[] = [];

	cmds.forEach((cmd) => {
		if (cmd.hidden == true) return;
		fields.push({
			name: `\`${cmd.usage}\``,
			value: `${cmd.description}${cmd.aliases ? `\n**Aliases:** \`${cmd.aliases.join("`, `")}\`` : ``}`,
		});
	});

	return fields;
}

commandManager.registerCommand(new HelpCommand());
