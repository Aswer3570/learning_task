const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs = require('fs')
const path = require('path')
const { pipeline } = require("stream")
const archiver = require("archiver")
console.time('Время выполнения')

const getCatPic = (url) => {
  return fetch(url)
    .then((response) => {
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
  getCatPic('https://meduza.io/impro/TTLKm8OruGF5gxn3d6bEhdOMm6Qx3lnFJ4OuzrGUkmg/fill/1300/0/ce/1/aHR0cHM6Ly9tZWR1/emEuaW8vaW1hZ2Uv/YXR0YWNobWVudHMv/aW1hZ2VzLzAwOC83/MTIvMDQ1L29yaWdp/bmFsL2VSZTJLYnFo/cnRWZ3VEZDVmUGFC/VEEuanBn.webp'), 
  getCatPic('https://meduza.io/impro/TTLKm8OruGF5gxn3d6bEhdOMm6Qx3lnFJ4OuzrGUkmg/fill/1300/0/ce/1/aHR0cHM6Ly9tZWR1/emEuaW8vaW1hZ2Uv/YXR0YWNobWVudHMv/aW1hZ2VzLzAwOC83/MTIvMDQ1L29yaWdp/bmFsL2VSZTJLYnFo/cnRWZ3VEZDVmUGFC/VEEuanBn.webp')
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













// const getCatPic = (url) => {
//   let createFile

//   const firstRespondAPIPic = fetch(url)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Ошибка сервера')
//       }

//       return new Promise((resolve, reject) => {
//         let firstNameCatPic = `cat_${Math.random().toString(16).slice(2)}`
        
//         createFile = fs.createWriteStream(path.join(__dirname + `/images/${firstNameCatPic}.jpg`))
//         response.body.pipe(createFile)
//         console.log(firstNameCatPic)

//         createFile.on('finish', () => {
//           resolve(firstNameCatPic)
//         })
//         createFile.on('error', () => {
//           reject(new Error('Не удалось сохранить файл'))
//         })
//       })
//     })

//   const secondRespondAPIPic = fetch(url)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Ошибка сервера')
//       }

//       return new Promise((resolve, reject) => {
//         let secondNameCatPic = `cat_${Math.random().toString(16).slice(2)}`

//         createFile = fs.createWriteStream(path.join(__dirname + `/images/${secondNameCatPic}.jpg`))
//         response.body.pipe(createFile)
//         console.log(secondNameCatPic)

//         createFile.on('finish', () => {
//           resolve(secondNameCatPic)
//         })
//         createFile.on('error', () => {
//           reject(new Error('Не удалось сохранить файл'))
//         })
//       })
//     })

//   Promise.all([firstRespondAPIPic, secondRespondAPIPic])
//     .then((nameCatPic) => {
//       return createZIPFile(nameCatPic)
//     })
//     .catch((error) => {
//       console.error(error)
//     })
// }

// const createZIPFile = nameCatPics => {
//   let overall = []
  
//   nameCatPics.forEach(nameCatPic => {
//     const getDataPic = new Promise((resolve, reject) => {
//       // Получаем данные из изображения
//       fs.readFile(path.join(__dirname + '/images/' + nameCatPic + '.jpg'), (error, data) => {
//         if (error) {
//           reject(new Error('Не удалось получить данные из файлов'))
//         }

//         resolve([nameCatPic, data])
//       })
//     })
//     overall.push(getDataPic)
//   })
  
//   Promise.all(overall)
//     .then((dataCatPic) => {
//       const zip = new AdmZip()

//       dataCatPic.forEach(data => {
//         zip.addFile(data[0] + '.jpg', Buffer.from(data[1]))
//       })

//       zip.writeZip('./images/catPic.zip')

//       console.timeEnd('Время выполнения')
//     })
//     .catch(error => console.error(error))
// }

// getCatPic('https://meduza.io/impro/TTLKm8OruGF5gxn3d6bEhdOMm6Qx3lnFJ4OuzrGUkmg/fill/1300/0/ce/1/aHR0cHM6Ly9tZWR1/emEuaW8vaW1hZ2Uv/YXR0YWNobWVudHMv/aW1hZ2VzLzAwOC83/MTIvMDQ1L29yaWdp/bmFsL2VSZTJLYnFo/cnRWZ3VEZDVmUGFC/VEEuanBn.webp')