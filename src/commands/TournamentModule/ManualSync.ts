import commandManager from "../../commandManager";
import BaseCommand from "../BaseCommand";

import BeatKhanaWebscoket from "../../modules/BeatKhanaWebscoket";
import got from "got";

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

import { Message, MessageEmbed } from "discord.js";

class ManualSync extends BaseCommand {
	async execute(msg: Message, args: string[]) {
		if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
			msg.channel.send("You don't have permission to do this.");
			return;
		}

		var data = (await JSON.parse((await got(`https://beatkhana.com/api/tournament/${BeatKhanaWebscoket.BKWS.TournamentID}/participants`)).body)) as BeatKhanaUser[];

		var guild = msg.guild;
		var role = guild.roles.cache.find((role) => role.name == "Participant");

		var synced = 0;
		data.forEach(async (u) => {
			var member = msg.guild.members.cache.get(u.discordId);

			if (!member) return;
			if (member.roles.cache.has(role.id)) return;

			member.roles.add(role);
			BeatKhanaWebscoket.BKWS.SendSignupEmbed(member.user, { comment: "", tournamentId: BeatKhanaWebscoket.BKWS.TournamentID, userId: u.discordId });
			synced++;
			return;
		});

		msg.channel.send(
			new MessageEmbed({
				title: "Synced users!",
				description: `Successfully synced, ${synced} user${synced == 1 ? "" : "s"}.`,
			})
		);
	}
	label = "sync";
	hidden = true;
	whitelistedServers = ["809084684716867645"];
}

commandManager.registerCommand(new ManualSync());
