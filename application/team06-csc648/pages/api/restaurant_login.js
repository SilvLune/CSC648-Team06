/**
 * CSC 648 Spring 2023 - Team 6
 * File: restaurant_login.js
 * Author: Justin Shin, Konnor Nishimura
 * 
 * Description: Handles session for restaurant user
 */

import {withIronSession} from 'next-iron-session'

export default withIronSession(
    async function loginRoute(req, res){
        console.log("*session storing*")
        const{restaurant_id} = req.query
        req.session.set('restaurant', {restaurant_id: restaurant_id})
        try{
            await req.session.save()
            res.status(200).json({isLoggedIn: true})
        }catch(error){
            res.status(500).json({message: 'Error saving session'})
        }
    },
    {
        cookieName: 'gateway_cookie',
        password: process.env.SECRET_COOKIE_PASSWORD,
        cookieOptions:{
            secure: process.env.NODE_ENV === "production"
        }
    }
)