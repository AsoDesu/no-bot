import { GuildEmoji, Message, TextChannel } from "discord.js";

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

import log from '../../modules/botLog'

async function command(msg: Message, args: string[]) {
    if (!msg.member.hasPermission('MANAGE_GUILD')) { msg.channel.send('You don\'t have permission to do that'); return; }

    if (args.length < 2) { msg.channel.send('Usage: >createrr (msgid) (emote)'); return; }

    var reactArray: reactionArray = [];
    var data = await db.collection('reactions').doc(args[0]).get()
    if (!data.exists) { msg.channel.send('That message isn\'t linked to any reaction roles.'); return }
    reactArray = data.data().emotes as reactionArray

    var channel: TextChannel = msg.guild.channels.cache.get(data.data().channel) as TextChannel
    /*if (!channel || channel.type != 'text') { msg.channel.send('Couldn\'t find the specified text channel'); return }
    var selectedChannel = channel as TextChannel*/

    var message = (await channel.messages.fetch({ limit: 10 })).get(args[0])
    if (!message) { msg.channel.send('Couldn\'t find the specified message.'); return }

    if (args[1] == 'all') {
        message.reactions.removeAll()
        db.collection('reactions').doc(message.id).delete()
    } else {
        var emote: string;
        if (args[1].includes('<')) {
            var clientEmote = msg.guild.emojis.cache.get(args[1].split(':')[1].replace('>', ''))
            if (!clientEmote) {
                msg.channel.send('I don\'t have access to that emote.')
                return;
            }
            emote = clientEmote.id
        } else {
            emote = args[1]
        }

        var emoteIndex = reactArray.findIndex(e => e.emote == emote)
        if (emoteIndex == null) { msg.channel.send('That emote doesn\'t exist on that message.'); return; }
        reactArray.slice(emoteIndex)

        message.reactions.cache.get(emote).remove()

        db.collection('reactions').doc(message.id).set({
            emotes: reactArray
        }, { merge: true })

    }
    msg.channel.send('Removed a reaction role from that message.')
    log(`${msg.author.username} removed a reaction role.`, msg.client, __filename)

}

function containsOnlyEmojis(text: string) {
    const onlyEmojis = text.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '')
    const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
    return onlyEmojis.length === visibleChars.length
}

type reactionArray = [{
    emote: string,
    role: string
}?]

export default command