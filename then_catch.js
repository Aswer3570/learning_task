const http = require('http')
const https = require('node:https')
const PORT = process.env.PORT ?? 3001
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
let time = performance.now()

const getCatPic = (url) => {
  let nameCatPic = ''

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode != 200) {
        reject(new Error('Ошибка, файл не доступен'))
      }

      nameCatPic = `cat_${new Date().valueOf()}`

      // Берём сгенерирование название и создаём файл
      response.pipe(fs.createWriteStream(path.join(__dirname + '/images/', `${nameCatPic}.jpg`)))
      // Выводим название сгенерированного файла
      console.log(nameCatPic)

      resolve()
    })
  })
  .catch(error => console.error(error))
  .then(() => {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode != 200) {
          reject(new Error('Ошибка, файл не доступен'))
        }

        nameCatPic = `cat_${new Date().valueOf()}`

        // Берём сгенерирование название и создаём файл
        response.pipe(fs.createWriteStream(path.join(__dirname + '/images/', `${nameCatPic}.jpg`)))
        // Выводим название сгенерированного файла
        console.log(nameCatPic)

        resolve()
      })
    })
    .catch(error => console.error(error))
    .then(
      response => getNamePic()
    )
  })
}

const getNamePic = () => {
  return new Promise((resolve, reject) => {
    // Получаем имя изображения
    fs.readdir('./images/', (error, files) => {
      if (error) {
        reject(new Error('Получить имя файлов не удалось'))
      }

      resolve(files)
    })
  })
  .catch(error => console.error(error))
  .then(files => {
    createZIPFile(files)
  })
}

const createZIPFile = files => {
  const zip = new AdmZip()

  files.forEach(file => {
    return new Promise((resolve, reject) => {
      // Получаем данные из изображения
      fs.readFile(path.join(__dirname + '/images/' + file), (error, data) => {
        if (error) {
          reject(new Error('Получить данные из файлов не удалось'))
        }
        
        // Записываем данные в Буфер
        const stringBuf = Buffer.from(data)
    
        // Создаём файл и заполняем его данными из Буфера
        zip.addFile(file, Buffer.from(stringBuf))
        // Создаём архив и заполняем созданным файлом
        zip.writeZip('./images/catPic.zip')
      })

      resolve()
    })
    .catch(error => console.error(error))
    .then(() => {
      time = performance.now() - time
    })
  })

  console.log(`Время выполнения: ${time}`)
}

getCatPic('https://cataas.com/cat')


http.createServer((req, res) => {

}).listen(PORT, () => {
  console.log(`Server run on ${PORT}...`)
})