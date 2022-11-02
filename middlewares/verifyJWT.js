import User from "../models/userModel.js";
import * as jwt from "jsonwebtoken";

/**
 * @desc Verifies jwt token on request
 */
export const verifyJWT = async (req, res, next) => {
  // Get authorization headers
  const authHeaders = req.headers.authorization || req.headers.Authorization;

  if (!authHeaders?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Not Auhorized",
    });

    return res.end();
  }

  // Extract token
  const token = authHeaders.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    // Validate token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const targetUser = await User.findById(decoded.id);

    req.companyId = targetUser.companyId;
    req.id = targetUser._id;
    req.isAdmin = targetUser.admin;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Expired Token",
    });
  }
};
