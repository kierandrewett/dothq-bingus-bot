import { Client } from "asana";
import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class DeleteTodoCommand extends Command {
    public asana: Client;

    public constructor() {
        super('deletetodo', {
            aliases: ['delete-todo', 'rm-todo', 'deletetodo'],

            args: [
                {
                    id: 'id',
                    match: 'rest'
                }
            ]
        });

        this.asana = Client.create().useAccessToken(process.env.ASANA_TOKEN || "");
    }

    public async exec(message: Message, args: any) {
        if(!message.member) return;

        if(!message.member.roles.cache.has("662323136343179264")) {
            return message.channel.send("🖕 no permission lmao")
        }

        this.asana.tasks.delete(args.id).then(_ => {
            message.react("🗑")
            message.react("✅")
        }).catch(_ => {
            message.react("❌")
        })
    }
}