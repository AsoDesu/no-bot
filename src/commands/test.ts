import 'dotenv/config'
import { Message } from "discord.js";

import addUser from './addUser/addMemberToDatabase'
import scoresbaer from '../scoresaberApiGrabber'

function command(msg: Message, args: string[]) {
    msg.channel.send('big up boris init')
    scoresbaer('1')
}

export default command