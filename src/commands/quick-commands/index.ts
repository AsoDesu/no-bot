import { Collection, Message } from 'discord.js'

import fs from 'fs'

type command = {
    name: string,
    execute(msg: Message, args: string[]): any
}

var commands = new Collection()
const commandFiles = fs.readdirSync(__dirname + '\\commands\\', { encoding: "utf-8" }).filter(file => file.endsWith(".ts"))

for (const file of commandFiles) {
    const commandFile = require(`./commands/${file}`)
    commands.set(commandFile.name, commandFile)
}

function command(msg: Message, args: string[], command: string) {
    try {
        var commandFile = (commands.get(command) as command)
    } catch (err) {}

    if (commandFile) {
        commandFile.execute(msg, args);
    }
}

export default command