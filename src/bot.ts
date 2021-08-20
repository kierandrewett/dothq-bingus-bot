import { 
    AkairoClient, 
    CommandHandler, 
    InhibitorHandler, 
    ListenerHandler 
} from "discord-akairo";

import { config } from "dotenv";
import { resolve } from "path";

import { Settings } from "./settings";

config();

class BingusBot extends AkairoClient {
    public commandHandler: CommandHandler;
    public inhibitorHandler: InhibitorHandler;
    public listenerHandler: ListenerHandler

    public settings: Settings;

    constructor() {
        super({
            ownerID: ["217562587938816000", "381541244360327168", "249448403803570176", "277822562116042753"],
            allowedMentions: {
                parse: [],
                users: [],
                roles: [],
                repliedUser: false,
            },
            partials: ["REACTION", "MESSAGE", "CHANNEL", "GUILD_MEMBER", "USER"],
            intents: [
                "GUILDS", 
                "GUILD_MEMBERS", 
                "GUILD_VOICE_STATES", 
                "GUILD_BANS", 
                "GUILD_INVITES", 
                "GUILD_MESSAGES", 
                "GUILD_MESSAGE_REACTIONS", 
                "GUILD_WEBHOOKS", 
                "DIRECT_MESSAGES", 
                "GUILD_VOICE_STATES"
            ]
        });

        this.settings = new Settings();

        this.commandHandler = new CommandHandler(this, {
            directory: resolve(__dirname, "commands"),
            prefix: "-",
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilSweepInterval: 0,
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: resolve(__dirname, "inhibitors")
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: resolve(__dirname, "listeners")
        });

        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.inhibitorHandler.loadAll();
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();

        process.on("uncaughtException", (e) => {
            console.log(e)
        })
    }
}

export const client = new BingusBot();

client.login(process.env.TOKEN);
