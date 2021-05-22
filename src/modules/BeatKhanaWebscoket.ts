import { Client, User, MessageEmbed, TextChannel } from "discord.js";
import index from "../index";

import botLog from "./botLog";

import WebSocket from "ws";

import firebase from "firebase";
import "firebase/firestore";
import got from "got";
var db = firebase.firestore();

type BeatKhanaSignupEvent = {
	tournamentId: number;
	comment: string;
	userId: string;
};

type BeatKhanaUser = {
	discordId: string;
	ssId: string;
	name: string;
	twitchName: string;
	avatar: string;
	globalRank: number;
	localRank: number;
	country: string;
	tourneyRank: number;
	TR: number;
	pronoun: string;
	tournaments: string[];
	badges: string[];
};

class BeatKhanaWebsocket {
	public connection: WebSocket;
	public tournamentGuildID: string;
	public TournamentID: number;
	public SignupsChannel: string;

	public SetTournamentID(id: number) {
		db.collection("guilds").doc(this.tournamentGuildID).set({ tournamentId: id }, { merge: true });
		if (this.connection) {
			this.connection.send(`{"setTournament":${id}}`);
		}
		this.TournamentID = id;
	}

	public SetSignupsChannel(id: string) {
		var client: Client = index.getClient();
		if (!client.channels.cache.has(id)) return false;

		db.collection("guilds").doc(this.tournamentGuildID).set({ signupsChannel: id }, { merge: true });
		this.SignupsChannel = id;

		if (this.connection) {
			RestartWebscoket();
		}
	}

	public SetTournamentServer(id: string) {
		var client: Client = index.getClient();
		if (!client.guilds.cache.has(id)) {
			return false;
		}
		this.tournamentGuildID = id;
	}

	public StartWebsocket() {
		this.connection = new WebSocket("wss://beatkhana.com/api/ws");
		this.connection.addEventListener("error", () => {
			console.log("Failed to connect to BeatKhana.");
		});

		this.connection.once("open", () => {
			this.connection.send(`{"setTournament":${this.TournamentID}}`);
			console.log("Connected to BeatKhana. Tournament ID: " + this.TournamentID);
		});

		this.connection.addEventListener("message", async (e) => {
			var msg = await JSON.parse(e.data);
			if (msg.newParticipant) {
				if (!this.tournamentGuildID) return;
				var data = msg.newParticipant as BeatKhanaSignupEvent;

				var client = index.getClient();
				var guild = client.guilds.cache.get(this.tournamentGuildID);
				guild.members
					.fetch(data.userId)
					.then((user) => {
						user.roles.add(guild.roles.cache.find((role) => role.name == "Participant"));
						botLog.log(`${user.user.username} signed up and was given a role.`, client, __filename);
						if (this.SignupsChannel) this.SendSignupEmbed(user.user, data);
					})
					.catch((e) => {
						botLog.log(`User with id ${data.userId}, signed up but failed to be given a role.`, client, __filename);
					});
			}
		});
	}

	public async SendSignupEmbed(user: User, data: BeatKhanaSignupEvent) {
		var client: Client = index.getClient();

		var BKUser = (await JSON.parse((await got(`https://beatkhana.com/api/user/${data.userId}`)).body)) as BeatKhanaUser;

		(client.channels.cache.get(this.SignupsChannel) as TextChannel).send(
			new MessageEmbed({
				title: `${user.username} Signed up`,
				description: `[ScoreSaber](https://scoresaber.com/u/${BKUser.ssId}) | [Twitch](https://twitch.tv/${BKUser.twitchName})\n**Global Rank**: #${BKUser.globalRank}\n**Regional Rank**: #${BKUser.localRank} :flag_${BKUser.country.toLowerCase()}:\n**Comment**: ${data.comment}`,
				thumbnail: {
					url: user.avatarURL({ dynamic: true }),
				},
			})
		);
	}
}

var BKWS = new BeatKhanaWebsocket();

async function StartWebsocket() {
	var docs = await db.collection("guilds").where("tournamentServer", "==", true).get();
	if (docs.empty) return;

	var doc = docs.docs[0];
	BKWS.SetTournamentServer(doc.id);
	if (doc.data().tournamentId) {
		BKWS.SetTournamentID(doc.data().tournamentId);
		if (doc.data().signupsChannel) {
			BKWS.SetSignupsChannel(doc.data().signupsChannel);
		}
		BKWS.StartWebsocket();
	}
}

async function RestartWebscoket() {
	if (BKWS.connection) {
		BKWS.connection.close();
	}
	StartWebsocket();
}

export default {
	StartWebsocket,
	RestartWebscoket,
	BeatKhanaWebsocket,
	BKWS,
};
