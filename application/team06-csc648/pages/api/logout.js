/**
 * CSC 648 Spring 2023 - Team 6
 * File: logout.js
 * Author: Justin Shin
 * 
 * Description: Route for logging out
 */

import {withIronSession} from 'next-iron-session'

export default withIronSession(
    function logoutRoute(req, res, session){
        console.log("*logout*")
        console.log("req.session.user: " + req.session.user)
        req.session.destroy();
        res.send({ok: true})
    },{
        cookieName: 'gateway_cookie',
        password: process.env.SECRET_COOKIE_PASSWORD,
        cookieOptions:{
            secure: process.env.NODE_ENV === "production"
        }
    }
)
