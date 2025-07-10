import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    // Set cookie using Next.js API route compatible method
    res.setHeader('Set-Cookie', `jwt=${token}; Max-Age=${15 * 24 * 60 * 60}; Path=/; HttpOnly; SameSite=Strict;${process.env.NODE_ENV !== 'development' ? ' Secure;' : ''}`);
};
