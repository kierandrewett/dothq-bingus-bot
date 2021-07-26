import { Argument, Command } from "discord-akairo";
import { Message } from "discord.js";
import { inspect } from "util";

export default class EvalCommand extends Command {
    public constructor() {
        super('eval', {
            aliases: ['eval'],

            ownerOnly: true,

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
        try {
            const evaluated = eval(args.code);
            if(args["no-type"]) return;

            const type = inspect(evaluated);

            return message.reply(type, { code: "xl", replyTo: message })
        } catch(e) {
            console.log(e.message)
            return message.reply(e, { code: "xl", replyTo: message })
        }
    }
}