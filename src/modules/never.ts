import { Message } from "discord.js";

var responses = [
    "gonna give you up, never gonna let you down, never gonna run around and desert you"
]

function never(msg: Message) {

var never =(Math.floor(Math.random()*10)+1);
if (never == 1)
{
    msg.channel.send("gonna give you up, never gonna let you down, never gonna run around and desert you")
}
}
export default never