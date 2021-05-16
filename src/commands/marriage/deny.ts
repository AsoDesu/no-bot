import { Message, MessageEmbed } from "discord.js";

import firebase from "firebase";
import "firebase/firestore";

var db = firebase.firestore();
import "../../firebaseinnit";

import randColor from "../../randomColor";

async function command(msg: Message, args: string[]) {
	if (msg.mentions.users.size == 0) {
		msg.channel.send("You must provide you you want to deny.");
		return;
	}

	// Check if the target has proposed to user.
	var user_doc = await db.collection("users").doc(msg.author.id).get();
	var target_doc = await db.collection("users").doc(msg.mentions.users.first().id).get();

	var target_proposed_list: string[] = target_doc.exists && target_doc.data().proposed_to ? target_doc.data().proposed_to : [];

	if (!target_proposed_list.includes(msg.author.id)) {
		msg.channel.send("That user hasn't proposed to you :(");
		return;
	}

	target_proposed_list.splice(target_proposed_list.indexOf(msg.author.id));

	target_doc.ref.set(
		{
			proposed_to: target_proposed_list,
		},
		{ merge: true }
	);
	msg.channel.send(`You denied ${msg.mentions.users.first().username} :(`);
}

export default command;
