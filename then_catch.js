const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs = require('fs')
const path = require('path')
const { pipeline } = require("stream")
const archiver = require("archiver")
console.time('Время выполнения')

const getCatPic = (url) => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка сервера')
      }
      
      return new Promise((resolve, reject) => {
        let nameCatPic = `cat_${Math.random().toString(16).slice(2)}`

        pipeline(
          response.body,
          fs.createWriteStream(path.join(__dirname + '/images/', `${nameCatPic}.jpg`)),
          (error) => {
            if (error) {
              reject(new Error('Ошибка сервера' + error))
            } 
            else {
              console.log(nameCatPic)
              resolve(nameCatPic)
            }
          }
        )
      })
    })
}

const getBufferPic = nameCatPics => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname + '/images/' + nameCatPics + '.jpg'), (error, bufferData) => {
      if (error) {
        reject(new Error('Не удалось прочитать файл' + error))
      }

      resolve(bufferData)
    })
  })
}

const createZIPFile = (bufferDatas, nameCatPic) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream('./images/catPic.zip')
    const archive = archiver("zip", {
      zlib: { level: 9 },
    })

    // Отлавливаем ошибки в процессе создания архива
    archive.on("error", (error) => {
      reject(new Error('Не удалось создать архив' + error))
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
      resolve(console.timeEnd('Время выполнения'))
    })
  })
}

Promise.all([
  getCatPic('https://cataas.com/cat'), 
  getCatPic('https://cataas.com/cat')
])
  .then((nameCatPics) => {
    Promise.all(nameCatPics.map((nameCatPic) => {
      return getBufferPic(nameCatPic)
    }))
      .then((getBufferData) => {
        createZIPFile(getBufferData, nameCatPics)
      })
  })
  .catch((error) => {
    console.error(error)
  })