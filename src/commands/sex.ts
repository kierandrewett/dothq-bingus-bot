import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PingCommand extends Command {
    constructor() {
        super('sex', {
           aliases: ['sex'] 
        });
    }

    exec(message: Message) {
        return message.reply('sex!');
    }
}
