import { Argument, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import execa from "execa";
import { resolve } from "path"
import process from "process"

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
        try {
          const proc = execa("ping", [args.url ? args.url : "discord.com", "-c", "5"]);

          let dmsg: Message;

          proc.stdout?.on("data", async (msg: any) => {
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

          proc.stdout?.on("error", (e) =>  message.reply(e.message));
          proc.on("error", (e) =>  message.reply(e.message));
        } catch(e) {
          message.reply(e.message);
        }
    }
}