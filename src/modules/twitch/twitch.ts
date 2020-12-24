import tmi from 'tmi.js'

import firebase from 'firebase'
import 'firebase/firestore'
var db = firebase.firestore()
import '../../firebaseinnit'

const client = tmi.client({
    identity: {
      username: "dumb_bot1",
      password: process.env.TMITOKEN
    }
})

client.on('message', (channel: string, usersate: tmi.Userstate, message: string, self: boolean) => {
    if (self) return;
    
    if (message.toLowerCase().includes('yep')) { client.say(channel, '! NOPE!!!!') }
    if (message.toLowerCase().includes('sourpls')) { client.say(channel, '! SourPls') }

    if (!message.startsWith(process.env.TMIPREFIX)) return;

    const args = message.slice(process.env.TMIPREFIX.length).split(/ +/)
    const command = args.shift().toLowerCase()
    
    switch (command) {
        case 'clan':
            client.say(channel, '! This user is a part of the NOPE clan, join here: https://discord.gg/5yxtr987uq')
            break;
    }
})

client.on('connected', () => {
    console.log('Connected to Twitch')
    joinChannels()
})

async function joinChannels() {
    var allusers = (await db.collection('users').where('twitch', '!=', '').get()).docs
    for (const doc of allusers) {
        await client.join(doc.data().twitch)
    }
}

client.connect()