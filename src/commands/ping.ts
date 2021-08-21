import { Argument, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { lookup } from "dns";
import execa from "execa";
import { resolve } from "path"
import process from "process"
import ping from "ping"

const stfuforabit = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class PingCommand extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping'],

            args: [
                {
                    id: 'url',
                    match: 'rest'
                }
            ]
        });
    }

    public async exec(message: Message, args: any) {
        const hostname = args.url ? args.url : "discord.com";

        let dmsg: Message;

        const update = async (msg: string, ip: string) => {
            if(!dmsg) {
                dmsg = await message.channel.send({
                    content: `\`\`\`PING ${hostname} (${ip}) 56(84) bytes of data.${msg.toString().trim()}\`\`\``
                })
            } else {
                await dmsg.edit({
                    content: `\`\`\`${dmsg.content.replace(/\`\`\`/g, "")}\n${msg.toString().trim()}\`\`\``
                })
            }
        }

        lookup(hostname, async function(err: any, ip: string) {
            let d = Date.now();

            let data = ``;
            await update(data, ip);

            let times = new Set();

            for (let i = 0; i < 5; i++) {
                const res = await ping.promise.probe(ip, { timeout: 10000 })

                if(res.time) {
                    const time = res.time;
                    const content = `64 bytes from ${ip} (${ip}): icmp_seq=${i+1} ttl=58 time=${time} ms`;

                    times.add(time);
    
                    data = `${data}\n${content}`
                    await stfuforabit(Math.floor(Math.random() * (1000 - 200) + 200))
                    await update(data, ip);
                }
            }

            const min = Math.min(...Array.from(times) as any);
            const max = Math.max(...Array.from(times) as any);
            
            const tin = (num: number) => {
                const fix = (num: number) => {
                    if(num.toString().length >= 4) return num.toFixed(3);
                    return num.toString();
                }

                const n = fix(num);

                return n.split("00")[0];
            }

            data = `${data}\n\n--- ${ip} ping statistics ---`;
            data = `${data}\n5 packets transmitted, 5 received, 0% packet loss, time ${Date.now()-d}ms`;
            data = `${data}\nrtt min/avg/max/mdev = ${tin(min)}/${tin((min + max) / 2)}/${tin(max)}/${tin(max - min)} ms`
            await update(data, ip);
        });
    }
}