const http = require('http')
const https = require('node:https')
const PORT = process.env.PORT ?? 3001
const fs = require('fs')
const path = require('path')
// const request = require('request')
const AdmZip = require('adm-zip')
let time = performance.now()

function getCatPic(url, callback) {
  for (let i = 1; i <= 2; i++) {
    // Получаем название для файлов
    let nameCatPic = `cat_${new Date().valueOf()}`

    https.get(url, function(response) {
      if (response.statusCode == 200) {
        // Берём сгенерирование название и создаём файл
        response.pipe(fs.createWriteStream(path.join(__dirname + '/images/', `${nameCatPic}.jpg`)))
        // Выводим название сгенерированного файла
        console.log(nameCatPic)

        console.log('Работает')

        // Вызываем callback когда будет закончена загрузка изображений
        response.on('end', function() {
          callback()

          console.log('Запустили callback')
        })
      }
      else {
        console.error('Ошибка, файл не доступен')
      }
    })
    .on('error', (error) => {
      console.error(error)
    })
  }
}

function createFile() {
  const zip = new AdmZip()

  // Получаем имя изображения
  fs.readdir('./images/', (error, files) => {
    if (error) {
      console.error(error)
    } 
    else {
      console.log(files)

      files.forEach(file => {
        // Получаем данные из изображения
        fs.readFile(path.join(__dirname + '/images/' + file), function(error, data) {
          if (error) {
            console.error(err)
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
  })
}

getCatPic('https://meduza.io/impro/mDAiOCr_DkL0j46J66KdPK4n64Hqlxxzk_9FVcKtYPg/fill/1960/0/ce/1/aHR0cHM6Ly9tZWR1/emEuaW8vaW1hZ2Uv/YXR0YWNobWVudHMv/aW1hZ2VzLzAwOC82/ODkvMDM1L29yaWdp/bmFsL0VxbHZVNW9u/R01MX0lkd3Boc25u/SFEuanBn.webp', createFile)

time = performance.now() - time
console.log(`Время выполнения: ${time}`)

http.createServer((req, res) => {

}).listen(PORT, () => {
  console.log(`Server run on ${PORT}...`)
})