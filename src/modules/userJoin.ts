import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import log from "./botLog";

import firebase from "firebase";
import "firebase/firestore";

var db = firebase.firestore();

async function userJoin(member: GuildMember | PartialGuildMember) {
	if (!(member instanceof GuildMember)) return;

	var guilddb = await db.collection("guilds").doc(member.guild.id).get();
	if (!guilddb.exists && !guilddb.exists && guilddb.data().join_msg) {
		member.send(
			new MessageEmbed({
				title: "Welcome!",
				description: `Hey there!, You've made it to ${member.guild.name}!`,
				footer: {
					text: "Created by Aso#0001 <3",
					iconURL: `https://scoresaber.com/imports/images/usr-avatars/76561198272266872.jpg`,
				},
			})
		);
	}

	var joinmsg = guilddb.data().join_msg;

	member.send(
		new MessageEmbed({
			title: joinmsg.title,
			description: joinmsg.msg.replace("\\n", "\n"),
			footer: {
				text: "Created by Aso#0001 <3",
				iconURL: `https://scoresaber.com/imports/images/usr-avatars/76561198272266872.jpg`,
			},
		})
	);

	log.log(`${member.user.username} joined.`, member.client, __filename);
}

export default userJoin;
