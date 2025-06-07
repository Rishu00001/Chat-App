import jwt from "jsonwebtoken";
const generateToken =  (id) => {
  try {
    let token =  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log("Error while generating token");
  }
};
export default generateToken;
