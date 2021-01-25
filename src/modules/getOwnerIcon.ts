import { Guild } from "discord.js";

function getOwnerIcon(guild: Guild) {
    return guild.members.cache.get(guild.ownerID).user.avatarURL({dynamic: true})
}

export default getOwnerIcon