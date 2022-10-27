const jwt = require("jsonwebtoken");


const verifyToken = async (req, res) => {
  console.log(req.headers)
  const token = ((req.headers["authorization"]).split(" "))[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  console.log("verified");
  res.redirect("http://localhost:3000/login")


};

module.exports = verifyToken;