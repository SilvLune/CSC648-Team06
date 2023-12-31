/**
 * CSC 648 Spring 2023 - Team 6
 * File: drivers_login.js
 * Author: Justin Shin
 * 
 * Description: Sessions for drivers
 */
import {withIronSession} from 'next-iron-session'

export default withIronSession(
    async function loginRoute(req, res){
        console.log("*session storing*")
        const{driver_id, email} = req.query
        req.session.set('driver', {driver_id: driver_id, email: email})
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