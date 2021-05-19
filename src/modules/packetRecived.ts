import "dotenv/config";
import Discord, { Client, GuildMember } from "discord.js";
import log from "./botLog";

import firebase from "firebase";
import "firebase/firestore";
import "../firebaseinnit";
var db = firebase.firestore();

async function packetRecived(d: any, client: Client) {
	if (d.t == "MESSAGE_REACTION_ADD") {
		reactAdd(d, client);
		return;
	}
	if (d.t == "MESSAGE_REACTION_REMOVE") {
		reactRemove(d, client);
		return;
	}
}

async function reactAdd(d: any, client: Client) {
	var packet = (d as reatpacket).d;

	if (packet.user_id == client.user.id) return;

	var guild = client.guilds.cache.get(packet.guild_id);

	var user: GuildMember = await guild.members.fetch(packet.user_id).catch(() => (user = null));
	if (!user) return;

	var rrData = await db.collection("reactions").doc(packet.guild_id).collection("reactions").doc(packet.message_id).get();
	if (!rrData.exists) return;
	var reaction = (rrData.data().emotes as reactionArray[]).find((e) => e.emote == (packet.emoji.id ? packet.emoji.id : packet.emoji.name));

	if (user.roles.cache.get(reaction.role)) return;
	user.roles.add(reaction.role).catch(() => {
		log.log(`Failed to give user ${user.user.username}, a role.`, client, __filename);
	});
	user.send(`Gave you the **${guild.roles.cache.get(reaction.role).name}** role.`);
	log.log(`Gave ${user.user.username} a role.`, client, __filename);
}

async function reactRemove(d: any, client: Client) {
	var packet = (d as reatpacket).d;

	if (packet.user_id == client.user.id) return;
	var guild = client.guilds.cache.get(packet.guild_id);

	var user: GuildMember = await guild.members.fetch(packet.user_id).catch(() => (user = null));
	if (!user) return;

	var rrData = await db.collection("reactions").doc(packet.guild_id).collection("reactions").doc(packet.message_id).get();
	if (!rrData.exists) return;
	var reaction = (rrData.data().emotes as reactionArray[]).find((e) => e.emote == (packet.emoji.id ? packet.emoji.id : packet.emoji.name));

	if (!user.roles.cache.get(reaction.role)) return;
	user.roles.remove(reaction.role).catch(() => {
		log.log(`Failed to give user ${user.user.username}, a role.`, client, __filename);
	});
	user.send(`Removed the **${guild.roles.cache.get(reaction.role).name}** role.`);
	log.log(`Removed role from ${user.user.username}.`, client, __filename);
}

type reactionArray = {
	emote: string;
	role: string;
};

type reatpacket = {
	t: string;
	s: number;
	op: number;
	d: {
		user_id: string;
		message_id: "809096035049668628";
		member: {
			user: {
				username: string;
				public_flags: 128;
				id: string;
				discriminator: string;
				avatar: string;
			};
			roles: string[];
			premium_since: null | any;
			pending: boolean;
			nick: null | string;
			mute: boolean;
			joined_at: string;
			is_pending: boolean;
			hoisted_role: string;
			deaf: boolean;
		};
		emoji: {
			name: string;
			id: null | string;
		};
		channel_id: string;
		guild_id: string;
	};
};

export default packetRecived;
