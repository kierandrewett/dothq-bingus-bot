import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

export default class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        })
    }

    exec(message: Message) {
        const blacklist = ['81440962496172032'];
        return blacklist.includes(message.author.id);
    }
}