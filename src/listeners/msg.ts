import { Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../bot";

export default class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message: Message) {
        const defaults = {
            score: 0,
            level: 1,
            history: []
        };

        if(!client.settings[message.author.id]) {
            client.settings[message.author.id] = defaults;
        }

        if(!this.client.user) return;

        if(
            message.author.id == this.client.user.id ||
            message.author.bot ||
            !message.content
        ) return;

        let score = 0;

        if(message.content.split(" ")[0].match(/(!|-|fire|!!!|!!|--|---|<|>|'|"|;|:|\[|\]|\$|#|@|%|\^|&|\*|\(|\))([a-zA-Z0-9]+)/)) {
            console.log("contained common bot prefix, aborting...")
            return;
        }

        score += message.content.substr(
            0, 
            (Math.floor(Math.random() * (Math.floor(50) - Math.ceil(1) + 1)) + Math.ceil(1))
        ).length * 0.03;

        if(message.mentions.users.size <= 2 && message.mentions.users.size !== 0) {
            score += message.mentions.users.size / 10;
        } else {
            score -= message.mentions.users.size / (Math.random() * 10);
            score -= message.mentions.users.size / (Math.random() * 10);
        }
        score -= message.mentions.roles.size / 30;

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
                score += (Math.floor(Math.random() * (Math.floor(0.5) - Math.ceil(0.05) + 1)) + Math.ceil(0.05))
            }
        }

        const random = Math.random();

        if(random <= 0.05) score += Math.random();

        client.settings[message.author.id] = {
            ...defaults,
            ...client.settings[message.author.id],
            score: client.settings[message.author.id].score + score
        }

        const nearestNext = Math.round(client.settings[message.author.id].score / 30);
        const levelRequirement = (client.settings[message.author.id].level + 1 * 15) * (client.settings[message.author.id].level * 3);

        if(
            Math.trunc(client.settings[message.author.id].score) >= levelRequirement &&
            !client.settings[message.author.id].history.includes(nearestNext)
        ) {
            client.settings[message.author.id] = {
                ...client.settings[message.author.id],
                level: nearestNext,
                history: [...client.settings[message.author.id].history, nearestNext]
            }

            const embed = new MessageEmbed();
                embed.setColor("#2f3136")
                embed.setTitle(`🆙 You have leveled up to Level ${nearestNext}, ${message.author.username}!`)

            message.channel.send(embed);
            console.log(`Level up: ${message.author.tag} -> level ${nearestNext}`)
        }
    }
}