import { Message } from "discord.js";

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

import "../../firebaseinnit";

var auth = firebase.auth();
var database = firebase.firestore();
var storage = firebase.storage();

type addInfoArr = {
	twitch?: string;
	birthday?: string;
	color?: string;
	status?: string;
};

async function addUser(uid: string, item: string, content: string) {
	var userRef = database.collection("users").doc(uid);

	var addInfo: addInfoArr = {};

	switch (item) {
		case "twitch":
			addInfo.twitch = content;
			break;
		case "birthday":
			addInfo.birthday = content;
			break;
		case "color":
			addInfo.color = content;
			break;
		case "status":
			addInfo.status = content;
			break;
	}

	await userRef.set(addInfo, { merge: true });
	return `Linked ${item}`;
}

export default addUser;
