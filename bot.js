const { Telegraf } = require("telegraf");
const axios = require("axios");
const bot = new Telegraf(process.env.BOT_TOKEN);
const admin_username = "@your_username";

bot.command("start", ctx => {
    bot.telegram.sendMessage(
        ctx.chat.id,
        "I can help you to converting number system. Just send me `/convert [from_base] [to_base] [number]`\n\n⁉️ *Supporting number system:*\n- Binary (2)\n- Octal (8)\n- Decimal (10)\n- Hexadecimal (16)\n\nReach the administrator by pressing /feedback if you have any question.",
        {
            reply_to_message_id: ctx.message.message_id,
		    parse_mode: "Markdown"
		}
    );
});

bot.command("feedback", ctx => {
    bot.telegram.sendMessage(
        ctx.chat.id,
        "📥 Give your feedback, suggestion and criticism about this bot to " + admin_username + ". You can also report bugs or you can also provide suggestions for additional bot functions.",
        {
            reply_to_message_id: ctx.message.message_id,
		    parse_mode: "Markdown"
		}
     );
});

function needParams(ctx) {
	bot.telegram.sendMessage(
	    ctx.chat.id,
	    "You should use:\n`/convert [from_base] [to_base] [number]`\n\n⁉️ *Supporting number system:*\n- Binary (2)\n- Octal (8)\n- Decimal (10)\n- Hexadecimal (16)\n\nExample if you want convert number of `0010001011` from *binary* to *hexadecimal*, you should send `/convert 2 16 0010001011`. How easy is it?",
	    {
            reply_to_message_id: ctx.message.message_id,
		    parse_mode: "Markdown"
		}
    );
}

bot.command("convert", ctx => {
    var from_base = ctx.update.message.text.split(" ")[1];
    var to_base = ctx.update.message.text.split(" ")[2];
    var number = ctx.update.message.text.split(" ")[3];

    if (!from_base) {
        needParams(ctx);
        return
    }

    if (!to_base) {
        needParams(ctx);
        return
    }

    if (!number) {
        needParams(ctx);
        return
    }

    if (from_base != 2 && from_base != 8 && from_base != 10 && from_base != 16) {
        needParams(ctx);
        return
    }

    if (to_base != 2 && to_base != 8 && to_base != 10 && to_base != 16) {
        needParams(ctx);
        return
    }

    async function convertThis(ctx) {
        let res = await axios.get("https://networkcalc.com/api/binary/" + number + "?from=" + from_base + "&to=" + to_base);
        let json = res.data;

        var from_num = json.from;
        var to_num = json.to;
        var original = json.original;
        var converted = json.converted;

        if (!from_num) {
            bot.telegram.sendMessage(
                ctx.chat.id,
                "*Error while converting unit.*",
                {
                    reply_to_message_id: ctx.message.message_id,
                    parse_mode: "Markdown"
                }
            );
            return
        }

        var from_name;
        var to_name;

        if (from_num == 2) {
            from_name = "Binary";
        }

        if (from_num == 8) {
            from_name = "Octal";
        }

        if (from_num == 10) {
            from_name = "Decimal";
        }


        if (from_num == 16) {
            from_name = "Hexadecimal";
        }

        if (to_num == 2) {
            to_name = "Binary";
        }

        if (to_num == 8) {
            to_name = "Octal";
        }

        if (to_num == 10) {
            to_name = "Decimal";
        }


        if (to_num == 16) {
            to_name = "Hexadecimal";
        }

        bot.telegram.sendMessage(
            ctx.chat.id,
            "🔄 *" + from_name + "* » *" + to_name + "*\n\nResult status:\n`" + original + "` » `" + converted + "`\n\n*Thank you for using this bot!*",
            {
                reply_to_message_id: ctx.message.message_id,
                parse_mode: "Markdown"
            }
        );
    }

    convertThis(ctx);
});

bot.launch();
