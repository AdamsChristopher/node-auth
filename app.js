const express = require('express');
const jwt = require('jsonwebtoken');
const port = 5000;

const app = express();

verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    // Token is usually stored in local storage
    const token = bearerHeader.substring(7);
    req.token = token;
    next();
  } else {
    res.status(403).send('Incorrect credentials');
  }
};

app.get('/api', (req, res) => {
  res.status(200).send('Welcome!')
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'superSecretKey', { expiresIn: '30s' }, (err, authData) => {
    if (err) {
      res.status(403).send('Error');
    } else {
      res.json({
        message: 'Post created...',
        authData,
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  const user = {
    id: 1,
    username: 'Truc',
    password: 'Machin',
    email: 'truc@machin.com'
  }
  jwt.sign({ user }, 'superSecretKey', (err, token) => {
    res.json({
      token
    });
  });
});

app.listen(port, () => console.log(`Server started on ${port}`));