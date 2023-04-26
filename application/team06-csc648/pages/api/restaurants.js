/*
*  CSC648/848 Spring 2023 Team06
*  
*  File: restaurants.js
*  %like search function
*
*  Author: Justin Shin, Jack Lee
*/
import {createPool} from 'mysql2/promise'

const pool = createPool({
    host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
    user: 'admin',
    password: 'Keymaster06!',
    database: 'gateway-db',
    connectionLimit: 10
})

// %like search function
export default async function handler(req, res){
    if(req.method === 'GET'){
        const {search, category} = req.query
        let sql = 'SELECT * FROM Restaurant'
        let values = []
        if(search !== 'none'){
            sql += ' WHERE name Like ?'
            values.push(`%${search}%`)
        }
        if(category && category != 0){
            if(values.length > 0){
                sql += ' AND category_id = ?'
            }else{
                sql += ' WHERE category_id = ?'
            }
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