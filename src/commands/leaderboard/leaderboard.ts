import { Message, MessageEmbed } from 'discord.js'
import randColor from '../../randomColor'

import getUserFromScoresaber from '../../scoresaberApiGrabber'
import formatNumber from './numberFormater'
import rateLimit from './rateLimit'
import giveRoleTo1 from './1Role'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

import '../../firebaseinnit'

var db = firebase.firestore()

type leaderboardUser = {
    scoresaber: string, 
    name: string, 
    pp: number,
    discord: string
}

// I have further proof that array's in JavaScript are nightmares that are only created to make the coder suffer eternally until they eventually give up and find some hacky solution

async function command(msg: Message, args: string[]) {
    var rateLimitTest = rateLimit(msg, 120000)
    if (rateLimitTest.rateLimit && !msg.member.hasPermission('MANAGE_ROLES')) {
        msg.reply(`Hey not to fast, Try again in ${formatNumber.msToMandS(rateLimitTest.againIn)}s`)
        return
    }

    msg.channel.startTyping()
    var leaderboard: leaderboardUser[] = []

    // bad code, very very bad code, see above statement
    var userCollection = (await db.collection('users').get()).docs
    for (const doc of userCollection) {
        var userData = doc.data()
        var ssData = await getUserFromScoresaber(userData.scoresaberId)
        var user: leaderboardUser = { scoresaber: userData.scoresaberId, name: ssData.playerInfo.playerName, pp: ssData.playerInfo.pp, discord: doc.id }
        leaderboard.push(user)
    }

    leaderboard = leaderboard.sort(function (a, b) {
        return b.pp - a.pp
    })

    var leaderboardMsg: string = ""
    leaderboard.forEach(item => {
        leaderboardMsg = leaderboardMsg.concat(`#${leaderboard.indexOf(item) + 1} - \`${item.name}\` - ${formatNumber.numberWithCommas(item.pp)}pp \n`)
    })

    giveRoleTo1(msg, leaderboard[0].discord)
    
    msg.channel.send(new MessageEmbed({
        "title": "NO Clan Leaderboard",
        "description": leaderboardMsg,
        "color": randColor()
    }))
    msg.channel.stopTyping(true)
}

export default command