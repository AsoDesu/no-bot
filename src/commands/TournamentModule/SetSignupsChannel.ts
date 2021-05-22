import BaseCommand from "../BaseCommand";

import firebase from "firebase";
import "firebase/firestore";
import { Message } from "discord.js";
import BeatKhanaWebscoket from "../../modules/BeatKhanaWebscoket";
import commandManager from "../../commandManager";
var db = firebase.firestore();

class SetSignupsChannel extends BaseCommand {
	execute(msg: Message, args: string[]) {
		if (!msg.member.hasPermission("MANAGE_GUILD")) {
			msg.channel.send("You can't do this");
			return;
		}

		db.collection("guilds")
			.doc(msg.guild.id)
			.set({ tournamentServer: true }, { merge: true })
			.then(() => {
				BeatKhanaWebscoket.RestartWebscoket();
				BeatKhanaWebscoket.BKWS.SetSignupsChannel(msg.channel.id);
				msg.delete();
			});
	}
	label = "setsignups";
	hidden = true;
	//whitelistedServers = ["809084684716867645"];
}

commandManager.registerCommand(new SetSignupsChannel());
