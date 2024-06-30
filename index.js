const { Telegraf } = require('telegraf');
const functions = require('./functions.js')
const actions = require('./actions.js')
require('dotenv').config()

//telegraf instance 
const bot = new Telegraf(process.env['BOT_TOKEN']);

//connected to DB
(async function() {
  await functions.dbStart(process.env['MONGO_URL'])
})();

//start bot action
bot.start(actions.startAction);

//bot actions
bot.on('photo', processBot('photo'))
bot.on('document', processBot('document'))
bot.on('audio', processBot('audio'))
bot.command('getFile', ctx => ctx.reply('کد فایل مورد نظر را ارسال کنید'))
bot.on('text', actions.get_code_send_file)
//processor
function processBot(type) {
  return async (ctx) => {
    const { url, path, filename, frmt } = await functions.normilize_input_file(ctx, type)
    try {
      const result = await functions.download_file(url, path)
      if (result) {
        try {
          await functions.dbSave(ctx, path, filename, frmt)
          await ctx.reply(`با موفقیت اپلود شد>
            کد شما:${filename}`)
          await ctx.reply('در صورت نداشتن کد امکان دریافت فایل وجود ندارد')
          return await ctx.deleteMessage(ctx.message.message_id)
        } catch (e) {
          throw new Error(e)
        }
      }

    } catch (err) {
      throw new Error(err)
    }
  }
}
//start bot
bot.launch(() => console.log('bot is running'))


