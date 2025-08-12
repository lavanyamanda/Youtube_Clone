import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const JWT_SECRET = 'SECRETKEY';

async function verifyToken(req, res, next) {
  try {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'JWT'
    ) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);  
      const user = await UserModel.findById(decoded._id || decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } else {
      return res.status(404).json({ message: 'Token not found' });
    }
  } catch (err) {
    return res.status(403).json({ message: 'Invalid JSON token' });
  }
}

export default verifyToken;
