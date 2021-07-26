import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        const owners = Array.from(this.client.ownerID);

        console.log(`Loaded ${this.client.user?.tag}`)
    }
}