import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { client } from "../bot";
const vibrant = require("node-vibrant");

const stfuforabit = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class PrayCommand extends Command {
    constructor() {
        super('pray', {
           aliases: ['pray'],
           args: [
                {
                    id: 'gift',
                    match: 'rest'
                }
            ]
        });
    }

    async exec(message: Message, args: any) {
        const name = message.guild?.me?.nickname as any;
        const avatar = message.client?.user?.displayAvatarURL() as any;

        if(!args.gift) {
            const embed = new MessageEmbed();
                embed.setAuthor(name, avatar)
                embed.setColor(`${message.guild?.me?.displayHexColor}` as any)
                embed.setTitle(`🤬 ${name} is displeased.`)
                embed.setDescription(`You did not provide a gift to ${name}`)
            return message.channel.send({ embeds: [embed] });
        }

        const embed = new MessageEmbed();
            embed.setColor(`${message.guild?.me?.displayHexColor}` as any)
            embed.setTitle(`🤔 ${name} is thinking...`)
        const msg = await message.reply({ embeds: [embed] });
        await stfuforabit(1500);

        const chance = Math.random();

        if(
            (
                chance > 0.5 || 
                ((Math.random() > 0.2) && args.gift.toLowerCase().includes("bingus")) ||
                args.gift.toLowerCase().includes("dot browser") ||
                args.gift.toLowerCase().includes("dot")
            ) && !args.gift.toLowerCase().includes("chrome")
        ) {
            const emoji = [
                "😌",
                "😇",
                "😊",
                "🤭",
                "😃"
            ]

            const adjectives = [
                "is pleased with",
                "is thankful for",
                "is happy with",
                "is grateful for",
                "appreciates",
                "likes"
            ]

            const embed = new MessageEmbed();
                embed.setAuthor(name, avatar)
                embed.setColor(`${message.guild?.me?.displayHexColor}` as any)
                embed.setTitle(`${emoji[Math.floor(Math.random() * emoji.length)]} ${name} ${adjectives[Math.floor(Math.random() * adjectives.length)]} your gift.`)
                embed.setDescription(`${name} appreciates your "${args.gift}" gift.`)
            return msg.edit({ embeds: [embed] });
        } else {
            const emoji = [
                "🤬",
                "😓",
                "😠",
                "😫",
                "🤡",
                "🤮"
            ]

            const adjectives = [
                "is unhappy with",
                "dislikes",
                "hates",
                "is disgusted with",
                "is sick of",
                "is displeased with",
                "is annoyed with"
            ]

            const embed = new MessageEmbed();
                embed.setAuthor(name, avatar)
                embed.setColor(`${message.guild?.me?.displayHexColor}` as any)
                embed.setTitle(`${emoji[Math.floor(Math.random() * emoji.length)]} ${name} ${adjectives[Math.floor(Math.random() * adjectives.length)]} your gift.`)
                embed.setDescription(`${name} dislikes your choice of "${args.gift}" as a gift.`)
            return msg.edit({ embeds: [embed] });
        }
    }
}
