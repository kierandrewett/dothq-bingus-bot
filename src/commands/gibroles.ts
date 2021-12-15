import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class GibRolesCommand extends Command {
    public constructor() {
        super('gibroles', {
            aliases: ['gibroles'],
            ownerOnly: true
        });
    }

    public async exec(message: Message) {
        var x = 0;
        let msg;

        const entries = message.guild?.members?.cache.entries() as any;
        const size = message.guild?.members?.cache.size

        const roles = [
            message.guild?.roles.cache.get("914225540028854312") as any,
            message.guild?.roles.cache.get("914220533984407583") as any,
            message.guild?.roles.cache.get("914191132399915039") as any,
        ]

        for await (const [id, m] of entries) {
            x = x+1;

            if(m.roles.cache.hasAll(
                "914225540028854312", 
                "914220533984407583", 
                "914191132399915039"
            )) return;

            await m.roles.add(roles);
            await message.channel.send(`Added roles to ${m.user.username} (${x}/${size})`)
            console.log(`Added roles to ${m.user.username} (${x}/${size})`)
        }
    }
}