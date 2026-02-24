import jwt from "jsonwebtoken";
export const adminMiddleware = async (req, res, next) => {
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
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admins only", success: false });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
