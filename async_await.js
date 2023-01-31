const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
console.time('Время выполнения')

const getCatPic = async (url) => {
  let createFile

  try {
    const firstRespondAPIPic = await fetch(url)
    let firstNameCatPic = `cat_${Math.random().toString(16).slice(2)}`
    createFile = await fs.createWriteStream(path.join(__dirname + `/images/${firstNameCatPic}.jpg`))
    firstRespondAPIPic.body.pipe(createFile)
    console.log(firstNameCatPic)

    const secondRespondAPIPic = await fetch(url)
    let secondNameCatPic = `cat_${Math.random().toString(16).slice(2)}`
    createFile = await fs.createWriteStream(path.join(__dirname + `/images/${secondNameCatPic}.jpg`))
    secondRespondAPIPic.body.pipe(createFile)
    console.log(secondNameCatPic)

    createFile.on('finish', async () => {
      return await createZIPFile([firstNameCatPic, secondNameCatPic])
    })

    createFile.on('error', () => {
      throw new Error('Не удалось сохранить файл')
    })
  }
  catch (error) {
    console.error(error)
  }
}

const createZIPFile = async (nameCatPics) => {
  const zip = new AdmZip()

  try {
    await nameCatPics.forEach(nameCatPic => {
      fs.readFile(path.join(__dirname + '/images/' + nameCatPic + '.jpg'), (error, data) => {
        if (error) {
          throw new Error('Не удалось получить данные из файлов')
        }

        zip.addFile(nameCatPic + '.jpg', Buffer.from(data))
        zip.writeZip('./images/catPic.zip')
      })
    })

    console.timeEnd('Время выполнения')
  }
  catch (error) {
    console.error(error)
  }
}

getCatPic('https://cataas.com/cat')