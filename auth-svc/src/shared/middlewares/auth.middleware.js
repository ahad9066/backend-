const authService = new (require('../services/auth.service'))

module.exports = () => async (req, res, next) => {
    try {
        console.log('im here')
        let token = req.headers['authorization'];
        if (token) {
            token = token.replace('Bearer ', '');
        }
        if (!token) {
            throw ({ statusCode: 401, message: 'Not authenticated' })
        }
        const t = decodeURIComponent(token);
        const auth = await authService.verifyAuthToken(t);
        req.user = auth.token.user;
        req.iat = auth.token.iat;
        req.is_authenticated = true;
        next();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}
