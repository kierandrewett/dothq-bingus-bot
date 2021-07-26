import { Argument, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { inspect } from "util";

export default class PingCommand extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping'],
        });
    }

    public async exec(message: Message) {
        const sent = await message.reply('Ping!');
        const timeDiff = ((sent?.editedAt as any) || (sent?.createdAt as any)) - ((message.editedAt as any) || (message.createdAt as any));
        
        const embed = new MessageEmbed()
            embed.setColor("#2f3136")
            embed.setDescription(`🏓 **Ping** ${timeDiff}ms\n💓 **Heartbeat** ${Math.round(this.client.ws.ping)}ms`)
        sent.edit(embed);
    }
}