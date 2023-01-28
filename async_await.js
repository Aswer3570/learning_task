const http = require('http')
const https = require('node:https')
const PORT = process.env.PORT ?? 3001
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
let time = performance.now()

const getCatPic = async (url) => {
  let nameCatPic = ''

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode != 200) {
        reject(new Error('Ошибка сервера'))
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
          reject(new Error('Ошибка сервера'))
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

const getNamePic = async () => {
  try {
    // Получаем имя изображения
    return await fs.readdir('./images/', (error, files) => {
      if (error) {
        throw new Error('Получить имя файлов не удалось')
      }

      createZIPFile(files)
    })
  } catch (error) {
    console.error(error)
  }
}

const createZIPFile = async files => {
  const zip = new AdmZip()

  time = performance.now() - time
  console.log(`Время выполнения: ${time}`)

  try {
    return await files.forEach(file => {
      // Получаем данные из изображения
      fs.readFile(path.join(__dirname + '/images/' + file), (error, data) => {
        if (error) {
          throw new Error('Получить данные из файлов не удалось')
        }
    
        // Создаём файл и заполняем его данными из Буфера
        zip.addFile(file, data)
        // Создаём архив и заполняем созданным файлом
        zip.writeZip('./images/catPic.zip')
      })
    })
  }
  catch (error) {
    console.error(error)
  }
}

getCatPic('https://cataas.com/cat')

http.createServer((req, res) => {

}).listen(PORT, () => {
  console.log(`Server run on ${PORT}...`)
})