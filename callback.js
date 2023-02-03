const https = require('https')
const fs = require('fs')
const path = require('path')
const { pipeline } = require("stream")
const archiver = require("archiver")
console.time('Время выполнения')

const getCatPic = (url, callback) => {
  https.get(url, (response) => {
    if (response.statusCode != 200) {
      return callback(new Error('Ошибка сервера'))
    }

    let nameCatPic = `cat_${Math.random().toString(16).slice(2)}`
    pipeline(
      response,
      fs.createWriteStream(path.join(__dirname + '/images/', `${nameCatPic}.jpg`)),
      (error) => {
        if (error) {
          return callback(new Error('Не удалось сохранить файл: ' + error))
        } 
        else {
          console.log(nameCatPic)
          callback(null, nameCatPic)
        }
      }
    )
  })
}

const getBufferPic = (catNamePics, callback) => {
  fs.readFile(path.join(__dirname + '/images/' + catNamePics[0] + '.jpg'), (error, firstBufferData) => {
    if (error) {
      return callback(new Error('Не удалось прочитать файл: ' + error))
    }

    fs.readFile(path.join(__dirname + '/images/' + catNamePics[1] + '.jpg'), (error, secondBufferData) => {
      if (error) {
        return callback(new Error('Не удалось прочитать файл: ' + error))
      }

      callback(null, [firstBufferData, secondBufferData])
    })
  })
}

const createZIPFile = (bufferDatas, nameCatPic, callback) => {
  const output = fs.createWriteStream('./images/catPic.zip')
  const archive = archiver("zip", {
    zlib: { level: 9 },
  })

  // Отлавливаем ошибки в процессе создания архива
  archive.on("error", (error) => {
    return callback(new Error('Не удалось создать архив: ' + error))
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
    callback(console.timeEnd('Время выполнения'))
  })
}

const allCatPic = (callback) => {
  callback('https://cataas.com/cat', (error, firstNameCatPic) => {
    if (error) {
      return console.error(error)
    }

    callback('https://cataas.com/cat', (error, secondNameCatPic) => {
      if (error) {
        return console.error(error)
      }

      getBufferPic([firstNameCatPic, secondNameCatPic], (error, bufferData) => {
        if (error) {
          return console.error(error)
        }

        createZIPFile(bufferData, [firstNameCatPic, secondNameCatPic], (error) => {
          if (error) {
            return console.error(error)
          }
        }) 
      })
    })
  })
}

allCatPic(getCatPic)