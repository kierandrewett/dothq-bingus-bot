import { Argument, Command } from "discord-akairo";
import { Message, MessageEmbed, MessageAttachment } from "discord.js";
import { inspect } from "util";
import puppeteer from "puppeteer";

export default class StreamCommand extends Command {
    public constructor() {
        super('stream', {
            aliases: ['stream'],
            args: [
                {
                    id: 'url',
                    type: 'string',
                    match: 'rest'
                }
            ]
        });
    }

    public async exec(message: Message, args: { url?: string }) {
        if(args.url) {
          if(args.url && (args.url as any).startsWith("http")) args.url = args.url
          else {
            args.url = `https://google.com/search?q=${args.url}`
          }
        }

        try {
          const parsed = new URL(args.url || "");

          if(
            parsed.hostname.includes("saco.ml") ||
            parsed.hostname.includes("glitch.me") ||
            message.content.toLowerCase().includes("sex") ||
            message.content.toLowerCase().includes("porn") ||
            message.content.toLowerCase().includes("hentai")
          ) return message.reply("no");

          const browser = await puppeteer.launch({ args: ['--no-sandbox', '--window-size=854,480'], defaultViewport: null });
          const page = await browser.newPage();

          await page.goto(args.url || "");

         await page.setViewport({ width: 0, height: 0 });

          const buff: any  = await page.screenshot();

          const img = new MessageAttachment(buff, "output.png");
          const msg: any = await message.channel.send(img)

          let int: any;

          msg.react('❌')

          const filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

          msg.awaitReactions({ filter, max: 1, time: 6000000, errors: ['time'] })
            .then((collected: any) => {
              const reaction = collected.first();

              clearInterval(int);
              message.reply("Cancelled")
            })
            .catch((collected: any) => {
              console.log(collected)
              message.reply("error 😭😭")
              clearInterval(int);
            });


          int = setInterval(async () => {
            const buff: any  = await page.screenshot();

            const img: any = new MessageAttachment(buff, "output.png");
            msg.edit({ attachments: [img] })
          }, 1000);
        } catch(e) {
          message.channel.send(e.message.substr(0, 1999));
        }
    }
}