const jwt = require('jsonwebtoken')
const TokenModel = require('../models/tokenModels')
module.exports = async function(req, res, next){
    const token = req.headers.authorization

    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
        return res.status(401).json({ message: "нет доступа" })
        }
        
        const tokenDb = await TokenModel.findOne({whete:{tokenName: token}})
        if(!tokenDb){
            return res.status(401).json({ message: "Токен недействителен" })
        }
        const nowDate = new Date()
        if (nowDate > tokenDb.lifeTime) {
            await tokenDb.destroy()
            return res.status(401).json({message: "Токен истёк"})
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
                
    } catch (e) {
        res.status(401).json({ message: "Ошибка авторизации" })
    }
}