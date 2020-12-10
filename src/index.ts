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

import YEP from './modules/YEP'
import BOT from './modules/@bot'
import changelog from './modules/changelog'

client.on('message', async (msg: Discord.Message) => {
    if (msg.author.bot) return
    if (msg.member.roles.cache.has(process.env.BANROLE)) return

    // memes
    if (msg.content.toUpperCase().includes('YEP')) { YEP(msg) }
    if (msg.content.includes('777284907302912000')) { BOT(msg) }

    if (!msg.content.startsWith(process.env.PREFIX) || !msg.guild) return;

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
    }
})

client.on('ready', () => {
    console.log('Connected to Discord')
    client.user.setActivity({ type: "LISTENING", name: ">help" })
    changelog(client)
})

client.login(process.env.TOKEN)

import Express from 'express'
const app = Express()

app.get('/ping', (req, res) => {
    res.send('Online')
})

app.get('/', (req, res) => {
    res.send('hello ;)')
})

app.listen(process.env.PORT)
