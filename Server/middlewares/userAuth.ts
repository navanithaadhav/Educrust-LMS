import jwt from 'jsonwebtoken';

const userAuth = async (req: any, res: any, next: any) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again.' })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        if ((tokenDecode as any).id) {
            req.body.userId = (tokenDecode as any).id;
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again.' });
        }

        next();

    } catch (error: any) {
        return res.json({ success: false, message: error.message });
    }
}

export default userAuth;
