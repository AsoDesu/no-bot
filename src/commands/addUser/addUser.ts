import { Message } from 'discord.js'
import scoresaber from '../../scoresaberApiGrabber'
import addUserToDatabase from './addMemberToDatabase'

async function command(msg: Message, args: string[]) {
    if (!args[0]) {
        msg.reply('Usage: `>add {scoresaber link here}`');
        return;
    }
    var parsedUrl = parseScoreSaberLink(args[0])
    if (!parsedUrl) {
        msg.reply('Player Not Found');
        return;
    }

    var player = await scoresaber(parsedUrl)
    
    if (player.playerInfo.playerName.includes('NO')) {
        addUserToDatabase(msg, parsedUrl)
    } else {
        msg.reply('You do not have `NO` in your name ')
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