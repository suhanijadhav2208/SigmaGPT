import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
    const token = req.cookies?.sigma_token;

    if (!token) {
        return res.status(401).json({
            message: "Please log in first.",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.userId,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Your session is invalid or expired.",
        });
    }
}