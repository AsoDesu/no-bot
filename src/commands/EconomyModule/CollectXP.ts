import { Message } from "discord.js";
import numberFormatter from "./_numberFormatter";

import cache from "../../modules/EconomyCache";

import firebase from "firebase";
import "firebase/firestore";

var db = firebase.firestore();
import BaseCommand from "../BaseCommand";
import commandManager from "../../commandManager";

class CollectXP extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var userData = await db.collection("users").doc(msg.author.id).get();
		var bal = userData.exists && userData.data().bal ? userData.data().bal : 0;

		var uncollectedbal = cache.cache.find((u) => u.userid == msg.author.id).amount;

		if (uncollectedbal < 1) {
			msg.channel.send(`You haven't collected enough xp to collect yet, You collected **${uncollectedbal.toFixed(2)}**, and need at least 1xp to collect`);
			return;
		} else {
			bal += parseFloat(uncollectedbal.toFixed(2));
			cache.resetxp(msg.author.id);
			msg.channel.send(`You collected **${parseFloat(uncollectedbal.toFixed(2))}**xp, your balance is now **${bal}**xp`);
		}

		db.collection("users").doc(msg.author.id).set(
			{
				bal: bal,
			},
			{ merge: true }
		);
	}
	label = "collect";
	description = "Collect xp, given 0-0.9xp per message.";
	usage = ">collect";
}

commandManager.registerCommand(new CollectXP());
