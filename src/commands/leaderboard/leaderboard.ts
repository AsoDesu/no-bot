import { Message, MessageEmbed, MessageReaction, User } from 'discord.js'
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

async function command(msg: Message, args: string[], reqPage?: number) {
    // Test if the command was last run 2 minuites ago
    var rateLimitTest = rateLimit(msg, 120000)
    if (rateLimitTest.rateLimit && !msg.member.hasPermission('MANAGE_ROLES')) {
        msg.reply(`Hey not to fast, Try again in ${formatNumber.msToMandS(rateLimitTest.againIn)}s`)
        return
    }

    // Generate the array
    msg.channel.startTyping()
    var page = reqPage ? reqPage : 1
    var lbArr = (await createLeaderboardArray(page))
    var leaderboard = lbArr.lb

    // Add the array to the embed description
    var leaderboardMsg: string = ""
    leaderboard.forEach(item => {
        leaderboardMsg = leaderboardMsg.concat(`#${(leaderboard.indexOf(item)) + page * 10 - 10 + 1} - \`${item.name}\` - ${formatNumber.numberWithCommas(item.pp)}pp \n`)
    })

    // Give the role to the #1 player
    //giveRoleTo1(msg, leaderboard[0].discord)

    // Send the message
    var sentMsg = await msg.channel.send(new MessageEmbed({
        "title": "NO Clan Leaderboard",
        "description": leaderboardMsg,
        "color": randColor(),
        "footer": {
            "text": `Page ${page}/${Math.ceil(lbArr.totalLength / 10)}`
        }
    }))

    // Stop typing if the message didn't
    msg.channel.stopTyping(true)
    sentMsg.react(reqPage ? '⬅️' : '⏺️')
    sentMsg.react('➡️')

    // Reaction filter (Only the two emotes and only the user who did the command)
    const filter = (reaction: MessageReaction, user: User) => {
        return (reaction.emoji.name === '⬅️') || (reaction.emoji.name === '➡️') && !user.bot
    }

    // Create collector
    var rpCollector = sentMsg.createReactionCollector(filter, { time: 60000 })

    // Someone reacted
    rpCollector.on('collect', (reaction: MessageReaction, user: User) => {
        // Ignore the bots own reactions
        if (user.bot) return 
        // If the reaction is previous page and they are not on the first page
        if (reaction.emoji.name == '⬅️' && !(page == 1)) {
            command(msg, args, page - 1)
            rpCollector.stop()
            return;
        // If the reaction is next page, and they are not on the last page
        } else if (reaction.emoji.name == '➡️' && !(page == lbArr.totalLength)) {
            command(msg,args, page + 1)
            rpCollector.stop()
            return
        }
    })
}

// Function to generate the leaderboard array
async function createLeaderboardArray(page: number) {
    var leaderboard: leaderboardUser[] = []
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

    return {
        totalLength: leaderboard.length,
        lb: leaderboard.splice(((page * 10) - 10), 10)
    }
}

export default command