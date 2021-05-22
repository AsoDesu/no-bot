import { Message } from "discord.js";
import BaseCommand from "../BaseCommand";

import firebase from "firebase";
import "firebase/firestore";
import BeatKhanaWebscoket from "../../modules/BeatKhanaWebscoket";
import commandManager from "../../commandManager";
var db = firebase.firestore();

class SetTournamentID extends BaseCommand {
	execute(msg: Message, args: string[]) {
		if (!msg.member.hasPermission("MANAGE_GUILD")) {
			msg.channel.send("You can't do this");
			return;
		}

		if (!args[0] || isNaN(parseInt(args[0]))) {
			msg.channel.send("Usage: `>tournamentid (tournament id)`");
			return;
		}

		db.collection("guilds")
			.doc(msg.guild.id)
			.set({ tournamentServer: true }, { merge: true })
			.then(() => {
				BeatKhanaWebscoket.BKWS.SetTournamentID(parseInt(args[0]));
			});
		msg.channel.send("Set Tournament Id.");
	}

	label = "tournamentid";
	hidden = true;
	whitelistedServers = ["809084684716867645"];
}

commandManager.registerCommand(new SetTournamentID());
