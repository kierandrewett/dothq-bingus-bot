import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { client } from "../bot";
const vibrant = require("node-vibrant");

export default class LevelCommand extends Command {
    constructor() {
        super('level', {
           aliases: ['level', 'lvl'],
           args: [
                {
                    id: 'target',
                    type: 'user'
                }
            ]
        });
    }

    exec(message: Message, args: any) {
        const id = args.target ? args.target.id : message.author.id;

        const settings = client.settings.users.get(id);

        const levelRequirement = (settings.level + 1 * 15) * (settings.level * 3);

        const pointsNeeded = Math.trunc(levelRequirement - settings.points) <= 0
            ? 0
            : Math.trunc(levelRequirement - settings.points)

        const embed = new MessageEmbed();
            embed.setAuthor(message.member?.nickname || message.author.username, message.author.displayAvatarURL())
            embed.setColor(`#${message.guild?.me?.displayHexColor.toString()}`)
            embed.setTitle(`${message.author.username}'s Level`)
            embed.setDescription(`**🆙 Level** ${settings.level}

**🪙 Bingus Points** ${Math.trunc(settings.points)}

**➡ Points to Level ${settings.level+1}** ${pointsNeeded}`)
        message.reply({ embeds: [embed] });
    }
}
