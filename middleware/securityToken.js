const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const protect = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No autorizado, no hay token' });
    }
    try {
      const response = await axios.post(process.env.AUTH_SERVER_URI, { token });   
      if (response.data.valid) {
        req.user = response.data.userId;
        next();
      } else {
        res.status(401).json({ message: 'No autorizado, token inválido' });
      }
    } catch (error) {
      res.status(401).json({ message: 'No autorizado, error al validar el token' });
    }
  };

  module.exports = protect;