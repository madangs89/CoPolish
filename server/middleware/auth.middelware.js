import jwt from "jsonwebtoken";
export const authMiddelware = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized: No token", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
