import { Message } from 'discord.js'
import addUserToDatabase from './addMemberToDatabase'
import scoresaber from '../../scoresaberApiGrabber'

async function command(msg: Message, args: string[]) {
    if (!msg.member.hasPermission('MANAGE_ROLES')) {
        msg.reply('You dont have permission to do that <:kekchamp:777532686394720276>')
        return;
    }
    if (!args[1] || !msg.mentions.members.first()) {
        msg.reply('Usage: `>adduser {user} {scoresaber link}`');
        return;
    }

    var parsedUrl = parseScoreSaberLink(args[1])
    if (!parsedUrl) {
        msg.reply('Player Not Found');
        return;
    }

    var player = await scoresaber(parsedUrl)
    if (!player) {
        msg.reply('That uiser does not exist')
        return;
    }

    if (player) {
        addUserToDatabase(msg, parseScoreSaberLink(args[1]))
    } else {
        msg.reply("Thats not a scoresaber link <:sadge:777529901313818716>")
    }
}

function parseScoreSaberLink(url: string) {
    if (url.includes('scoresaber.com/u')) {
        var playerUid = url.split('u/')
        return playerUid[playerUid.length -1];
    } else {
        return false;
    }
}

export default command