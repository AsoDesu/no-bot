import { Message } from "discord.js";

import scoresaber from '../scoresaberApiGrabber'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import '../firebaseinnit'
var db = firebase.firestore()

async function command(msg: Message, args: string[]) {
    if ((msg.mentions.users.size == 0 && isNaN(parseInt(args[0])))) {
        msg.channel.send('You need to provide a user')
        return
    }
    if (isNaN(parseInt(args[0]))) {
        msg.channel.send(msg.mentions.users.first().avatarURL())
    } else {
        msg.channel.send('https://new.scoresaber.com' + (await scoresaber(args[0])).playerInfo.avatar)
    }
}

export default command