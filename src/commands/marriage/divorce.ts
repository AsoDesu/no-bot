import { Message, MessageEmbed } from "discord.js";

import firebase from "firebase";
import "firebase/firestore";

var db = firebase.firestore();
import "../../firebaseinnit";

import randColor from "../../randomColor";

async function command(msg: Message, args: string[]) {
	if (msg.mentions.users.size == 0) {
		msg.channel.send("You must provide you you want to divorce.");
		return;
	}

	// Check if the target has proposed to user.
	var user_doc = await db.collection("users").doc(msg.author.id).get();
	var target_doc = await db.collection("users").doc(msg.mentions.users.first().id).get();

	var target_proposed_list: string[] = target_doc.exists && target_doc.data().proposed_to ? target_doc.data().proposed_to : [];

	// Apply Marriage :D
	var user_marriage_list: string[] = user_doc.exists && user_doc.data().married_to ? user_doc.data().married_to : [];
	var targer_marriage_list: string[] = target_doc.exists && target_doc.data().married_to ? target_doc.data().married_to : [];

	if (!user_marriage_list.includes(msg.mentions.users.first().id)) {
		msg.channel.send("You're not married to this user.");
		return;
	}

	user_marriage_list.splice(user_marriage_list.indexOf(msg.mentions.users.first().id));
	targer_marriage_list.splice(user_marriage_list.indexOf(msg.author.id));

	target_proposed_list;

	user_doc.ref.set(
		{
			married_to: user_marriage_list,
		},
		{ merge: true }
	);

	target_doc.ref.set(
		{
			married_to: targer_marriage_list,
		},
		{ merge: true }
	);

	msg.mentions.users.first().send(
		new MessageEmbed({
			title: `${msg.author.username} divorced you.`,
			description: `${msg.author.username} has decided to divorce you, :(`,
			thumbnail: {
				url: msg.author.avatarURL(),
			},
			color: user_doc.exists && user_doc.data().color ? user_doc.data().color : randColor(),
		})
	);

	msg.channel.send(`You Divorced ${msg.mentions.users.first().username}`);
}

export default command;
