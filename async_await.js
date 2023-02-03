const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs = require('fs')
const path = require('path')
const { pipeline } = require("stream")
const archiver = require("archiver")
console.time('Время выполнения')

const getCatPic = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return reject(new Error('Ошибка сервера'))
      }

      let nameCatPic = `cat_${Math.random().toString(16).slice(2)}`

      await pipeline(
        response.body,
        fs.createWriteStream(path.join(__dirname + '/images/', `${nameCatPic}.jpg`)),
        (error) => {
          if (error) {
            return reject(new Error('Не удалось сохранить файл: ' + error))
          } 
          else {
            console.log(nameCatPic)
            resolve(nameCatPic)
          }
        }
      )
    }
    catch (error) {
      console.error(error)
    }
  })
}

const getBufferPic = async nameCatPic => {
  try {
    const bufferData = await fs.promises.readFile(path.join(__dirname + '/images/' + nameCatPic + '.jpg'))
    return Buffer.from(bufferData)
  }
  catch (error) {
    console.error('Не удалось прочитать файл: ' + error)
  }
}

const createZIPFile = (bufferDatas, nameCatPic) => {
  const output = fs.createWriteStream('./images/catPic.zip')
  const archive = archiver("zip", {
    zlib: { level: 9 },
  })

  // Отлавливаем ошибки в процессе создания архива
  archive.on("error", (error) => {
    throw new Error('Не удалось создать архив: ' + error)
  })

  // Записываем данные в поток
  archive.pipe(output)

  // Добавляем файлы в архив
  bufferDatas.forEach((bufferData, i) => {
    archive.append(bufferData, { name:  nameCatPic[i] + '.jpg'})
  })

  // Закрываем архив
  archive.finalize()

  // Отлавливаем завершение записи
  output.on("close", () => {
    return console.timeEnd('Время выполнения')
  })
}

const startGetCatPic = async () => {
  const catPic = await Promise.all([
    getCatPic('https://cataas.com/cat'), 
    getCatPic('https://cataas.com/cat')
  ])

  const bufferPic = await Promise.all(catPic.map((nameCatPic) => {
    return getBufferPic(nameCatPic)
  }))

  await createZIPFile(bufferPic, catPic)
}

startGetCatPic()










// const getCatPic = async (url) => {
//   let createFile

//   try {
//     const firstRespondAPIPic = await fetch(url)
//     let firstNameCatPic = `cat_${Math.random().toString(16).slice(2)}`
//     createFile = await fs.createWriteStream(path.join(__dirname + `/images/${firstNameCatPic}.jpg`))
//     firstRespondAPIPic.body.pipe(createFile)
//     console.log(firstNameCatPic)

//     const secondRespondAPIPic = await fetch(url)
//     let secondNameCatPic = `cat_${Math.random().toString(16).slice(2)}`
//     createFile = await fs.createWriteStream(path.join(__dirname + `/images/${secondNameCatPic}.jpg`))
//     secondRespondAPIPic.body.pipe(createFile)
//     console.log(secondNameCatPic)

//     createFile.on('finish', async () => {
//       return await createZIPFile([firstNameCatPic, secondNameCatPic])
//     })

//     createFile.on('error', () => {
//       throw new Error('Не удалось сохранить файл')
//     })
//   }
//   catch (error) {
//     console.error(error)
//   }
// }

// const createZIPFile = async (nameCatPics) => {
//   const zip = new AdmZip()

//   try {
//     await nameCatPics.forEach(nameCatPic => {
//       fs.readFile(path.join(__dirname + '/images/' + nameCatPic + '.jpg'), (error, data) => {
//         if (error) {
//           throw new Error('Не удалось получить данные из файлов')
//         }

//         zip.addFile(nameCatPic + '.jpg', Buffer.from(data))
//         zip.writeZip('./images/catPic.zip')
//       })
//     })

//     console.timeEnd('Время выполнения')
//   }
//   catch (error) {
//     console.error(error)
//   }
// }

// getCatPic('https://cataas.com/cat')