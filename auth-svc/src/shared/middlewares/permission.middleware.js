
const authService = new (require('../services/auth.service'));

module.exports = (req, res, next) => {
    try {

        const routeName = req.routeName ? req.routeName : req.params['routeName'] ? req.params['routeName'] : ''
        if (!authService.canUserAccessRoute(req.user, routeName)) {
            throw ({ statusCode: 403, message: 'You are not authorized to access this resource!' })
        }
        next();
    } catch (e) {
        throw ({ statusCode: e.status, message: e });
    }
}
