import { Argument, Command } from "discord-akairo";
import { Message } from "discord.js";
import { inspect } from "util";
import { client } from "../bot";

export default class EvalCommand extends Command {
    public constructor() {
        super('eval', {
            aliases: ['eval'],

            args: [
                {
                    id: 'code',
                    match: 'rest'
                },
                {
                    id: 'no-type',
                    match: 'flag',
                    flag: '--no-type'
                }
            ]
        });
    }

    public exec(message: Message, args: any) {
        if(
            !message.member?.roles.cache.has("912817067579822161") &&
            !client.ownerID.includes(message.author.id)
        ) {
            return message.channel.send(`${message.author.username.toLowerCase()} is not in the sudoers file. This incident will be reported.`);
        }

        try {
            if(args.code.includes("process") && args.code.includes("env")) {
                return message.channel.send("🖕");
            }

            const evaluated = eval(args.code);
            if(args["no-type"]) return;

            const type = inspect(evaluated);

            return message.reply({ 
                content: type.replace(/(?:https?:\/\/)?discord(?:app)?\.(?:com\/invite|gg)\/[a-zA-Z0-9]+\/?/, "")
            })
        } catch(e) {
            return message.reply({ 
                content: (e as any).toString().replace(/(?:https?:\/\/)?discord(?:app)?\.(?:com\/invite|gg)\/[a-zA-Z0-9]+\/?/, "")
            })
        }
    }
}