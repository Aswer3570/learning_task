const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
console.time('Время выполнения')

const getCatPic = (url) => {
  let createFile

  const firstRespondAPIPic = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка сервера')
      }

      return new Promise((resolve, reject) => {
        firstNameCatPic = `cat_${Math.random().toString(16).slice(2)}`
        
        createFile = fs.createWriteStream(path.join(__dirname + `/images/${firstNameCatPic}.jpg`))
        response.body.pipe(createFile)
        console.log(firstNameCatPic)

        createFile.on('finish', () => {
          resolve(firstNameCatPic)
        })
        createFile.on('error', () => {
          reject(new Error('Не удалось сохранить файл'))
        })
      })
    })

  const secondRespondAPIPic = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка сервера')
      }

      return new Promise((resolve, reject) => {
        secondNameCatPic = `cat_${Math.random().toString(16).slice(2)}`

        createFile = fs.createWriteStream(path.join(__dirname + `/images/${secondNameCatPic}.jpg`))
        response.body.pipe(createFile)
        console.log(firstNameCatPic)

        createFile.on('finish', () => {
          resolve(secondNameCatPic)
        })
        createFile.on('error', () => {
          reject(new Error('Не удалось сохранить файл'))
        })
      })
    })

  Promise.all([firstRespondAPIPic, secondRespondAPIPic])
    .then((nameCatPic) => {
      return createZIPFile(nameCatPic)
    })
    .catch((error) => {
      console.error(error)
    })
}

const createZIPFile = nameCatPics => {
  let overall = []
  
  nameCatPics.forEach(nameCatPic => {
    const getDataPic = new Promise((resolve, reject) => {
      // Получаем данные из изображения
      fs.readFile(path.join(__dirname + '/images/' + nameCatPic + '.jpg'), (error, data) => {
        if (error) {
          reject(new Error('Не удалось получить данные из файлов'))
        }

        resolve([nameCatPic, data])
      })
    })
    overall.push(getDataPic)
  })
  
  Promise.all(overall)
    .then((dataCatPic) => {
      const zip = new AdmZip()

      dataCatPic.forEach(data => {
        zip.addFile(data[0] + '.jpg', Buffer.from(data[1]))
      })

      zip.writeZip('./images/catPic.zip')

      console.timeEnd('Время выполнения')
    })
    .catch(error => console.error(error))
}

getCatPic('https://cataas.com/cat')