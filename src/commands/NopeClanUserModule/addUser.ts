import { Message } from "discord.js";
import BaseCommand from "../BaseCommand";

import scoresaber from "../../scoresaberApiGrabber";

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

import "../../firebaseinnit";
import commandManager from "../../commandManager";

var auth = firebase.auth();
var database = firebase.firestore();
var storage = firebase.storage();

function addUser(msg: Message, scoresaber: string) {
	var userRef = database.collection("users").doc(msg.member.id);
	database
		.collection("users")
		.where("scoresaberId", "==", scoresaber)
		.get()
		.then((docs) => {
			if (docs.empty) {
				addUserToFirestore();
				return;
			}
			msg.reply("That scoresaber user is allready registered");
		});

	function addUserToFirestore() {
		userRef.get().then((doc) => {
			if (!doc.exists || !doc.data().scoresaberId) {
				userRef.set(
					{
						scoresaberId: scoresaber,
					},
					{ merge: true }
				);
				addRole(msg);
				return;
			}

			msg.reply("You're allready registered, contact a staff member if you don't have the Member role");
		});
	}
}

async function addRole(msg: Message) {
	var role = msg.guild.roles.cache.find((r) => r.name == "Member");

	if (!role) {
		msg.reply("Error getting the member role.");
		return;
	}

	if (!msg.member.roles.cache.has(process.env.ROLE)) {
		msg.member.roles.add(role);
	}

	msg.channel.send("Gave you the member role, welcome to the NOPE clan!");
}

class AddUser extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!args[0]) {
			msg.reply("Usage: `>add {scoresaber link here}`");
			return;
		}
		var parsedUrl = parseScoreSaberLink(args[0]);
		if (!parsedUrl) {
			msg.reply("Player Not Found");
			return;
		}

		var player = await scoresaber(parsedUrl);
		if (!player) {
			msg.reply("That user does not exist");
			return;
		}

		addUser(msg, parsedUrl);

		function parseScoreSaberLink(url: string) {
			if (url.includes("scoresaber.com/u")) {
				var playerUid = url.split("u/");
				return playerUid[playerUid.length - 1];
			} else {
				return false;
			}
		}
	}

	label = "add";
	whitelistedServers = ["777110342291554306"];

	description = "Add yourself to the clan!";
	usage = ">add (scoresaber link)";
}

commandManager.registerCommand(new AddUser());
