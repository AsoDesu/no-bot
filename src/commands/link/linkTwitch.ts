import { Message } from "discord.js";

import addInfoToDB from './addInfoToDatabase'

async function command(msg: Message, args: string[]) {
    var formattedContent: string;
    switch (args[0]) {
        case 'twitch':
            if (!args[1].includes('twitch.tv/')) { msg.channel.send('Invalid link, make sure to send the full link.'); return; }
            formattedContent = doPogTwitchFormatting(args[1])
            break;
        case 'birthday':
            var parsedDate = doEvenPoggerDateValidationYesBigWords(args[1])
            if (parsedDate != 1) { msg.channel.send('That is not a valid date, make sure to format your date DD/MM'); return; }
            formattedContent = args[1]
            break;
    }
    msg.channel.send(await addInfoToDB(msg.member.id, args[0], formattedContent))
}

function doPogTwitchFormatting(thing: string) {
    var split = thing.split('/')
    return split[split.length - 1]
}

function doEvenPoggerDateValidationYesBigWords(date: string) {
    // DD/MM
    var parts: string[] = date.split('/')
    if ((parseInt(parts[0]) > 31)) {
        return NaN
    }
    if ((parseInt(parts[1]) > 12)) {
        return NaN
    }
    return 1
}

export default command