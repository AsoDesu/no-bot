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
import alises from './commands/alises'

// Economy
import getxp from './commands/economy/getxp'
import bal from './commands/economy/bal'
import baltop from './commands/economy/baltop'
import levelup from './commands/economy/levelup'
import gamble from './commands/economy/gamble'
import modxp from './commands/economy/managexp'
import collect from './commands/economy/uncollectedxp/collect'
import collectCache from './commands/economy/uncollectedxp/cache'
import shop from './commands/economy/shop/shop'

import YEP from './modules/YEP'
import BOT from './modules/@bot'
import vc from './modules/vc'
import thoughts from './modules/purgatory'
import never from './modules/never'

client.on('message', async (msg: Discord.Message) => {
    if (msg.author.bot) return

    if (msg.content == 'devvcj' && !msg.guild && (msg.author.id == '580425653325791272')) { vc.join(client); return }
    if (msg.content == 'devvcd' && !msg.guild && (msg.author.id == '580425653325791272')) { vc.leave(client); return }
    if (msg.content.startsWith('*') && !msg.guild && (msg.author.id == '580425653325791272')) { thoughts(client, msg.content.replace('*', '')); return }

    if (!msg.guild) { return; }
    if (msg.member.roles.cache.find(r => r.name == 'dumb-bot-ban')) return
    collectCache.addxp(msg.author.id, 0.5)

    //if (!msg.content.startsWith(process.env.PREFIX)) return;

    const args = msg.content.toLowerCase().slice(process.env.PREFIX.length).split(/ +/)
    const command = args.shift().toLowerCase()

    switch (command) {
        case 'help': HELP(msg, args); return;
        case 'add': addUser(msg, args); return;
        case 'remove': removeUser(msg, args); return;
        case 'user': getUser(msg, args); return;
        case 'adduser': addModUser(msg, args); return;
        case 'leaderboard': leaderboard(msg, args); return;
        case 'link': link(msg, args); return;
        case 'color': colour(msg, args); return;
        case 'dev': dev(msg, args); return;
        case 'pfp': pfp(msg, args); return;
        case 'addmod': addMod(msg, args); return;
        case 'scuffed': scuffed(msg, args); return;
        case 'play': getxp(msg, args); return;
        case 'bal': bal(msg, args); return;
        case 'baltop': baltop(msg, args); return;
        case 'levelup': levelup(msg, args); return;
        case 'gamble': gamble(msg, args); return;
        case 'addxp': modxp.giveXp(msg, args); return
        case 'removexp': modxp.removeXp(msg, args); return
        case 'setxp': modxp.setXp(msg, args); return
        case 'togglegamble': modxp.toggleGamble(msg, args); return
        case 'setjackpot': modxp.setJackpot(msg, args)
        case 'collect': collect(msg, args); return
        case 'shop': shop.shopcmd(msg, args); return;
        case 'buy': shop.buycmd(msg, args); return;
        case 'inv': shop.invcmd(msg, args); return;
        case 'use': shop.usecmd(msg, args); return;
        case 'resetxp232': modxp.resetXp(msg, args); return;
    }
    alises(command, msg, args)
    // memes
    if (msg.content.toUpperCase().includes('YEP')) { YEP(msg) }
    if (msg.content.includes('777284907302912000')) { BOT(msg) }
    if (msg.content.includes('never')) { never(msg) }
})

client.on('ready', () => {
    console.log('Connected to Discord')
    client.user.setActivity('Version 1.5.2')
})

client.login(process.env.TOKEN)

// Express stuff

import Express from 'express'
const app = Express()

app.get('/ping', (req, res) => {
    res.send('Online')
})

app.get('/', (req, res) => {
    res.send('hello ;)')
})

app.listen(process.env.PORT)