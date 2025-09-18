import { secretkey } from "../server.js";
import jwt from "jsonwebtoken";

const authenticateTOKEN = (req, res, next) => {
 
  const authheader = req.headers["authorization"];
  const token = authheader && authheader.split(" ")[1];


    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, secretkey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = user;
        next();
    }
    )
};

export default authenticateTOKEN;
