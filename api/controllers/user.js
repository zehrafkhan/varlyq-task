const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");


exports.user_signup = (req, res, next)=> {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'email exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User ({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        mobileNo: req.body.mobileNo,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            })
        } 
    })
   
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth Failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth Failed'
            });
        })
    })
    .catch(err => {
       console.log(err);
       res.status(500).json({
        error: err
       })
    })
}
exports.user_get_user = (req, res, next) => {
    User.findById(req.params.userId)
    .exec()
    .then(user => {
     if(!user) {
       return res.status(404).json({
           message: 'user not found'
       });
     }
       res.status(200).json({
           user: user,
           request: {
               type: "GET",
               url: "http://localhost:3000/user/" 
             },
       });
    })
    .catch(err => {
       res.status(500).json({
           error: err
       });
    }) 
}

exports.user_update_user = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body){
      updateOps[ops.propName] = ops.value;
    }
    User.updateOne({ _id: id}, {$set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/user/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    }) 
}
exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User deleted"
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
     });
}


