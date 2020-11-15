import 'dotenv/config'
import { Message } from "discord.js";

import addUser from './addUser/addMemberToDatabase'

function command(msg: Message, args: string[]) {
    addUser(msg, '76561198272266872')
}

export default command