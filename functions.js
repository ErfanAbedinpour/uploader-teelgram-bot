//modules
const fs = require('fs');
const axios = require('axios');
const mongoose = require('mongoose')
const fileModel = require('./db/file.model')
const userModel = require('./db/user.model')
const utils = require('util')
//promisify a utils functions
const isExsist = utils.promisify(fs.exists)
const mkdir = utils.promisify(fs.mkdir)
// downlaod file from telegram
exports.download_file = async function(url, path) {
  try {
    if (!(await isExsist(path))) {
      await mkdir(path)
    }
    const writer = fs.createWriteStream(path)
    const response = await axios({
      method: 'get',
      url,
      responseType: 'stream',
    })

    return new Promise(function(resolve, reject) {
      response.data.pipe(writer)
      writer.on('finish', function() {
        writer.close()
        resolve(true)
      })
      writer.on('error', reject)
    })
  } catch (error) {
    throw error
  }
}

// normilize get input file from telegram
exports.normilize_input_file = async function(ctx, type) {
  const file_id = ctx.message[type].at(-1).file_id
  const fileFrmt = (await ctx.telegram.getFile(file_id)).file_path.split('.').at(-1)
  const filename = crypto.randomBytes(7).toString('hex');
  const downloadUrl = (await ctx.telegram.getFileLink(file_id)).href
  const filePath = path.join(__dirname, 'photos', `${filename.trimEnd()}.${fileFrmt.trimEnd()}`)
  return {
    url: downloadUrl,
    path: filePath,
    filename,
    frmt: fileFrmt
  }
}

//save file to db
exports.dbSave = async function(ctx, filePath, filename, frmt) {
  try {
    let user = await userModel.findOne({ user_id: ctx.chat.id });
    if (!user) {
      user = await userModel.create({
        user_id: ctx.chat.id,
        username: ctx.chat.username
      })
    }
    const file = await fileModel.create({
      filename: `${filename}.${frmt}`,
      user: user._id,
      file_id: filename,
      filePath: filePath
    })
    user.files.push(file._id)
    await user.save()
  } catch (error) {
    throw new Error('faild to save')
  }
}

//start db
exports.dbStart = async function(url) {
  try {
    await mongoose.connect(url)
  } catch (error) {
    throw new Error('faild to conenct to db')
  }
}

