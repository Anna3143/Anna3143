
const request = require('request')
const token = '3a888ad130d976523f855d23139ef2d6fde31c72'
const apiUrl = 'https://api.imgur.com/3/image'


function uploadImg(encodeImage, album, cb) {
  const option = {
    url: apiUrl,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
    formData: {
      'image': encodeImage,
      'album': album
    }
  }

  request.post(option, (err, res, body) => {
    if (err) cb(err)
    try {
      const json = JSON.parse(body)
      cb(null, json.data.link)
    } catch (err) {
      cb(err)
    }
  })
}

function deleteImg(url, cb) {
  const end = url.lastIndexOf('.')
  const start = url.lastIndexOf('/') + 1
  const imageHash = url.slice(start, end)
  const option = {
    url: `${apiUrl}/${imageHash}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  request.delete(option, (err, res, body) => cb(err))
}

module.exports = {
  token,
  apiUrl,
  uploadImg,
  deleteImg
}