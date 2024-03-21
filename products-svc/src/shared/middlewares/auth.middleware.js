
const axios = require("axios");

const client = axios.create({
    baseURL: process.env.AUTH_API_BASE_URL,
});

module.exports = (options = { routeName }) => async (req, res, next) => {
    try {
        console.log("header tyoe", req.headers['type'])
        // let type = req.headers['referer']
        const permission = await client.request({
            url: `/auth/permission/${options.routeName}`,
            method: 'get',
            headers: {
                Authorization: req.headers['authorization'],
                type: req.headers['type'] ? req.headers['type'] : 'isEmployee'
            },
        });
        req.user = permission.data.user;
        req.iat = permission.data.iat;
        req.is_authenticated = permission.data.is_authenticated;
        next();
    } catch (e) {
        console.log("products middleware error", e)
        next({ statusCode: e.response.status, message: e.response.data.message })
    }
}
