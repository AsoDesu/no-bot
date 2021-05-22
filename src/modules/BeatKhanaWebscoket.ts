import { Client } from "discord.js";
import index from "../index";

import botLog from "./botLog";

import WebSocket from "ws";

import firebase from "firebase";
import "firebase/firestore";
var db = firebase.firestore();

type BeatKhanaSignupEvent = {
	tournamentId: number;
	comment: string;
	userId: string;
};

class BeatKhanaWebsocket {
	public connection: WebSocket;
	public tournamentGuildID: string;
	public TournamentID: number;

	public SetTournamentID(id: number) {
		db.collection("guilds").doc(this.tournamentGuildID).set({ tournamentId: id }, { merge: true });
		if (this.connection) {
			this.connection.send(`{"setTournament":${id}}`);
		}
		this.TournamentID = id;
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
			console.log("Connected to BeatKhana.");
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
					})
					.catch((e) => {
						botLog.log(`User with id ${data.userId}, signed up but failed to be given a role.`, client, __filename);
					});
			}
		});
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
		BKWS.StartWebsocket();
	}
}

async function RestartWebscoket() {
	if (BKWS.connection) {
		BKWS.connection.close();
	}
	var docs = await db.collection("guilds").where("tournamentServer", "==", true).get();
	if (docs.empty) return;

	var doc = docs.docs[0];
	BKWS.SetTournamentServer(doc.id);
	if (doc.data().tournamentId) {
		BKWS.SetTournamentID(doc.data().tournamentId);
		BKWS.StartWebsocket();
	}
}

export default {
	StartWebsocket,
	RestartWebscoket,
	BeatKhanaWebsocket,
	BKWS,
};
