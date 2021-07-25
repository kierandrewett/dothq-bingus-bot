import { AkairoClient } from "discord-akairo";

class BingusBot extends AkairoClient {
    constructor() {
        super({
            // Options for Akairo go here.
        }, {
            // Options for discord.js goes here.
        });
    }
}

const client = new BingusBot();

client.login('TOKEN');
