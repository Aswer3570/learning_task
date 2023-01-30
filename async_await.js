const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
let time = performance.now()

const getCatPic = async (url) => {
  let nameCatPic

  try {
    const firstRespondAPIPic = await fetch(url)
    
    nameCatPic = `cat_${Math.random().toString(16).slice(2)}`
    firstCreateFile = fs.createWriteStream(path.join(__dirname + `/images/${nameCatPic}.jpg`))
    firstRespondAPIPic.body.pipe(firstCreateFile)
    console.log(nameCatPic)

    firstCreateFile.on('finish', async () => {
      time = performance.now() - time
      
      try {
        const secondRespondAPIPic = await fetch(url)
        
        nameCatPic = `cat_${Math.random().toString(16).slice(2)}`
        secondCreateFile = fs.createWriteStream(path.join(__dirname + `/images/${nameCatPic}.jpg`))
        secondRespondAPIPic.body.pipe(secondCreateFile)
        console.log(nameCatPic)

        secondCreateFile.on('finish', () => {
          getNamePic()

          time = performance.now() - time
        })
      }
      catch (error) {
        console.error(error)
      }
    })
  }
  catch (error) {
    console.error(error)
  }
}

const getNamePic = () => {
  try {
    // Получаем имя изображения
    fs.readdir('./images/', (error, files) => {
      if (error) {
        throw new Error('Получить имя файлов не удалось')
      }

      createZIPFile(files)

      time = performance.now() - time
    })
  }
  catch (error) {
    console.error(error)
  }
}

const createZIPFile = files => {
  try {
    const zip = new AdmZip()

    files.forEach(file => {
      // Получаем данные из изображения
      fs.readFile(path.join(__dirname + '/images/' + file), (error, data) => {
        if (error) {
          throw new Error('Получить данные из файлов не удалось')
        }
  
        // Создаём файл и заполняем его данными из Буфера
        zip.addFile(file, Buffer.from(data))
        // Создаём архив и заполняем созданным файлом
        zip.writeZip('./images/catPic.zip')

        time = performance.now() - time
      })
    })

    console.log(`Время выполнения: ${time}`)
  }
  catch (error) {
    console.error(error)
  }
}

getCatPic('https://cataas.com/cat')