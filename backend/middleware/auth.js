const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'YOYOYO');
        const userId = decodedToken.userId;
        req.auth = {userId: userId};
        // Extra verification if a userId exists in the req.body
        // prevent to much queries to the database for verification
        if(req.body.userId && req.body.userId !== userId){
            throw new Error('Invalid user id');
        } else{
            next();
        }

    } catch(error){
        console.log('Unauthorized to modify or delete');
        res.status(401).json({
            message: 'Unauthorized request',
            error: error
        });
    };
};
