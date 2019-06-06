const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        let { username, password, isAdmin } = req.body;
        let db = req.app.get('db');
        let result = await db.get_user(username);
        let existingUser = result[0];
        if(existingUser){
            res.send('Username taken').status(409);
        }
        let salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        let registeredUser = await db.register_user(isAdmin, username, hash);
        let user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }

        res.send(req.session.user).status(201);
    },

    login: async (req, res) => {
        let { username, password } = req.body;
        let db = req.app.get('db');
        let foundUser = await db.get_user(username);
        let user = foundUser[0];
        if(!user){
            res.send('User not found. Please register as a new user before logging in.').status(401);
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if(!isAuthenticated){
            res.send('Incorrect password').status(403);
        }
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        };
        res.send(req.session.user).status(200);
    },

    logout: async (req,res) => {
        req.session.destroy();
        res.sendStatus(200)
    }
}