import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
const authMiddleware = (req, res, next) => {
  try {
      console.log("Middleware started");
    const authHeader = req.headers.authorization;
 
    if (!authHeader) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    const token = authHeader.split(" ")[1];
     
      // console.log("jwt secret:", process.env.JWT_SECRET)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
        

    req.user = decoded;

    next();

  } catch (error) {
  console.log("JWT Error:", error.message);

  return res.status(401).json({
    message: "Invalid token"
  });
}
};

export default authMiddleware;