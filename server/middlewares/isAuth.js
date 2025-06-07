import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    console.log("fetching token from client request");
    let token = req.cookies.token;
    console.log( "token is ",token);
    
    if (!token) {
      return res.status(401).json({ message: "Token not found" });  // 401 Unauthorized is better here
    }

    let verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = verifyToken.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: `Authentication failed: ${error.message}` }); // 401 here too
  }
};

export default isAuth;
