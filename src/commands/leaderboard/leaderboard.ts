import { Message, MessageEmbed, MessageReaction, User } from 'discord.js'
import randColor from '../../randomColor'

import formatNumber from './numberFormater'
import rateLimit from './rateLimit'

import give1Role from './1Role'

import cache from './cache'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

import '../../firebaseinnit'
import log from '../../modules/botLog'

var db = firebase.firestore()

type leaderboardUser = {
    scoresaber: string,
    name: string,
    pp: number,
    discord: string
}

// I have further proof that array's in JavaScript are nightmares that are only created to make the coder suffer eternally until they eventually give up and find some hacky solution

async function command(msg: Message, args: string[]) {
    // Test if the command was last run 2 minuites ago
    var rateLimitTest = rateLimit(msg, 120000)
    if (rateLimitTest.rateLimit && !msg.member.hasPermission('MANAGE_ROLES')) {
        msg.reply(`Hey not to fast, Try again in ${formatNumber.msToMandS(rateLimitTest.againIn)}s`)
        log(`${msg.author.username} was rate limited`, msg.client, __filename)
        return
    }

    var update = ((args[0] == 'update') && msg.member.hasPermission('MANAGE_MESSAGES'))
    if (!update && args[0] == 'update') { msg.channel.send('Leaderboard updating is a large job, and has been limited to staff only.'); return; }
    if (update) { msg.channel.startTyping() }

    var page = 1
    var leaderboard = (!update) ? cache.getCache() : await cache.updateCache(msg.client)
    if (!leaderboard) { msg.channel.send(`The leaderboard has not been updated yet. Please try again later. Current Status: ${cache.getCacheStatus().status}`); return }

    await give1Role(msg, leaderboard[0].discord).catch(() => { log(`Error giving #1 role`, msg.client, __filename) })

    var sentMsg = await msg.channel.send(createEmbedFromLbArray(leaderboard, msg, page))

    if (update) { msg.channel.stopTyping() }
    sentMsg.react('⬅️')
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
            page = page - 1
            sentMsg.edit(createEmbedFromLbArray(leaderboard, msg, page))

            reaction.users.remove(user.id)

            return;
            // If the reaction is next page, and they are not on the last page
        } else if (reaction.emoji.name == '➡️' && !(page == Math.ceil(leaderboard.length / 10))) {
            page = page + 1
            sentMsg.edit(createEmbedFromLbArray(leaderboard, msg, page))

            reaction.users.remove(user.id)

            return
        }
    })
}

function createEmbedFromLbArray(leaderboard: leaderboardUser[], msg: Message, page: number) {
    var leaderboardArrClone = [...leaderboard]
    var newLb = getItems(leaderboardArrClone, page)

    // Add the array to the embed description
    var leaderboardMsg: string = ""
    newLb.forEach(item => {
        leaderboardMsg = leaderboardMsg.concat(`#${(newLb.indexOf(item)) + page * 10 - 10 + 1} - \`${item.name}\` - ${formatNumber.numberWithCommas(item.pp)}pp \n`)
    })

    // Send the message
    return new MessageEmbed({
        "title": "NO Clan Leaderboard",
        "description": leaderboardMsg,
        "color": randColor(),
        "footer": {
            "text": `Page ${page}/${Math.ceil(leaderboard.length / 10)}`
        }
    })
}

function getItems(leaderboard: leaderboardUser[], page: number) {
    return leaderboard.splice(((page * 10) - 10), 10)
}

export default command