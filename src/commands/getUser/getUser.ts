import { EmbedFieldData, Message, MessageEmbed } from "discord.js";

import firebase, { auth } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import '../../firebaseinnit'
import getUserFromScoreSaber from '../../scoresaberApiGrabber'

import randomColour from '../../randomColor'

var firestore = firebase.firestore()

function command(msg: Message, args: string[]) {
    var userId: string = (msg.mentions.users.size == 0) ? msg.author.id : msg.mentions.users.first().id
    firestore.collection('users').doc(userId).get().then(async doc => {
        if (!doc.exists || !doc.data().scoresaberId) {
            msg.reply('That user is not registered')
            return
        }

        var data = doc.data()
        var scoreSaberUser = await getUserFromScoreSaber(data.scoresaberId)

        var dataDescription: string = `**ScoreSaber**: https://scoresaber.com/u/${data.scoresaberId}`

        if (data.twitch) { dataDescription = dataDescription.concat(`\n**Twitch**: https://twitch.tv/${data.twitch}`) } 
        if (data.birthday) { dataDescription = dataDescription.concat(`\n**Birthday**: ${data.birthday}`) }
        if (data.status) {dataDescription = dataDescription.concat(`\n**Status**: ${data.status}`)}
        if (data.awards) { dataDescription = dataDescription.concat(`\n**Awards**: ${data.awards.join(', ')}`) }
        var colour = randomColour()
        if (data.color) { colour = data.color }

        var profileEmbed = {
            "title": `${(await msg.guild.members.fetch(userId)).user.username}'s Profile`,
            "description": dataDescription,
            "color": colour,
            "fields": [
                {
                    "name": "Global Rank",
                    "value": `#${scoreSaberUser.playerInfo.rank}`,
                    "inline": true
                },
                {
                    "name": "Country Rank",
                    "value": `#${scoreSaberUser.playerInfo.countryRank}`,
                    "inline": true
                },
                {
                    "name": "Balance",
                    "value": `${data.bal ? data.bal : 0}xp`,
                    "inline": true
                },
                {
                    "name": "Level",
                    "value": `${data.level ? data.level : 1}`
                }
            ]
        }

        msg.channel.send(new MessageEmbed(profileEmbed))
    })
}

export default command