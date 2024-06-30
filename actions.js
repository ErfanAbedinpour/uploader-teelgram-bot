const { messages } = require('./message/messages');
//get file from user actions1(params) {
exports.get_code_send_file = async function(ctx) {
  const file_id = ctx.message.text
  const file = await fileModel.findOne({ file_id })
  if (!file) {
    return await ctx.reply('فایل مورد نظر پیدا نشد')
  }
  console.log('file path is', file.filePath)
  await ctx.replyWithPhoto({ source: `./photos/${file.filename}` })
}

//start actions functions
exports.startAction = async (ctx) => {
  ctx.reply(messages.startMsg)
  const isExsist = await userModel.findOne({ user_id: ctx.chat.id })
  if (!isExsist) {
    await userModel.create({
      user_id: ctx.chat.id,
      username: ctx.chat.username,
      files: []
    })
  }
}


