import { Message } from "discord.js";
import numberFormatter from "./_numberFormatter";

import firebase from "firebase";
import "firebase/firestore";
import "../../firebaseinnit";
var db = firebase.firestore();
import BaseCommand from "../BaseCommand";
import commandManager from "../../commandManager";

class GetXPCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var userData = await db.collection("users").doc(msg.author.id).get();
		var currentBal: number;
		if (userData.exists && userData.data().bal) {
			if (msg.createdTimestamp - userData.data().balLastRun < 3600000) {
				var tryAgainIn = (msg.createdTimestamp - userData.data().balLastRun - 3600000) * -1;
				msg.channel.send("This command was last run less than an hour ago, try again in " + numberFormatter.msToMandS(tryAgainIn));
				return;
			}
			currentBal = userData.data().bal;
		} else {
			currentBal = 0;
		}

		var balGive = Math.floor(Math.random() * 100);
		currentBal += balGive;
		await db
			.collection("users")
			.doc(msg.author.id)
			.set(
				{
					bal: currentBal,
					balLastRun: msg.createdTimestamp,
				},
				{ merge: true }
			)
			.catch(() => {
				msg.channel.send("Something went wrong, please try again later");
			});

		msg.channel.send(`You got ${balGive}xp, your balance is now ${currentBal}xp`);
	}
	label = "play";
	description = "Get a random amount of xp, between 1-100xp. Can only be run every hour.";
	usage = ">play";
}

commandManager.registerCommand(new GetXPCommand());
