const authService = new (require('../services/auth.service'))

module.exports = (type) => async (req, res, next) => {
    try {
        console.log('im here', type, req.headers['type'])
        let token = req.headers['authorization'];
        if (token) {
            token = token.replace('Bearer ', '');
        }
        if (!token) {
            throw ({ statusCode: 401, message: 'Not authenticated' })
        }
        const t = decodeURIComponent(token);
        const auth = await authService.verifyAuthToken(req, t, type ? type : req.headers['type'] ? req.headers['type'] : 'isEmployee');
        req.user = auth.token.user;
        req.iat = auth.token.iat;
        req.is_authenticated = true;
        next();
    } catch (err) {
        console.log("middlewaree rr", err)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}
