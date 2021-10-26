const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const multer  = require('multer')
const upload = multer()
const flash = require('connect-flash')


const app = express()
const port = process.env.PORT || 5001

const menuController = require('./controllers/menu')
const userController = require('./controllers/user')
const pageController = require('./controllers/page')

app.set('views', __dirname + './views');
app.set('views', './views');
app.set('view engine', 'ejs');
//app.use(express.static(`public`));
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(flash())
app.use((req, res, next) => {
  res.locals.username = req.session.username
  res.locals.errorMessage = req.flash('errorMessage')
  next()
})

app.get('/', pageController.front)
app.get('/menu', pageController.menu)
app.get('/menu_admin', pageController.menu_admin)

function redirectBack(req, res) {
  res.redirect('back')
}

app.get('/register', userController.register)
app.post('/register', userController.handleRegister, redirectBack)
app.get('/login', userController.login)
app.post('/login', userController.handleLogin, redirectBack)
app.get('/logout', userController.logout)

app.get('/menu_add', menuController.add)
app.post('/menu_add', upload.single('image'), menuController.handleAdd, redirectBack)
app.get('/menu_update/:id', menuController.update, redirectBack)
app.post('/menu_update/:id', upload.single('image'), menuController.handleUpdate, redirectBack)
app.get('/menu_delete/:id', menuController.delete, redirectBack)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})