const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/secrets');


const checkCredentials = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'username and password required' });
  } else {
    next();
  }
};

const checkUsernameTaken = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await Users.findBy({ username }).first();
    if (user) {
      res.status(400).json({ message: 'username taken' });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const verifyUserCredentials = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findBy({ username }).first();
  
      if (user && bcrypt.compareSync(password, user.password)) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'invalid credentials' });
      }
    } catch (err) {
      next(err);
    }
  };


const hashPassword = (req, res, next) => {
  const { password } = req.body;
  const rounds = process.env.BCRYPT_ROUNDS || 8;
  const hash = bcrypt.hashSync(password, rounds);
  req.body.password = hash;
  next();
};

const generateToken = (user) => {
    const payload = {
      subject: user.id,
      username: user.username,
    };
    const options = {
      expiresIn: '1d',
    };
    return jwt.sign(payload, JWT_SECRET, options);
  };


module.exports = {
  checkCredentials,
  checkUsernameTaken,
  hashPassword,
  verifyUserCredentials,
  generateToken,
};
