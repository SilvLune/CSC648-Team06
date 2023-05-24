/**
 * CSC 648 Spring 2023 - Team 6
 * File: get-user.js
 * Author: Konnor Nishimura
 * 
 * Description: Gets type of user session
 */

import {withIronSession} from "next-iron-session"

function testHandler(req, res, session){
    let user
    user = req.session.get('customer')
    if(user == undefined){
        user = req.session.get('restaurant')
    }
    if(user == undefined){
        user = req.session.get('driver')
    }

    res.send({user})
}

export default withIronSession(testHandler, {
    cookieName: 'gateway_cookie',
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieOptions:{
        secure: process.env.NODE_ENV === "production"
    }
})