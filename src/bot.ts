import { 
    AkairoClient, 
    CommandHandler, 
    InhibitorHandler, 
    ListenerHandler 
} from "discord-akairo";

import { config } from "dotenv";

config();

class BingusBot extends AkairoClient {
    public commandHandler: CommandHandler;
    public inhibitorHandler: InhibitorHandler;
    public listenerHandler: ListenerHandler

    constructor() {
        super({
            ownerID: ["217562587938816000", "381541244360327168", "249448403803570176", "277822562116042753"]
        }, {
            disableMentions: 'everyone'
        });

        this.commandHandler = new CommandHandler(this, {
            directory: './commands/',
            prefix: '?'
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './inhibitors/'
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });
    }
}

const client = new BingusBot();

client.login(process.env.TOKEN);
