import { Message } from "discord.js";

import firebase from "firebase";
import "firebase/firestore";
import "../../firebaseinnit";
var db = firebase.firestore();

import log from "../../modules/botLog";

import commandManager from "../../commandManager";
import BaseCommand from "../BaseCommand";

class ManageXP extends BaseCommand {
	execute(msg: Message, args: string[]) {
		if (!msg.member.hasPermission("MANAGE_GUILD")) {
			msg.channel.send("You can't do this");
			return;
		}

		if (args.length < 1) {
			msg.channel.send("Usage: >managexp (arg) (args..)");
			return;
		}

		switch (args[0]) {
			case "give":
				givexp(msg, args);
				break;
			case "remove":
				removexp(msg, args);
				break;
			case "set":
				setxp(msg, args);
				break;
			case "fullreseteco":
				resetxp(msg, args);
				break;
			case "togglegamble":
				togglegamble(msg, args);
				break;
		}
	}
	label = "managexp";
	hidden = true;
}

async function givexp(msg: Message, args: string[]) {
	if (!msg.member.hasPermission("MANAGE_GUILD")) {
		msg.channel.send("You can't do this");
		return;
	}
	if (msg.mentions.members.size == 0 || args.length < 3 || isNaN(parseInt(args[2]))) {
		msg.channel.send("Usage: `>managexp (give) (@user) (give)`");
		return;
	}
	var userData = await db.collection("users").doc(msg.mentions.members.first().id).get();
	var bal = userData.exists && userData.data().bal ? userData.data().bal : 0;

	bal += parseInt(args[2]);
	db.collection("users").doc(msg.mentions.members.first().id).set(
		{
			bal: bal,
		},
		{ merge: true }
	);
	msg.channel.send(`Gave **${args[2]}**xp to **${msg.mentions.users.first().username}**, their balance is now **${bal}**xp`);
	log.log(`${msg.author.username} gave ${msg.mentions.users.first()} ${args[2]}xp`, msg.client, __filename);
}

async function removexp(msg: Message, args: string[]) {
	if (!msg.member.hasPermission("MANAGE_GUILD")) {
		msg.channel.send("You can't do this");
		return;
	}
	if (msg.mentions.members.size == 0 || args.length < 3 || isNaN(parseInt(args[2]))) {
		msg.channel.send("Usage: `>managexp remove (@user) (amount)`");
		return;
	}
	var userData = await db.collection("users").doc(msg.mentions.members.first().id).get();
	var bal = userData.exists && userData.data().bal ? userData.data().bal : 0;

	bal -= parseInt(args[2]);
	db.collection("users").doc(msg.mentions.members.first().id).set(
		{
			bal: bal,
		},
		{ merge: true }
	);
	msg.channel.send(`Removed **${args[2]}**xp from **${msg.mentions.users.first().username}**, their balance is now **${bal}**xp`);
	log.log(`${msg.author.username} removed ${args[2]}xp from ${msg.mentions.users.first()}`, msg.client, __filename);
}

async function setxp(msg: Message, args: string[]) {
	if (!msg.member.hasPermission("MANAGE_GUILD")) {
		msg.channel.send("You can't do this");
		return;
	}
	if (msg.mentions.members.size == 0 || args.length < 3 || isNaN(parseInt(args[2]))) {
		msg.channel.send("Usage: `>managexp set (user) (amount)`");
		return;
	}
	var userData = await db.collection("users").doc(msg.mentions.members.first().id).get();
	var bal = userData.exists && userData.data().bal ? userData.data().bal : 0;

	bal = parseInt(args[2]);
	db.collection("users").doc(msg.mentions.members.first().id).set(
		{
			bal: bal,
		},
		{ merge: true }
	);
	msg.channel.send(`Set **${msg.mentions.users.first().username}**\'s xp to **${args[2]}**xp, their balance is now **${bal}**xp`);
	log.log(`${msg.author.username} set from ${msg.mentions.users.first()}'s xp to ${args[2]}`, msg.client, __filename);
}

async function resetxp(msg: Message, args: string[]) {
	if (!(msg.author.id == msg.guild.ownerID)) {
		msg.channel.send("You can't do this");
		return;
	}

	var data = (await db.collection("users").where("bal", "!=", null).get()).docs;
	var delValue = firebase.firestore.FieldValue.delete();
	for (const doc of data) {
		doc.ref.set(
			{
				bal: delValue,
				level: delValue,
				balLastRun: delValue,
			},
			{ merge: true }
		);
	}
	msg.channel.send("Reset Economy");
	log.log(`${msg.author.username} reset the economy`, msg.client, __filename);
}

async function togglegamble(msg: Message, args: string[]) {
	if (!msg.member.hasPermission("MANAGE_GUILD")) {
		msg.channel.send("You can't do this");
		return;
	}
	var data = await db.collection("economy").doc("gamble").get();
	var currentState = data.exists && data.data().open ? data.data().open : false;

	currentState = !currentState;

	db.collection("economy").doc("gamble").set(
		{
			open: currentState,
		},
		{ merge: true }
	);
	msg.channel.send(`${currentState ? "Opened" : "Closed"} The Casino`);
	log.log(`${msg.author.username} ${currentState ? "Opened" : "Closed"} the casino.`, msg.client, __filename);
}

commandManager.registerCommand(new ManageXP());
