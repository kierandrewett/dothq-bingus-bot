import { Argument, Command } from "discord-akairo";
import { Message } from "discord.js";
import { inspect } from "util";
import { client } from "../bot";
import { Queue } from "discord-player"

export default class PlayCommand extends Command {
    public constructor() {
        super('play', {
            aliases: ['play'],

            args: [
                {
                    id: 'search',
                    match: 'rest'
                }
            ]
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
            return message.reply("**Join**");
        }

        client.player.createQueue(
            message.guild as any, 
            {
                metadata: {
                    channel: message.channel
                }
        });

        const queue = client.player.getQueue(message.guild as any);
        
        try {
            if (!queue.connection) await queue.connect(
                message.member.voice.channel as any
            );
        } catch {
            queue.destroy();
            return message.reply("Failed to join your voice channel. Cry about it.");
        }

        const track = (await client.player.search(args.search, {
            requestedBy: message.member
        })).tracks[0];

        if (!track) return message.reply(`No results found for **${args.search}**`);

        queue.play(track);
    }
}