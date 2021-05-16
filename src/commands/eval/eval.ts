import { Message } from "discord.js";

import firebase from "firebase";
import "firebase/firestore";
import "../../firebaseinnit";
var db = firebase.firestore();

async function command(msg: Message, args: string[]) {
	if (!msg.member.hasPermission("ADMINISTRATOR")) return;
	try {
		var result = await eval(msg.content.replace(`${process.env.PREFIX}eval `, "").replace(/`/g, ""));
	} catch (err) {
		msg.channel.send("Unknown Error");
	}
	msg.channel.send(result).catch(() => {});
}

export default command;
