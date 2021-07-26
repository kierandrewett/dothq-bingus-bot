import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import { client } from "../bot";

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

        let score = 0;

        score += message.content.substr(
            0, 
            (Math.floor(Math.random() * (Math.floor(50) - Math.ceil(1) + 1)) + Math.ceil(1))
        ).length * 0.03;

        console.log(message.mentions.users.size <= 2);
        if(message.mentions.users.size <= 2) {
            score += message.mentions.users.size / 10;
        } else {
            score -= message.mentions.users.size / (Math.random() * 10);
            score -= message.mentions.users.size / (Math.random() * 10);
        }
        score -= message.mentions.roles.size / 30;

        if(
            message.content.toLowerCase().includes("bingus") ||
            message.content.toLowerCase().includes("bigus") ||
            message.content.toLowerCase().includes("floppa sucks") ||
            message.content.toLowerCase().includes("floper sucks")
        ) {
            score += (Math.floor(Math.random() * (Math.floor(1) - Math.ceil(0.05) + 1)) + Math.ceil(0.05))
        }

        const random = Math.random();

        if(random <= 0.05) score += Math.random();

        const userSettings = client.settings[message.author.id] || {
            score: 0
        };

        client.settings[message.author.id] = {
            ...userSettings,
            score: userSettings.score + score
        }
    }
}