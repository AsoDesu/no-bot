import { EmbedFieldData, Message, MessageEmbed } from "discord.js";

import firebase, { auth } from "firebase";
import "firebase/auth";
import "firebase/firestore";

import "../../firebaseinnit";
import getUserFromScoreSaber from "../../scoresaberApiGrabber";

import randomColour from "../../randomColor";

var firestore = firebase.firestore();

function command(msg: Message, args: string[]) {
	var userId: string = msg.mentions.users.size == 0 ? msg.author.id : msg.mentions.users.first().id;
	firestore
		.collection("users")
		.doc(userId)
		.get()
		.then(async (doc) => {
			var data = doc.data() ? doc.data() : {};

			var dataDescription: string = ``;

			if (data.scoresaberId) {
				data.description = dataDescription.concat(`\n**ScoreSaber**: https://scoresaber.com/u/${data.scoresaberId}`);
			}

			if (data.twitch) {
				dataDescription = dataDescription.concat(`\n**Twitch**: https://twitch.tv/${data.twitch}`);
			}
			if (data.birthday) {
				dataDescription = dataDescription.concat(`\n**Birthday**: ${data.birthday}`);
			}
			if (data.status) {
				dataDescription = dataDescription.concat(`\n**Status**: ${data.status}`);
			}
			if (data.awards) {
				dataDescription = dataDescription.concat(`\n**Awards**: ${data.awards.join(", ")}`);
			}
			if (data.married_to) {
				dataDescription = dataDescription.concat(`\n**Married to**: ${generateHarem(data.married_to)}`);
			}
			var colour = randomColour();
			if (data.color) {
				colour = data.color;
			}

			var profileEmbed = {
				title: `${(await msg.guild.members.fetch(userId)).user.username}'s Profile`,
				description: dataDescription,
				color: colour,
				fields: await generateFields(data),
				thumbnail: {
					url: msg.mentions.users.size != 0 ? msg.mentions.users.first().avatarURL() : msg.author.avatarURL(),
				},
			};

			msg.channel.send(new MessageEmbed(profileEmbed));
		});
}

async function generateFields(data: any) {
	var fielddata: EmbedFieldData[] = [];

	if (data.scoresaberId) {
		var scoreSaberUser = await getUserFromScoreSaber(data.scoresaberId);
		fielddata.push({
			name: "Global Rank",
			value: `#${scoreSaberUser.playerInfo.rank}`,
			inline: true,
		});

		fielddata.push({
			name: "Country Rank",
			value: `#${scoreSaberUser.playerInfo.countryRank}`,
			inline: true,
		});
	}

	fielddata.push({
		name: "Balance",
		value: `${data.bal ? data.bal : 0}xp`,
		inline: true,
	});
	fielddata.push({
		name: "Level",
		value: `${data.level ? data.level : 1}`,
		inline: true,
	});
	return fielddata;
}

function generateHarem(married_to: string[]) {
	var finalString = "";

	married_to.forEach((i) => {
		finalString = finalString.concat(`<@${i}>${married_to.indexOf(i) == married_to.length - 1 ? "" : ", "}`);
	});

	return finalString;
}

export default command;
