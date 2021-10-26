const db = require('../models')
const { uploadImg, deleteImg } = require('./imgur.js')

const { Menu } = db
const album = 'hu99Ybt'

const menuController = {
  getAll: (req, res) => {
    if (!req.session.username) {
      return res.redirect('login')
    }
    Menu.findAll({
      order: [
        ['id', 'DESC']
      ]
    }).then((item) => {
      res.render('menu', {
        item
      })
    })
  },

  add: (req, res) => {
    if (!req.session.username) {
      return res.redirect('login')
    }
    res.render('menu_add')
  },

  handleAdd: (req, res, next) => {
    if (!req.session.username) {
      return res.redirect('login')
    }
    const { name, price } = req.body
    const image = req.file
    
     if (!image) {
      req.flash('errorMessage', '缺圖片')
      //req.flash('errorMessage', '請填入所有欄位')
      return next()
    }
    if ( !name || !price ) {
      req.flash('errorMessage', '缺帳密')
      //req.flash('errorMessage', '請填入所有欄位')
      return next()
    }


    const encodeImage = req.file.buffer.toString('base64')
    uploadImg(encodeImage, album, (err, link) => {
      if (err) {
        req.flash('errorMessage', err.toString())
        return next()
      }
      Menu.create({
        name,
        price,
        image: link,
        userId: 2
      }).then(() => {
        //req.flash('errorMessage', '在這~')
        return res.redirect('menu_admin')
      }).catch((err) => {
        req.flash('errorMessage', err.toString())
        return next()
      })
    })
  },

  delete: async(req, res) => {
    if (!req.session.username) {
      return res.redirect('login')
    }

    let item
    try {
      item = await Menu.findOne({
        where: {
          id: req.params.id
        }
      })
    } catch (err) {
      req.flash('errorMessage', err.toString())
      return res.redirect('menu_admin')
     }

    deleteImg(item.image, (err) => {
      if (err) {
        req.flash('errorMessage', err.toString())
        return res.redirect('menu_admin')
      }
    })
    item.destroy().then(() => {
      res.redirect('menu_admin')
    }).catch((err) => {
      req.flash('errorMessage', err.toString())
      res.redirect('menu_admin')
    })
  },

update: (req, res, next) => {

    if (!req.session.username) {return res.redirect('login')}
    Menu.findOne({
      where: {
        id: req.params.id
      }
    }).then((item) => {
      console.log(item + 'hahahaha')
      res.render('menu_update', {
        item
      })
    }).catch((err) => {
      req.flash('errorMessage', err.toString())
      return next()
    })
  },  

handleUpdate: async (req, res, next) => {
    if (!req.session.username) {return res.redirect('login')}
    const { id } = req.params
    const { name, price } = req.body

    const image = req.file
    if (!name || !price) {
      req.flash('errorMessage', '品項及價格有缺')
      return next()
    }  
     
   let item
    try {
      item = await Menu.findOne({
        where: {
          id: req.params.id
        }
      })
    } catch (err) {
      req.flash('errMessage', err.toString())
      return next()
    }

    const param = {
      name,
      price
    }

    if (image) {
      deleteImg(item.image, (err) => {
        if (err) {
          req.flash('errorMessage', err.toString())
          return next()
        }
      })
      const encodeImage = req.file.buffer.toString('base64')
      uploadImg(encodeImage, album, (err, link) => {
        if (err) {
          req.flash('errorMessage', err.toString())
          return next()
        }
        param.image = link
        item.update(param).then(() => {
          res.redirect('menu_admin')
        })
      })
    } else {
      item.update(param).then(() => {
        res.redirect('menu_admin')
      })
    }
  }
} 


module.exports = menuController