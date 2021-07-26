import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { client } from "../bot";

export default class LevelCommand extends Command {
    constructor() {
        super('level', {
           aliases: ['level', 'lvl'] 
        });
    }

    exec(message: Message) {
        const settings = client.settings[message.author.id];

        const nearestNext = Math.round(settings.score / 30);
        const levelRequirement = (settings.level + 1 * 15) * (settings.level * 3);

        const pointsNeeded = Math.trunc(levelRequirement - settings.score) <= 0
            ? 0
            : Math.trunc(levelRequirement - settings.score)

        message.reply(`**Current level**: ${settings.level}\n**Current points**: ${Math.trunc(settings.score)}\n**Points needed to reach level ${settings.level + 1}**: ${pointsNeeded}`)
    }
}
