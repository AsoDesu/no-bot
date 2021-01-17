import { Message, MessageEmbed, MessageReaction, User } from 'discord.js'
import randColor from '../../randomColor'
import format from './numberFormatter'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

import '../../firebaseinnit'

var db = firebase.firestore()

type leaderboardUser = {
    name: string,
    xp: number,
}

// I have further proof that array's in JavaScript are nightmares that are only created to make the coder suffer eternally until they eventually give up and find some hacky solution

async function command(msg: Message, args: string[]) {
    // Generate the array
    msg.channel.startTyping()

    var page = 1
    var leaderboard = (await createLeaderboardArray(page, msg))
    var sentMsg = await msg.channel.send(createEmbedFromLbArray(leaderboard, msg, page))

    // Stop typing if the message didn't
    msg.channel.stopTyping(true)
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
        leaderboardMsg = leaderboardMsg.concat(`#${(newLb.indexOf(item)) + page * 10 - 10 + 1} - \`${item.name}\` - ${format.numberWithCommas(item.xp)}xp \n`)
    })

    // Send the message
    return new MessageEmbed({
        "title": "NO Clan Balance Leaderboard",
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

// Function to generate the leaderboard array
async function createLeaderboardArray(page: number, msg: Message) {
    var leaderboard: leaderboardUser[] = []
    var userCollection = (await db.collection('users').where('bal', '!=', null).get()).docs
    for (const doc of userCollection) {
        var userData = doc.data()
        var discordUserData = await msg.guild.members.fetch(doc.id)
        var user: leaderboardUser = { name: discordUserData.user.username, xp: userData.bal }
        leaderboard.push(user)
    }
    leaderboard = leaderboard.sort(function (a, b) {
        return b.xp - a.xp
    })

    return leaderboard
}

export default command