module.exports = {
    dragonTreasure: async (req, res) => {
        let db = req.app.get('db');
        let treasure = await db.get_dragon_treasure(1);
        res.send(treasure).status(200);
    },

    getUserTreasure: async (req, res) => {
        try{
            let { id } = req.session.user;
            let db = req.app.get('db');

            let userTreasure = await db.get_user_treasure(id);
            res.send(userTreasure).status(200);
        } catch(err){
            console.log(err);
            res.send(err).status(500);
        }
    },
    
    addMyTreasure: async (req, res) => {
        try{
            let { treasureURL } = req.body;
            let { id } = req.session.user;
            let db = req.app.get('db');

            let userTreasure = await db.add_user_treasure(treasureURL, id);
            res.send(userTreasure).status(200);

        } catch(err){
            console.log(err);
            res.send(err).status(500);
        }
    },

    getAllTreasure: async (req, res) =>{
        try{
            let db = req.app.get('db');

            let allTreaure = await db.get_all_treasure();
            res.send(allTreaure).status(200);
        } catch(err){
            console.log(err);
            res.send(err).status(500);
        }
    }
}