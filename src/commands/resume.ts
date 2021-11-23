import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Queue } from "discord-player";
import { client } from "../bot";

export default class ResumeCommand extends Command {
    public constructor() {
        super('resume', {
            aliases: ['resume']
        });
    }

    public async exec(message: Message, args: any) {
        if (!message.member?.voice.channelId) {
            return message.reply("You are not in a voice channel.");
        }

        if(
            message.guild?.me?.voice.channelId &&
            message.member?.voice.channelId !== message.guild?.me?.voice.channelId
        ) {
            return message.reply("You are not in my voice channel.");
        }

        const queue = client.player.getQueue(message.guild as any);

        if(queue) {
            queue.setPaused(false);
            message.react("▶");
        } else {
            message.reply("Nothing is playing right now.")
        }
    }
}