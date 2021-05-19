import { Message, MessageEmbed, MessageEmbedOptions } from "discord.js";
import format from "./_numberFormatter";
import randomcolor from "../../randomColor";

import firebase from "firebase";
import "firebase/firestore";
import "../../firebaseinnit";
var db = firebase.firestore();

import log from "../../modules/botLog";
import BaseCommand from "../BaseCommand";
import commandManager from "../../commandManager";

class GambleCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var userfData = await db.collection("users").doc(msg.author.id).get();
		var bal = userfData.data().bal ? userfData.data().bal : 0;

		var gambleData = await db.collection("economy").doc("gamble").get();
		if ((gambleData.exists && !gambleData.data().open) || !gambleData.exists) {
			msg.channel.send("The Casino is currently closed for maintainance, please try again later");
			return;
		}
		var jackpotAmount = gambleData.exists && gambleData.data().jackpotAmount ? gambleData.data().jackpotAmount : 0;

		var balWagered = parseInt(args[0]);
		if (args[0] == "info" || isNaN(balWagered)) {
			infoEmbed(msg, args, userfData, gambleData);
			return;
		}

		if (bal < balWagered || !(balWagered > 0)) {
			msg.channel.send("You can't wager that much");
			return;
		}

		bal -= balWagered;

		var balGive = Math.floor(Math.random() * 3);
		switch (balGive) {
			case 0:
			case 1:
				msg.channel.send(
					new MessageEmbed({
						title: "You Lost",
						description: `-${balWagered} Points \n\nYour balance is now ${bal}`,
						color: 15206665,
					})
				);
				jackpotAmount += balWagered;
				break;
			case 2:
				stage2();
				break;
			default:
				msg.channel.send("You find yourslef in an odd place, the gambling machine has come up inconclusive.... Aso's code broke, this message alone contains at least 50 spelling mistakes, so if you see this, ping Aso and tell him he sucks at spelling");
		}

		async function stage2() {
			var balGive2 = Math.floor(Math.random() * 100);

			if (balGive2 > 50) {
				bal += balWagered * 3;
				msg.channel.send(
					new MessageEmbed({
						title: "You Won",
						description: `+${balWagered * 2} Points \n\nYour balance is now ${bal}`,
						color: 1107977,
					})
				);
			} else if (balGive2 > 1 && balGive2 < 50) {
				bal += balWagered * 2;
				msg.channel.send(
					new MessageEmbed({
						title: "You Won",
						description: `+${balWagered} Points \n\nYour balance is now ${bal}`,
						color: 1107977,
					})
				);
			} else if (balGive2 == 1) {
				var jackpotGiven = getJackpotToGive(jackpotAmount, balWagered);
				bal += jackpotGiven;
				msg.channel.send(
					new MessageEmbed({
						title: "JACKPOT!!",
						description: `+${jackpotGiven} Points \n\nYour balance is now ${bal}`,
						color: 1107977,
					})
				);
				jackpotAmount -= jackpotGiven;
				log.log(`${msg.author.username} won the jackpot. [Message](${msg.url})`, msg.client, __filename);
			} else {
				bal += balWagered * 2;
				msg.channel.send(
					new MessageEmbed({
						title: "You Won",
						description: `+${balWagered} Points \n\nYour balance is now ${bal}`,
						color: 1107977,
					})
				);
			}
		}

		db.collection("users").doc(msg.author.id).set(
			{
				bal: bal,
			},
			{ merge: true }
		);

		db.collection("economy").doc("gamble").set(
			{
				jackpotAmount: jackpotAmount,
			},
			{ merge: true }
		);

		log.log(`${msg.author.username} used the casino, there balance is now ${bal}`, msg.client, __filename);
	}
	label = "gamble";

	description = "Gamble your balance.";
	usage = ">gamble [(bal) | info]";
}

commandManager.registerCommand(new GambleCommand());

function getJackpotToGive(jackpot: number, wagered: number) {
	var amount = jackpot > wagered ? Math.floor(wagered * (jackpot % wagered) + wagered) : Math.floor(jackpot);
	if (amount > jackpot) amount = jackpot;
	return amount;
}

async function infoEmbed(msg: Message, args: string[], userfData: firebase.firestore.DocumentSnapshot, gambleData: firebase.firestore.DocumentSnapshot) {
	var bal = userfData.data().bal ? userfData.data().bal : 0;
	var jackpotAmount = gambleData.exists && gambleData.data().jackpotAmount ? gambleData.data().jackpotAmount : 0;
	var gambleInfoEmbed: MessageEmbedOptions = {
		title: "Dumb Bot Casino",
		description: `Current Jackpot Amount: **${format.numberWithCommas(jackpotAmount)}**xp\nYour Balance: **${format.numberWithCommas(bal)}**xp`,
		color: randomcolor(),
	};
	// I'm addicted to ternary operators
	msg.channel.send(args[0] == "info" ? "" : "You need to provide an amount to wager `>gamble (amount)`", new MessageEmbed(gambleInfoEmbed));
}
