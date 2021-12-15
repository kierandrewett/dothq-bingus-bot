import { Command } from "discord-akairo";
import { Message, MessageAttachment } from "discord.js";
const Docker = require("simple-dockerode");

const util = require('util');
const exec = util.promisify(require('child_process').exec);

export default class VmCommand extends Command {
    public constructor() {
        super('vm', {
            aliases: ['vm'],

            args: [
                {
                    id: 'data',
                    match: 'rest'
                },
            ]
        });
    }

    public async exec(message: Message, args: any) {
        try {
            args.data = 
`import math
import importlib

def sqrt(num):
    print(math.sqrt(num))

def p(d):
    print(d)

def fibo(limit=100):
    res = []

    a,b = 0, 1
    for i in range(0, limit):
        a, b = b, a + b
        res.append(b)

    p(res)

${args.data ? args.data.replace(/(ip|hosts\.allow|hosts\.deny|public ip|(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})/g, (m: any) => {
    return `print("You fucking donkey")\nquit()\n${m}`
}) : `p("Try putting some valid Python code")`}
`

            const docker = new Docker();
            const container = docker.getContainer("bingus-vm");

            container.exec(["ip", "link", "set", "eth0", "up"], {}, () => {
                container.exec(["python3", "-c", args.data], { stdout: true, stderr: true }, async (err: any, data: any) => {
                    if (data.stderr && data.stderr.length) return message.channel.send(`\`\`\`--- STACK TRACE ---\n${data.stderr}\`\`\``);
    
                    if(data.stdout.length > 2000) {
                        const attachment = new MessageAttachment(Buffer.from(data.stdout), "output.txt")
    
                        message.channel.send({ files: [attachment] });
                    } else {
                        message.channel.send(data.stdout)
                    }
                })
            });
        } catch(e) {
            message.channel.send(e as any).toString());
        }
    }
}