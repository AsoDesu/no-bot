import { Message, MessageEmbed } from "discord.js";

import firebase from "firebase";
import "firebase/firestore";

var db = firebase.firestore();
import "../../../firebaseinnit";

import randColour from "../../../randomColor";
import BaseCommand from "../../BaseCommand";
import commandManager from "../../../commandManager";

class ProposeCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (msg.mentions.users.size == 0) {
			msg.channel.send("You need to metion the users you want to propose to.");
			return;
		}

		var user_doc = await db.collection("users").doc(msg.author.id).get();
		var proposed_to: string[] = user_doc.exists && user_doc.data().proposed_to ? user_doc.data().proposed_to : [];
		var married_to: string[] = user_doc.exists && user_doc.data().married_to ? user_doc.data().married_to : [];

		msg.mentions.users.forEach((user) => {
			if (proposed_to.includes(user.id)) {
				msg.channel.send(`You already proposed to ${user.username}, skipping.`);
				return;
			}
			if (married_to.includes(user.id)) {
				msg.channel.send("You've already married this user.");
			}
			if (user.id == msg.author.id) {
				msg.channel.send(`You can't marry yourself.`);
				return;
			}

			proposed_to.push(user.id);

			user.send(
				new MessageEmbed({
					title: `New Proposal from ${msg.author.username}`,
					description: `${msg.author.username} has proposed to you, type >accept <@${msg.author.id}> to accept, or >deny <@${msg.author.id}> to deny`,
					thumbnail: {
						url: msg.author.avatarURL(),
					},
					color: user_doc.exists && user_doc.data().color ? user_doc.data().color : randColour(),
				})
			);
		});

		db.collection("users").doc(msg.author.id).set(
			{
				proposed_to,
			},
			{ merge: true }
		);

		msg.channel.send(`You proposed to ${msg.mentions.users.first().username}`);
	}
	label = "marry";
	description = "Propose to any user.";
	usage = ">marry (@User) (@User)...";
}

commandManager.registerCommand(new ProposeCommand());
