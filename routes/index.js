var express = require('express');
var router = express.Router();
var connection = require('../config/config')
const jwt = require('../token/token');


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getdata', jwt.authenticateToken, async (req, res, next) => {
  try {
    const sql = 'SELECT * FROM production.UserLogin';
    const [result] = await connection.execute(sql);
    res.status(200).send([{ status: 'Y', Msg: result }]);
  } catch (error) {
    console.error('Error inserting user:', error.message);
    res.status(500).send([{ status: 'N', Msg: error.message }]);
  }
})

router.post('/register', async (req, res) => {

  try {
    const sql = 'INSERT INTO production.UserLogin(UserName, password, email, CreatedDate) ' +
      ' VALUES ("' + req.body.UserName + '","' + req.body.password + '","' + req.body.email + '","' + req.body.CreatedDate + '")';
    const [result] = await connection.execute(sql);
    res.status(200).send([{ status: 'Y', Msg: 'User registered successfully!' }]);
  } catch (error) {
    console.error('Error inserting user:', error.message);
    res.status(500).send([{ status: 'N', Msg: error.message }]);
  }
});


router.post('/login', async (req, res) => {
  const { UserName, password } = req.body
  const data = []
  try {
    const sql = 'SELECT * FROM production.UserLogin where username = "' + UserName + '"' + 'And Password = "' + password + '"';
    const responce = await connection.execute(sql);
    if (responce[0].length != 0) {
      const token = jwt.generatetoken({ UserName: UserName, password: password })
      data.push(
        {
          LoginId: responce[0][0].LoginId,
          UserName: responce[0][0].UserName,
          password: responce[0][0].password,
          email: responce[0][0].email,
          token: token
        }
      )
    }
    res.status(200).send([{ status: 'Y', Msg: data }]);
  } catch (error) {
    res.status(500).send([{ status: 'N', Msg: error.message }]);
  }
})


module.exports = router;
