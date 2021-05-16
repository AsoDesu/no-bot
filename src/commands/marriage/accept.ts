import { Message, MessageEmbed } from "discord.js";

import firebase from "firebase";
import "firebase/firestore";

var db = firebase.firestore();
import "../../firebaseinnit";

import randColor from "../../randomColor";

async function command(msg: Message, args: string[]) {
	if (msg.mentions.users.size == 0) {
		msg.channel.send("You must provide you you want to accept.");
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

	// Apply Marriage :D
	var user_marriage_list: string[] = user_doc.exists && user_doc.data().married_to ? user_doc.data().married_to : [];
	var targer_marriage_list: string[] = target_doc.exists && target_doc.data().married_to ? target_doc.data().married_to : [];

	if (user_marriage_list.includes(msg.mentions.users.first().id)) {
		msg.channel.send("You're allready married to this user.");
		return;
	}

	user_marriage_list.push(msg.mentions.users.first().id);
	targer_marriage_list.push(msg.author.id);

	target_proposed_list.splice(target_proposed_list.indexOf(msg.author.id));

	user_doc.ref.set(
		{
			married_to: user_marriage_list,
		},
		{ merge: true }
	);

	target_doc.ref.set(
		{
			married_to: targer_marriage_list,
			proposed_to: target_proposed_list,
		},
		{ merge: true }
	);

	msg.mentions.users.first().send(
		new MessageEmbed({
			title: `Proposal Accepted from ${msg.author.username}!!`,
			description: `${msg.author.username} has accepted your proposal!`,
			thumbnail: {
				url: msg.author.avatarURL(),
			},
			color: user_doc.exists && user_doc.data().color ? user_doc.data().color : randColor(),
		})
	);

	msg.channel.send(`You accepted proposal from ${msg.mentions.users.first().username}!!`);
}

export default command;
