import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { client } from "../bot";

export default class RestartVmCommand extends Command {
    public constructor() {
        super('restartvm', {
            aliases: ['restartvm', "rvm"],
        });
    }

    public async exec(message: Message, args: any) {
        message.react("⌛");
        await client.initVM();
        message.react("✅");
    }
}