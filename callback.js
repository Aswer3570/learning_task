const http = require('http')
const https = require('node:https')
const PORT = process.env.PORT ?? 3001
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
let time = performance.now()

const getCatPic = (url, getNamePicCallback) => {
  let nameCatPic = ''

  // Выполняем первый запрос
  https.get(url, function(responseFirst){
    if (responseFirst.statusCode == 200) {
      nameCatPic = `cat_${new Date().valueOf()}`

      // Берём сгенерирование название и создаём файл
      responseFirst.pipe(fs.createWriteStream(path.join(__dirname + '/images/', `${nameCatPic}.jpg`)))

      // Выводим название сгенерированного файла
      console.log(nameCatPic)

      responseFirst.on('end', function() {
        // Выполняем второй запрос
        https.get(url, function(responseSecond){
          if (responseSecond.statusCode == 200) {
            nameCatPic = `cat_${new Date().valueOf()}`

            // Берём сгенерирование название и создаём файл
            responseSecond.pipe(fs.createWriteStream(path.join(__dirname + '/images/', `${nameCatPic}.jpg`)))

            // Выводим название сгенерированного файла
            console.log(nameCatPic)

            responseSecond.on('end', function() {
              // Вызываем callback
              getNamePicCallback(createZIPFile)
            })
          }
          else {
            console.error('Ошибка, файл не доступен')
          }
        })
      })
    }
    else {
      console.error('Ошибка, файл не доступен')
    }
  })
}

const getNamePic = (createZIPFileCallback) => {
  // Получаем имя изображения
  fs.readdir('./images/', (error, files) => {
    createZIPFileCallback(error, files)
  })
}

const createZIPFile = (error, files) => {
  const zip = new AdmZip()

  if (error) {
    console.error(error)
  }
  else {
    time = performance.now() - time
    console.log(`Время выполнения: ${time}`)
    files.forEach(file => {
      // Получаем данные из изображения
      fs.readFile(path.join(__dirname + '/images/' + file), function(error, data) {
        if (error) {
          console.error(error)
        }
        else {
          // Записываем данные в Буфер
          const stringBuf = Buffer.from(data)
      
          // Создаём файл и заполняем его данными из Буфера
          zip.addFile(file, Buffer.from(stringBuf))
          // Создаём архив и заполняем созданным файлом
          zip.writeZip('./images/catPic.zip')
        }
      })
    })
  }
}

getCatPic('https://cataas.com/cat', getNamePic)

http.createServer((req, res) => {

}).listen(PORT, () => {
  console.log(`Server run on ${PORT}...`)
})