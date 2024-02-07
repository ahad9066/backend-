
module.exports = (options = { routeName }) => async (req, res, next) => {
    if (options.routeName) {
        req.routeName = options.routeName;
    }
    next();
}
