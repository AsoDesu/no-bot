import { Message, MessageReaction, User, MessageEmbed } from "discord.js";
import BaseCommand from "../BaseCommand";

import cache from "../../modules/LeaderboardCache";
import randColor from "../../randomColor";

import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

import "../../firebaseinnit";
import log from "../../modules/botLog";
import commandManager from "../../commandManager";

var db = firebase.firestore();

type leaderboardUser = {
	scoresaber: string;
	name: string;
	pp: number;
	discord: string;
};

function createEmbedFromLbArray(leaderboard: leaderboardUser[], msg: Message, page: number) {
	var leaderboardArrClone = [...leaderboard];
	var newLb = getItems(leaderboardArrClone, page);

	// Add the array to the embed description
	var leaderboardMsg: string = "";
	newLb.forEach((item) => {
		leaderboardMsg = leaderboardMsg.concat(`#${newLb.indexOf(item) + page * 10 - 10 + 1} - \`${item.name}\` - ${numberWithCommas(item.pp)}pp \n`);
	});

	// Send the message
	return new MessageEmbed({
		title: "NO Clan Leaderboard",
		description: leaderboardMsg,
		color: randColor(),
		footer: {
			text: `Page ${page}/${Math.ceil(leaderboard.length / 10)}`,
		},
	});
}

function getItems(leaderboard: leaderboardUser[], page: number) {
	return leaderboard.splice(page * 10 - 10, 10);
}

async function give1(msg: Message, id: string) {
	var user = await msg.guild.members.fetch(id);
	var oneRole = await msg.guild.roles.cache.find((r) => r.name == "Number 1");

	if (!user.roles.cache.has(process.env.ONEROLE)) {
		oneRole.members.forEach((user) => {
			user.roles.remove(oneRole);
		});
		user.roles.add(oneRole);
	}
}

function numberWithCommas(x: number) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class LeaderboardCommand extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		var update = args[0] == "update" && msg.member.hasPermission("MANAGE_MESSAGES");
		if (!update && args[0] == "update") {
			msg.channel.send("Leaderboard updating is a large job, and has been limited to staff only.");
			return;
		}
		if (update) {
			msg.channel.startTyping();
		}

		var page = 1;
		var leaderboard = !update ? cache.getCache() : await cache.updateCache(msg.client);
		if (!leaderboard) {
			msg.channel.send(`The leaderboard has not been updated yet. Please try again later. Current Status: ${cache.getCacheStatus().status}`);
			return;
		}

		await give1(msg, leaderboard[0].discord).catch(() => {
			log.log(`Error giving #1 role`, msg.client, __filename);
		});

		var sentMsg = await msg.channel.send(createEmbedFromLbArray(leaderboard, msg, page));

		if (update) {
			msg.channel.stopTyping();
		}
		sentMsg.react("⬅️");
		sentMsg.react("➡️");

		// Reaction filter (Only the two emotes and only the user who did the command)
		const filter = (reaction: MessageReaction, user: User) => {
			return reaction.emoji.name === "⬅️" || (reaction.emoji.name === "➡️" && !user.bot);
		};

		// Create collector
		var rpCollector = sentMsg.createReactionCollector(filter, { time: 60000 });

		// Someone reacted
		rpCollector.on("collect", (reaction: MessageReaction, user: User) => {
			// Ignore the bots own reactions
			if (user.bot) return;

			// If the reaction is previous page and they are not on the first page
			if (reaction.emoji.name == "⬅️" && !(page == 1)) {
				page = page - 1;
				sentMsg.edit(createEmbedFromLbArray(leaderboard, msg, page));

				reaction.users.remove(user.id);

				return;
				// If the reaction is next page, and they are not on the last page
			} else if (reaction.emoji.name == "➡️" && !(page == Math.ceil(leaderboard.length / 10))) {
				page = page + 1;
				sentMsg.edit(createEmbedFromLbArray(leaderboard, msg, page));

				reaction.users.remove(user.id);

				return;
			}
		});
	}
	label = "leaderboard";
	aliases = ["lb"];
	whitelistedServers = ["777110342291554306"];

	description = "View the clan leaderboard, updated every hour.";
	usage = ">leaderboard";
}

commandManager.registerCommand(new LeaderboardCommand());
