const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const express = require("express");
const mysqlConnection = require('../connection');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const isAuthenticated = (req,res,next) => {
    if(req.cookies.token){
        jwt.verify(req.cookies.token , 'ThisIsmMyyyyJWTTTTTKEY!1123' , (err , user) => {
            if(err){
                console.log(err)
                res.redirect('/login')
                return
            }else{
                console.log(user)
                req.user = user
                next()
                return 
            }
        })
    }else{
        res.redirect('/login')
        return
    }
}


const login = ({email , password}) => {
    return new Promise((resolve , reject) => {
        console.log(email)
        mysqlConnection.getUserLogin(email , (err , user) => {
            if(!err){
                console.log(user)
                if(user[0]){
                    user = user[0]
                    bcrypt.compare(password , user.password , (err , result) => {
                        if(!err){
                            //process.env.JWT_SECRET
                            const spreadedUser = {...user}
                            jwt.sign(spreadedUser , 'ThisIsmMyyyyJWTTTTTKEY!1123', { expiresIn: "1d" } , (err , token) => {
                                if(err){
                                    reject(err)
                                }else{
                                    resolve(token)
                                }
                            } )
                        }
                        else{
                            reject(err)
                        }
                    })
                }
                else{
                    reject(new Error('No Corresponding email'))
                }
            }else{
                reject(err)
            }
        })
    })
}

const signup = ({username, lastname, email, password}) => {
    return new Promise ((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
            mysqlConnection.getUsersSignUp(username , lastname , hash , email , (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        });
        
    })
}

const createPost = ({location_id , ad_id , item_category_id, title, price, condition, description, picture, method_of_payment, method_of_communication, negotiable, user_id}) => {

    // location_id, ad_id, item_category_id, title, price, description, condition, picture, user_id,
    return new Promise ((resolve, reject) => {
        mysqlConnection.createPost(location_id , ad_id , item_category_id, title, price, description ,condition, picture, method_of_payment, method_of_communication, negotiable, user_id, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}







module.exports = { isAuthenticated, login, signup, createPost};
