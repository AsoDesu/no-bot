import { Message } from "discord.js";
import leaderboard from './leaderboard/leaderboard'
import balance from './economy/bal'

const alises = [
    { name: "lb", function: leaderboard },
    { name: "balance", function: balance }
]

function command(command: string, msg: Message, args: string[]) {
    var alies = alises.find(a => a.name == command)
    if (!alies) return;
    alies.function(msg, args)
}

export default command