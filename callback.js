const https = require('https')
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
console.time('Время выполнения')

const getCatPic = (url, callback) => {
  // Выполняем первый запрос
  https.get(url, (responseFirst) => {
    if (responseFirst.statusCode != 200) {
      return callback(new Error('Ошибка сервера'))
    }
      
    let firstNameCatPic = `cat_${Math.random().toString(16).slice(2)}`
    responseFirst.pipe(fs.createWriteStream(path.join(__dirname + '/images/', `${firstNameCatPic}.jpg`)))
    console.log(firstNameCatPic)

    responseFirst.on('end', () => {
      // Выполняем второй запрос
      https.get(url, (responseSecond) => {
        if (responseSecond.statusCode != 200) {
          return callback(new Error('Ошибка сервера'))
        }
            
        let secondNameCatPic = `cat_${Math.random().toString(16).slice(2)}`
        responseSecond.pipe(fs.createWriteStream(path.join(__dirname + '/images/', `${secondNameCatPic}.jpg`)))
        console.log(secondNameCatPic)

        responseSecond.on('end', () => {
          callback(null, [firstNameCatPic, secondNameCatPic])
        })
        responseSecond.on('error', () => {
          return callback(new Error('Не удалось сохранить файл'))
        })
      })
    })
    responseFirst.on('error', () => {
      return callback(new Error('Не удалось сохранить файл'))
    })
  })
}

const createZIPFile = (catNamePics) => {
  const zip = new AdmZip()

  catNamePics.forEach(catNamePic => {
    // Получаем данные из изображения
    fs.readFile(path.join(__dirname + '/images/' + catNamePic + '.jpg'), (error, data) => {
      if (error) {
        return console.error(new Error('Не удалось получить данные из файлов'))
      }
      
      // Создаём файл и заполняем его данными из Буфера
      zip.addFile(catNamePic + '.jpg', Buffer.from(data))
      // Создаём архив и заполняем созданным файлом
      zip.writeZip('./images/catPic.zip')
    })
  })

  console.timeEnd('Время выполнения')
}

getCatPic('https://cataas.com/cat', (error, nameCatPic) => {
  if (error) {
    console.error(error)
  }
  else {
    createZIPFile(nameCatPic)
  }
})