import { profile } from "console";
import { Message, MessageEmbed } from "discord.js";

import firebase, { auth } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import '../../firebaseinnit'
import getUserFromScoreSaber from '../../scoresaberApiGrabber'

var firestore = firebase.firestore()

function command(msg: Message, args: string[]) {
    if (!msg.mentions.users) {
        msg.channel.send('You need to specify a user')
    }
    var userId = msg.mentions.users.first().id
    firestore.collection('users').doc(userId).get().then(async doc => {
        if (!doc.exists) {
            msg.reply('That user is not registered')
            return
        }

        var data = doc.data()
        var scoreSaberUser = await getUserFromScoreSaber(data.scoresaberId)

        var dataDescription: string = `ScoreSaber: https://scoresaber.com/u/${data.scoresaberId}`

        if (data.twitch) {
            dataDescription = dataDescription.concat(`\n Twitch: https://twitch.tv/${data.twitch}`)
        } 
        if (data.birthday) {
            dataDescription = dataDescription.concat(`\n Birthday: ${data.birthday}`)
        }

        var profileEmbed = {
            "title": `${msg.mentions.users.first().username}'s Profile`,
            "description": dataDescription,
            "color": 1,
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
                }
            ]
        }

        msg.channel.send(new MessageEmbed(profileEmbed))
    })
}

export default command