export default function authenticateLogin(req, res, next) {
    if(!req.session.isLogin) {
        req.flash('error', 'please login first')
        return res.redirect('/login')
    }
    next()
}