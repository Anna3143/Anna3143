const db = require('../models')

const {Menu} = db

const pageController = {
  front: (req, res) => {
    res.render('main_page')
  },

  menu: (req, res) => {
    Menu.findAll({
      order: [
        ['id', 'DESC']
      ],
      limit: 9
    }).then((items) => {
      res.render('menu', {
        items
      })
    })
  },

  menu_admin: (req, res) => {
    if (!req.session.username) {
      return res.redirect('login')
    }
    Menu.findAll({
      order: [
      ['id', 'DESC']
      ],
      limit: 9
    }).then((items) =>{
      res.render('menu_admin', {
        items
      })
    })
  }
}

module.exports = pageController