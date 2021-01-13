import 'dotenv/config'
import Discord from 'discord.js'
const client = new Discord.Client()

import addUser from './commands/addUser/addUser'
import removeUser from './commands/removeUser/removeUser'
import getUser from './commands/getUser/getUser'
import addModUser from './commands/addModUser/addUser'
import HELP from './commands/help/help'
import leaderboard from './commands/leaderboard/leaderboard'
import colour from './commands/leaderboard/colour'
import dev from './commands/dev/dev'
import pfp from './commands/pfp'
import link from './commands/link/linkTwitch'
import addMod from './commands/addMod/addMod'
import scuffed from './commands/Scuffed'

import YEP from './modules/YEP'
import BOT from './modules/@bot'
import vc from './modules/vc'
import thoughts from './modules/purgatory'

client.on('message', async (msg: Discord.Message) => {
    if (msg.author.bot) return

    if (msg.content == 'devvcj' && !msg.guild && (msg.author.id == '580425653325791272')) { vc.join(client); return }
    if (msg.content == 'devvcd' && !msg.guild && (msg.author.id == '580425653325791272')) { vc.leave(client); return }
    if (msg.content.startsWith('*') && !msg.guild && (msg.author.id == '580425653325791272')) { thoughts(client, msg.content.replace('*', '')); return }

    if (!msg.guild) { return; }
    if (msg.member.roles.cache.has(process.env.BANROLE)) return

    // memes
    if (msg.content.toUpperCase().includes('YEP')) { YEP(msg) }
    if (msg.content.includes('777284907302912000')) { BOT(msg) }
    if (msg.content.includes('never')) { never(msg)}

    if (!msg.content.startsWith(process.env.PREFIX)) return;

    const args = msg.content.slice(process.env.PREFIX.length).split(/ +/)
    const command = args.shift().toLowerCase()

    switch (command) {
        case 'help':
            HELP(msg, args)
            return;
        case 'add':
            addUser(msg, args)
            return;
        case 'remove':
            removeUser(msg, args)
            return;
        case 'user':
            getUser(msg, args)
            return;
        case 'adduser':
            addModUser(msg, args)
            return;
        case 'leaderboard':
            leaderboard(msg, args)
            return;
        case 'link':
            link(msg, args)
            return;
        case 'color':
            colour(msg, args)
            return;
        case 'dev':
            dev(msg, args)
            return;
        case 'pfp':
            pfp(msg, args)
            return;
        case 'addmod':
            addMod(msg, args)
            return;
        case 'scuffed':
            scuffed(msg, args)
            return;
    }
})

client.on('ready', () => {
    console.log('Connected to Discord')
    client.user.setActivity({ type: "LISTENING", name: ">help" })
})

client.login(process.env.TOKEN)

// Express stuff

import Express from 'express'
import never from './modules/never'
const app = Express()

app.get('/ping', (req, res) => {
    res.send('Online')
})

app.get('/', (req, res) => {
    res.send('hello ;)')
})

app.listen(process.env.PORT)