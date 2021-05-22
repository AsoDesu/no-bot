import "dotenv/config";
import Discord from "discord.js";
const client = new Discord.Client();

import fs from "fs";
import path from "path";

// Moduels
import BOT from "./modules/@bot";
import thoughts from "./modules/purgatory";
import never from "./modules/never";
import userLeave from "./modules/userLeave";
import userJoin from "./modules/userJoin";
import packetRecived from "./modules/packetRecived";
import botLog from "./modules/botLog";
import autoupdate from "./modules/updateLeaderboardCache";
import lbCache from "./modules/LeaderboardCache";
import redirect from "./modules/url-shortener/redirect";
import ecoCache from "./modules/EconomyCache";

import BeatKhanaWebsocket from "./modules/BeatKhanaWebscoket";

// Init Commands
function GetCommandsInDir(dir: string) {
	fs.readdirSync(dir, { withFileTypes: true, encoding: "utf-8" }).forEach((file) => {
		if (file.isDirectory()) {
			GetCommandsInDir(dir + "/" + file.name);
			return;
		}
		require(`${dir}/${file.name}`);
	});
}

GetCommandsInDir(__dirname + "/commands/");

client.on("message", async (msg: Discord.Message) => {
	if (msg.author.bot) return;

	if (msg.content.startsWith("*") && !msg.guild && msg.author.id == "580425653325791272") {
		thoughts(client, msg.content.replace("*", ""));
		return;
	}

	const args = msg.content.toLowerCase().slice(process.env.PREFIX.length).split(/ +/);
	const command = args.shift().toLowerCase();
	ecoCache.addxp(msg.author.id, Math.random());

	if (!msg.content.startsWith(process.env.PREFIX)) {
		checkForMemes(msg);
		return;
	}

	commandManager.executeCommand(msg, args, command);
});

function checkForMemes(msg: Discord.Message) {
	// memes
	if (msg.content.includes("777284907302912000")) {
		BOT(msg);
		return;
	}
	if (msg.content.includes("never")) {
		never(msg);
		return;
	}
}

function getClient() {
	return client;
}

client.on("ready", () => {
	console.log("Connected to Discord");
	console.log(`Initalized ${commandManager.commands.length} commands.`);
	botLog.ready();
	botLog.log("Connected to discord", client, __filename);
	client.user.setActivity("Version 1.8.1");

	lbCache.updateCache(client);

	if (autoupdate.task) {
		autoupdate.stopCron();
	}
	autoupdate.startCron();

	BeatKhanaWebsocket.StartWebsocket();
});

client.on("guildMemberAdd", userJoin);

client.on("guildMemberRemove", userLeave);

client.on("raw", (d) => {
	packetRecived(d, client);
});

client.login(process.env.TOKEN);

// Express stuff

import Express from "express";
import commandManager from "./commandManager";
import { fstat } from "fs";
const app = Express();

app.use(Express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send("Aso was ere!");
});

app.get("/:shorturl", (req, res) => {
	redirect(req, res);
});

app.listen(process.env.PORT);

export default {
	getClient,
};
