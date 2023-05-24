/**
 * CSC 648 Spring 2023 - Team 6
 * File: restaurant_get_email.js
 * Author: Justin Shin
 * 
 * Description: Gets restaurant owned by query email
 */
import pool from './pool'

export default async function getRestaurant(req, res){
    console.log("*getRestaurant*")
    if(req.method === 'GET'){
        const {email} = req.query
        let sql = 'SELECT * FROM Restaurant WHERE email = ?;'
        try{
            const [rows] = await pool.execute(sql, [email])
            console.log(rows)
            res.status(200).json(rows)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Internal Server Error'})
        }

    }else{
        res.status(405).json({message: 'Method not allowed'})
    }
}
