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
        const c: any = await client.channels.cache.get("623165984135446558")
        const role = await member.guild.roles.fetch('864231134526963752');

        if(!c || !role) return;
        
        const msg = await c.send(`${role}`)
        msg.edit(`__
__👋 Hello ${member.user.username}#${member.user.discriminator}, welcome to ${member.guild.name}!

ℹ You can learn more about us at <#829483412506148914>
🪄 You can get special roles at <#805937863455277086>
🙋 Don't be afraid to ask any questions

✨ We hope you enjoy your stay here!
__
__
        `)
    }
}