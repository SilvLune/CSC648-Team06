/**
 * CSC 648 Spring 2023 - Team 6
 * File: restaurants.js
 * Author: Justin Shin, Jack Lee
 * 
 * Description: %like search function for restaurant search
 */

import pool from './pool'

// %like search function
export default async function handler(req, res){
    if(req.method === 'GET'){
        const {search, category} = req.query
        let sql = 'SELECT * FROM Restaurant WHERE registration_status = 1'
        let values = []
        if(search !== 'none'){
            sql += ' AND name Like ?'
            values.push(`%${search}%`)

        }
        if(category && category != 0){
            sql += ' AND category_id = ?'
            values.push(category)
        }

        try{
            const [rows] = await pool.execute(sql, values)
            res.status(200).json(rows)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Internal Server Error T^T'})
        }
    }else{
        res.status(405).json({message: 'Method not allowed ._.\"'})
    }
}