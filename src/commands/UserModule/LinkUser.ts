import { Message } from "discord.js";
import BaseCommand from "../BaseCommand";

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
var db = firebase.firestore();

import "../../firebaseinnit";
import commandManager from "../../commandManager";
import scoresaber from "../../scoresaberApiGrabber";

class LinkCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var formattedContent: string;
		switch (args[0]) {
			case "scoresaber":
				var scoresaber = await verifyScoresaber(args[1]);
				if (!scoresaber) {
					msg.channel.send("Invalid scoresaber url.");
					return;
				}
				formattedContent = scoresaber;
				break;
			case "twitch":
				if (!args[1].includes("twitch.tv/")) {
					msg.channel.send("Invalid link, make sure to send the full link.");
					return;
				}
				formattedContent = doPogTwitchFormatting(args[1]);
				break;
			case "birthday":
				var parsedDate = doEvenPoggerDateValidationYesBigWords(args[1]);
				if (parsedDate != 1) {
					msg.channel.send("That is not a valid date, make sure to format your date DD/MM");
					return;
				}
				formattedContent = args[1];
				break;
			case "color":
				if (!veryPogColourValidation(args[1])) {
					msg.channel.send("That is not a valid colour");
					return;
				}
				formattedContent = args[1];
				break;
			case "status":
				var parsedText = parseStatusText(msg.content);
				if (!parsedText) {
					msg.channel.send("Must provide a status text, and it must be under 100 characters");
					return;
				}
				formattedContent = parsedText;
				break;
			default:
				msg.channel.send("You can't link that. Usage: >link (scoresaber | twitch | birthday | color | status) (content)");
				return;
		}
		msg.channel.send(await addInfoToDB(msg.member.id, args[0], formattedContent));
	}
	label = "link";
	description = "Link things to you user, You can link your: Scoresaber, Twitch, Birthday, A custom color for your user, and a status.";
	usage = ">link (scoresaber | twitch | birthday | color | status) (content)";
	aliases = ["l"];
}

commandManager.registerCommand(new LinkCommand());

async function addInfoToDB(uid: string, item: string, content: string) {
	var userRef = db.collection("users").doc(uid);

	var addInfo: any = {};

	switch (item) {
		case "scoresaber":
			addInfo.scoresaberId = content;
			break;
		case "twitch":
			addInfo.twitch = content;
			break;
		case "birthday":
			addInfo.birthday = content;
			break;
		case "color":
			addInfo.color = content;
			break;
		case "status":
			addInfo.status = content;
			break;
	}

	await userRef.set(addInfo, { merge: true });
	return `Linked ${item}`;
}

async function verifyScoresaber(url: string) {
	if (url.includes("scoresaber.com/u")) {
		var playerUidArr = url.split("u/");
		var parsedUrl = playerUidArr[playerUidArr.length - 1];
		if (!parsedUrl) {
			return false;
		}
		var player = await scoresaber(parsedUrl);
		if (!player) {
			return false;
		}
		return parsedUrl;
	} else {
		return false;
	}
}

function doPogTwitchFormatting(thing: string) {
	var split = thing.split("/");
	return split[split.length - 1];
}

function doEvenPoggerDateValidationYesBigWords(date: string) {
	// DD/MM
	if (!date) {
		return NaN;
	}
	var parts: string[] = date.split("/");
	if (parts.length < 2) {
		return NaN;
	}
	if (parseInt(parts[0]) > 31) {
		return NaN;
	}
	if (parseInt(parts[1]) > 12) {
		return NaN;
	}
	return 1;
}

function veryPogColourValidation(colour: string) {
	var re = /[0-9A-Fa-f]{6}/g;
	if (re.test(colour)) {
		return true;
	} else {
		return false;
	}
}

function parseStatusText(content: string) {
	var splitText = content.split("status");
	if (splitText.length != 2) {
		return false;
	}
	if (splitText[1].trimStart().length > 100) {
		return false;
	}
	return splitText[1].trimStart();
}
