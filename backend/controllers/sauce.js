const Sauces = require('../models/sauce');
const User = require('../models/user');
const fs = require('fs');

exports.createSauce = (req, res, next)=>{
    const request = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    User.findById(req.auth.userId)
        .then((user)=>{
            if(!user){
                return res.status(404).json({message: "User doesn't exist"});
            }            

            const sauce = new Sauces({
                userId: request.userId,
                name: request.name,
                manufacturer: request.manufacturer,
                description: request.description,
                mainPepper: request.mainPepper,
                imageUrl: url + '/images/' + req.file.filename,
                heat: request.heat,                 
            });

            sauce.save()
                .then(()=>{
                    res.status(201).json({message: 'Sauce successfully saved'});
                })
                .catch((error)=>{
                    res.status(400).json({error: error});
                });
        })
        .catch((error)=>{
            res.status(500).json({
                error: error
            })
        });
};

exports.getAllSauces = (req, res, next)=>{
    Sauces.find()
        .then((sauces)=>{
            if(!sauces){
                return res.status(404).json({error: 'No sauces in the database'});
            }
            res.status(200).json(sauces);
        })
        .catch((error)=>{
            res.status(500).json({error: error});
        });
};

exports.getOneSauce = (req, res, next)=>{
    Sauces.findOne({_id: req.params.id})
        .then((sauce)=>{
            if(!sauce){
                return res.status(404).json({error: "This sauce doesn't exist"});
            }
            res.status(200).json(sauce);
        })
        .catch((error)=>{
            res.status(500).json({error: error});
        });
};

exports.modifySauce = (req, res, next)=>{
    User.findById(req.auth.userId)
        .then((user)=>{
            if(!user){
                return res.status(404).json({error: "User doesn't exist"});
            }
            
            Sauces.findOne({_id: req.params.id})
                .then((sauce)=>{
                    if(req.auth.userId !== sauce.userId){
                        return res.status(401).json({error: 'Unauthorized request'});
                    }

                    if(!sauce){
                        return req.status(404).json({error: 'Sauce not found'});
                    }

                    let newSauce = new Sauces({_id: req.params.id});
                    if(req.file){
                        const request = JSON.parse(req.body.sauce);
                        const url = req.protocol + "://" + req.get('host');

                        newSauce = {
                            userId: request.userId,
                            name: request.name,
                            manufacturer: request.manufacturer,
                            description: request.description,
                            mainPepper: request.mainPepper,
                            imageUrl: url + '/images/' + req.file.filename,
                            heat: request.heat,
                            likes: request.likes,
                            dislikes: request.dislikes,
                            usersLiked: request.usersLiked,
                            usersDisliked: request.usersDisliked   
                        };
                    }else{
                        newSauce = {
                            userId: req.body.userId,
                            name: req.body.name,
                            manufacturer: req.body.manufacturer,
                            description: req.body.description,
                            mainPepper: req.body.mainPepper,
                            imageUrl: req.body.imageUrl,
                            heat: req.body.heat,
                            likes: req.body.likes,
                            dislikes: req.body.dislikes,
                            usersLiked: req.body.usersLiked,
                            usersDisliked: req.body.usersDisliked 
                        };
                    }

                    Sauces.updateOne({_id: req.params.id}, newSauce)
                        .then(()=>{
                            res.status(201).json({message: 'Sauce well updated'});
                        })
                        .catch((error)=>{
                            res.status(400).json({error: error});
                        });
                })
                .catch((error)=>{
                    res.status(500).json({error: error});
                });
        })
        .catch((error)=>{
            res.status(500).json({error: error});
        });
};

exports.deleteSauce = (req, res, next)=>{
    User.findById(req.auth.userId)
        .then((user)=>{
            if(!user){
                return res.status(404).json({error: "User doesn't exist"});
            }

            Sauces.findOne({_id: req.params.id})
                .then((sauce)=>{
                    if(req.auth.userId !== sauce.userId){
                        return res.status(401).json({error: "Unauthorized request"});
                    }

                    if(!sauce){
                        return res.status(404).json({error: 'Sauce not found'});
                    }

                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink('images/' + filename, ()=>{
                        Sauces.deleteOne({_id: req.params.id})
                            .then(()=>{
                                res.status(200).json({message: 'Sauce deleted'});
                            })
                            .catch((error)=>{
                                res.status(400).json({error: error});
                            });
                    });
                }) 
                .catch((error)=>{
                    res.status(500).json({error: error});
                });
        })
        .catch((error)=>{
            res.status(500).json({error: error});
        });
};

exports.updateSauceLikeStatus = (req, res, next)=>{
    User.findById(req.auth.userId)
        .then((user)=>{
            if(!user){
                return res.status(404).json({error: "User doesn't exist"});
            }

            Sauces.findOne({_id: req.params.id})
                .then((sauce)=>{
                    if(!sauce){
                        return res.status(404).json({error: "Sauce doesn't exist"});
                    }

                    const userLiked = sauce.usersLiked.includes(req.body.userId);
                    const userDisliked = sauce.usersDisliked.includes(req.body.userId);

                    if(req.body.like === 1 && !userLiked){
                        sauce.likes++;
                        sauce.usersLiked.push(req.body.userId);
                    } else if(req.body.like === 0){
                        if(userLiked){
                            sauce.likes--;
                            sauce.usersLiked = sauce.usersLiked.filter(id => id !== req.body.userId);
                        }else if(userDisliked){
                            sauce.dislikes--;
                            sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== req.body.userId);
                        }
                    } else if(req.body.like === -1 && !userDisliked){
                        sauce.dislikes++;
                        sauce.usersDisliked.push(req.body.userId);
                    }

                    sauce.save()
                        .then(()=>{
                            console.log('like status updated');
                            res.status(201).json({message: "Sauce's like status updated"});
                        })
                        .catch((error)=>{
                            res.status(500).json({error: error});
                        });
                })
                .catch((error)=>{
                    res.status(400).json({error: error});
                });
        })
        .catch((error)=>{
            res.status(500).json({error: error});
        });
};