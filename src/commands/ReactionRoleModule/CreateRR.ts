import { GuildEmoji, Message, TextChannel } from "discord.js";
import BaseCommand from "../BaseCommand";

import firebase from "firebase";
import "firebase/firestore";
import "../../firebaseinnit";
import commandManager from "../../commandManager";
var db = firebase.firestore();

class CreateReactionRole extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.hasPermission("MANAGE_GUILD")) {
			msg.channel.send("You don't have permission to do that");
			return;
		}

		if (args.length < 4) {
			msg.channel.send("Usage: >createrr (msgid) (channelping) (emote) (roleid)");
			return;
		}

		var channel: TextChannel;
		if (msg.mentions.channels.size == 0) {
			msg.channel.send("Couldn't find that channel.");
		} else {
			channel = msg.mentions.channels.first();
		}
		/*if (!channel || channel.type != 'text') { msg.channel.send('Couldn\'t find the specified text channel'); return }
        var selectedChannel = channel as TextChannel*/

		var message = (await channel.messages.fetch({ limit: 10 })).get(args[0]);
		if (!message) {
			msg.channel.send("Couldn't find the specified message. Try and re-send the message.");
			return;
		}

		var emote: string;
		if (args[2].includes("<")) {
			var clientEmote = msg.client.emojis.cache.get(args[2].split(":")[2].replace(">", ""));
			if (!clientEmote) {
				msg.channel.send("I don't have access to that emote.");
				return;
			}
			emote = clientEmote.id;
		} else {
			emote = args[2];
		}

		var role: string;
		if (msg.mentions.roles.size != 0) {
			role = msg.mentions.roles.first().id;
		} else {
			msg.channel.send("You must ping the role you want to link.");
			return;
		}

		message.react(emote).catch(() => {
			msg.channel.send("Error: Couldn't react to that message.");
			return;
		});

		var reactArray: reactionArray = [];
		var data = await db.collection("reactions").doc(msg.guild.id).collection("reactions").doc(message.id).get();
		if (data.exists && data.data().emotes) {
			reactArray = data.data().emotes;
		}

		if (reactArray.find((e) => e.emote == emote)) {
			msg.channel.send("That emote is allready on that message.");
			return;
		}

		reactArray.push({ emote: emote, role: role });

		db.collection("reactions").doc(msg.guild.id).collection("reactions").doc(message.id).set(
			{
				emotes: reactArray,
				channel: channel.id,
			},
			{ merge: true }
		);
		msg.channel.send("Added a reaction role to that message.");
	}
	label = "createrr";
	hidden = true;
}

commandManager.registerCommand(new CreateReactionRole());

function containsOnlyEmojis(text: string) {
	const onlyEmojis = text.replace(new RegExp("[\u0000-\u1eeff]", "g"), "");
	const visibleChars = text.replace(new RegExp("[\n\rs]+|( )+", "g"), "");
	return onlyEmojis.length === visibleChars.length;
}

type reactionArray = [
	{
		emote: string;
		role: string;
	}?
];
