import { Message } from "discord.js";

async function colour(msg: Message, args: string[]) {
    var oneRole = await msg.guild.roles.fetch(process.env.ONEROLE)
    if (!msg.member.roles.cache.has(process.env.ONEROLE)) {
        msg.reply('You can\t do that')
        return;
    }


    if (!isHex(args[0])) {
        msg.reply('That is not a hexcode')
        return;
    }

    oneRole.setColor(args[0])
    msg.channel.send('Set the color')
}

function isHex(input: string) {
    var re = /[0-9A-Fa-f]{6}/g;
    if(re.test(input)) {
        return true
    } else {
        return false
    }
}

export default colour