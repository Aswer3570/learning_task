const http = require('http')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const PORT = process.env.PORT ?? 3001
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
let time = performance.now()

const getCatPic = (url) => {
  const firstRespondAPIPic = fetch(url)
    .then((data) => {
      return data
    })

  const secondRespondAPIPic = fetch(url)
    .then((data) => {
      return data
    })

  Promise.all([firstRespondAPIPic, secondRespondAPIPic])
    .then((apiData) => {
      nameCatPic = `cat_${Math.random().toString(16).slice(2)}`

      createFile = fs.createWriteStream(path.join(__dirname + `/images/${nameCatPic}.jpg`))
      apiData[0].body.pipe(createFile)
      console.log(nameCatPic)

      createFile.on('finish', () => {
        time = performance.now() - time
        
        nameCatPic = `cat_${Math.random().toString(16).slice(2)}`
        createFile = fs.createWriteStream(path.join(__dirname + `/images/${nameCatPic}.jpg`))
        apiData[1].body.pipe(createFile)
        console.log(nameCatPic)

        createFile.on('finish', () => {
          time = performance.now() - time
      
          getNamePic()
        })
      })
    })
    .catch((error) => {
      console.error(`Ошибка сервера: ${error}`)
    })
}

const getNamePic = () => {
  return new Promise((resolve, reject) => {
    // Получаем имя изображения
    fs.readdir('./images/', (error, files) => {
      if (error) {
        reject(new Error('Получить имя файлов не удалось'))
      }

      time = performance.now() - time
      resolve(files)
    })
  })
  .then(files => {
    createZIPFile(files)
  })
  .catch(error => console.error(error))
}

const createZIPFile = files => {
  return new Promise((resolve, reject) => {
    const zip = new AdmZip()
    
    files.forEach(file => {
      // Получаем данные из изображения
      fs.readFile(path.join(__dirname + '/images/' + file), (error, data) => {
        if (error) {
          reject(new Error('Получить данные из файлов не удалось'))
        }
    
        // Создаём файл и заполняем его данными из Буфера
        zip.addFile(file, Buffer.from(data))
        // Создаём архив и заполняем созданным файлом
        zip.writeZip('./images/catPic.zip')

        time = performance.now() - time
      })
    })

    console.log(`Время выполнения: ${time}`)
  })
  .catch(error => console.error(error))
}

getCatPic('https://cataas.com/cat')

http.createServer((req, res) => {

}).listen(PORT, () => {
  console.log(`Server run on ${PORT}...`)
})