import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class HelpCommand extends Command {
    public constructor() {
        super('help', {
            aliases: ['help', 'h', 'helpme', 'ihavefallenandicantgetup'],
            regex: new RegExp(`^<@!?522876718957068301>$`)
        });
    }

    public async exec(message: Message) {
        let embed = new MessageEmbed()
            .setTitle(`<:bingusbot:869317726529810512>  Hi! I'm Bingus!`)
            .setDescription(`I'm **Bingus**, the bot that powers the Dot Community.\n\nThe prefix for all commands here is \`-\`.\n__\n__`)
            .addField("📘 General", "`ping, help`")
            .addField("🆙 Levels", "`level`")
            .addField("💡 Asana", "`todo, delete-todo`")
            .addField("👀 Administrative", "`eval`\n__\n__")
            .setColor(`${message.guild?.me?.displayHexColor}` as any)
            .setTimestamp(Date.now())
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
        message.channel.send({ embeds: [embed] })     
    }
}