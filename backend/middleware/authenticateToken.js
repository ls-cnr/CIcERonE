const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  //console.log('Autenticazione token in corso');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('Token mancante');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token non valido:', err);
      return res.sendStatus(403);
    }
    //console.log('Token valido, user:', user);
    req.user = { id: user.userId };  // Modifica qui
    next();
  });
}

module.exports = authenticateToken;
