import { Message } from "discord.js";
import BaseCommand from "../BaseCommand";

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

var db = firebase.firestore();

import "../../firebaseinnit";
import commandManager from "../../commandManager";

class RemoveUser extends BaseCommand {
	execute(msg: Message, args: string[]) {
		if (!msg.member.hasPermission("MANAGE_ROLES")) {
			msg.reply("You can't do that!");
		}

		if (msg.mentions.users.size == 0) {
			msg.reply("User not provided");
			return;
		}
		var user = msg.mentions.members.first();
		db.collection("users")
			.doc(user.id)
			.get()
			.then(async (doc) => {
				if (!doc.exists) {
					msg.reply("That user is not registered");
					return;
				}

				msg.channel.startTyping();
				await user.roles.remove(msg.client.guilds.cache.get(process.env.GUILDID).roles.cache.find((r) => r.name == "Member"));
				await db.collection("users").doc(user.id).delete();
				msg.channel.send("Deleted.");
				msg.channel.stopTyping(true);
			});
	}
	label = "remove";
	hidden = true;
}

commandManager.registerCommand(new RemoveUser());
