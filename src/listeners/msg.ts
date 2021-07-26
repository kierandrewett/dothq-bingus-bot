import { Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../bot";
import { responses } from "../shared/responses";

export default class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message: Message) {
        if(!this.client.user) return;

        if(
            message.author.id == this.client.user.id ||
            message.author.bot ||
            !message.content
        ) return;

        let points = 0;

        if(message.content.split(" ")[0].match(/^(!|-|fire|!!!|!!|--|---|<|>|'|"|;|:|\[|\]|\$|#|%|\^|&|\*|\(|\))([a-zA-Z0-9]+)$/)) {
            console.log("contained common bot prefix, aborting...")
            return;
        }

        points += message.content.substr(
            0, 
            (Math.floor(Math.random() * (Math.floor(50) - Math.ceil(1) + 1)) + Math.ceil(1))
        ).length * 0.03;

        if(message.mentions.users.size <= 2 && message.mentions.users.size !== 0) {
            points += message.mentions.users.size / 10;
        } else {
            points -= message.mentions.users.size / (Math.random() * 10);
            points -= message.mentions.users.size / (Math.random() * 10);
        }
        points -= message.mentions.roles.size / 30;

        if(
            message.content.toLowerCase().includes("bingus") && !message.content.toLowerCase().includes("bingus sucks") ||
            message.content.toLowerCase().includes("bigus") && !message.content.toLowerCase().includes("bigus sucks") ||
            message.content.toLowerCase().includes("bingus my beloved") && !message.content.toLowerCase().includes("bingus sucks") ||
            message.content.toLowerCase().includes("bigus my beloved") && !message.content.toLowerCase().includes("bigus sucks") ||
            message.content.toLowerCase().includes("floppa sucks") ||
            message.content.toLowerCase().includes("floper sucks") ||
            message.content.toLowerCase().includes("floppa bad") ||
            message.content.toLowerCase().includes("floper bad")
        ) {
            if(Math.random() <= 0.3) {
                points += (Math.floor(Math.random() * (Math.floor(0.5) - Math.ceil(0.05) + 1)) + Math.ceil(0.05))
            }
        }

        const random = Math.random();

        if(random <= 0.05) points += Math.random();

        if(!client.settings.users.get(message.author.id)) {
            client.settings.users.set(message.author.id, {
                level: 1,
                points
            })
        }

        client.settings.users.set(`${message.author.id}.points`, points);

        const level = client.settings.users.get(`${message.author.id}.level`);

        const nearestNext = Math.round(points / 30);
        const levelRequirement = (level + 1 * 15) * (level * 3);

        if(
            Math.trunc(points) >= levelRequirement
        ) {
            const embed = new MessageEmbed();
                embed.setColor("#2f3136")
                embed.setTitle(`🆙 You have leveled up to Level ${nearestNext}, ${message.member?.nickname}!`)

            message.channel.send(embed);
            console.log(`Level up: ${message.author.tag} -> level ${nearestNext}`)
        }

        responses.forEach(resp => {
            if(message.content.toLowerCase().replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, "").match(resp.regex)) {
                if(resp.data) message.reply(resp.data);
                if(resp.emote) message.react(resp.emote);
            }
        })
    }
}