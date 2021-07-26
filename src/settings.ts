const Datastore = require("quick.db");

export class Settings {
    public users;
    public guildSettings;

    public default = {
        users: []
    };

    constructor() {
        this.users = new Datastore.table("users");
        this.guildSettings = new Datastore.table("guildsettings");
    }
}