import { Message } from "discord.js";
import commandManager from "../../commandManager";
import BeatKhanaWebscoket from "../../modules/BeatKhanaWebscoket";
import BaseCommand from "../BaseCommand";

class ReconnectCommand extends BaseCommand {
	execute(msg: Message, args: string[]) {
		if (!msg.member.hasPermission("MANAGE_GUILD")) {
			msg.channel.send("You can't do this");
			return;
		}

		BeatKhanaWebscoket.RestartWebscoket();
	}

	label = "bkreconnect";
	hidden = true;
	whitelistedServers = ["809084684716867645"];
}

commandManager.registerCommand(new ReconnectCommand());
