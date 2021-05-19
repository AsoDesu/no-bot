import { Message } from "discord.js";

class BaseCommand {
	public execute(msg: Message, args: string[]) {}
	public label: string = "";

	public whitelistedServers: string[] = [];
	public aliases: string[];

	public allowedInDM: boolean = false;
	public description: string = "No Description Provided.";
	public usage: string = `No Usage Provided.`;

	public hidden = false;
}

export default BaseCommand;
