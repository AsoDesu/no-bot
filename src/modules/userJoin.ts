import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import log from "./botLog";

import firebase from "firebase";
import "firebase/firestore";
import BeatKhanaWebscoket from "./BeatKhanaWebscoket";
import got from "got";

var db = firebase.firestore();

type BeatKhanaUser = {
	TR: number;
	avatar: string;
	comment: string;
	country: string;
	discordId: string;
	forfeit: number;
	globalRank: number;
	localRank: number;
	name: string;
	participantId: number;
	position: number;
	pronoun: string;
	seed: number;
	ssId: string;
	tourneyRank: number;
	twitchName: string;
	userId: string;
};

async function userJoin(member: GuildMember | PartialGuildMember) {
	if (!(member instanceof GuildMember)) return;
	var guild = member.guild;

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
			description: joinmsg.msg.replace("\n", "\n"),
			footer: {
				text: "Created by Aso#0001 <3",
				iconURL: `https://scoresaber.com/imports/images/usr-avatars/76561198272266872.jpg`,
			},
		})
	);

	if (BeatKhanaWebscoket.BKWS.TournamentID && BeatKhanaWebscoket.BKWS.tournamentGuildID && guild.id == BeatKhanaWebscoket.BKWS.tournamentGuildID) {
		var data = (await JSON.parse((await got(`https://beatkhana.com/api/tournament/${BeatKhanaWebscoket.BKWS.TournamentID}/participants`)).body)) as BeatKhanaUser[];
		var participant = data.find((u) => u.discordId == member.id);

		if (participant) {
			member.roles.add(guild.roles.cache.find((role) => role.name == "Participant"));
			log.log(`${member.user.username} signed up and was given a role.`, member.client, __filename);
			if (BeatKhanaWebscoket.BKWS.SignupsChannel) BeatKhanaWebscoket.BKWS.SendSignupEmbed(member.user, { comment: "", tournamentId: BeatKhanaWebscoket.BKWS.TournamentID, userId: participant.userId });
		}
	}

	log.log(`${member.user.username} joined.`, member.client, __filename);
}

export default userJoin;
