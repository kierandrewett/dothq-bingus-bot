import { Listener } from "discord-akairo";
import { GuildMember } from "discord.js";
import { client } from "../bot";

export default class JoinListener extends Listener {
    constructor() {
        super('join', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }

    async exec(member: GuildMember) {
        const c: any = await client.channels.cache.get("750104870224396409")
        const role = await member.guild.roles.fetch('864231134526963752');

        if(!c || !role) return;
        
        const msg = await c.send(`${role}`);
        msg.delete()
    }
}