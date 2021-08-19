import { Argument, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import execa from "execa";

export default class PingCommand extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping'],

            args: [
                {
                    id: 'url',
                    match: 'rest'
                }
            ]
        });
    }

    public async exec(message: Message, args: any) {
        const process = execa("ping", [args.url ? args.url : "discord.com", "-c", "3"]);

        let dmsg: Message;

        process.stdout?.on("data", async (msg) => {
            if(!dmsg) {
                dmsg = await message.channel.send({
                    content: `\`\`\`${msg.toString().trim()}\`\`\``
                })
            } else {
                await dmsg.edit({
                    content: `\`\`\`${dmsg.content.replace(/\`\`\`/g, "")}\n${msg.toString().trim()}\`\`\``
                })
            }
        });
    }
}