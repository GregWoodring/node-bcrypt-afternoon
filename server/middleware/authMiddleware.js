module.exports = {
    usersOnly: (req,res,next) => {
        if(req.session.user){
            next();
        } else {
            res.send('Please Log In').status(401)
        }
    },

    adminOnly: (req,res,next) => {
        if(req.session.user && req.session.user.isAdmin){
            next()
        } else {
            res.send('You are not an admin').status(403)
        }
    }
}