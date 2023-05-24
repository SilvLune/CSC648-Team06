/**
 * CSC 648 Spring 2023 - Team 6
 * File: get-categories.js
 * Author: Konnor Nishimura
 * 
 * Description: Gets categories from database
 */

import pool from './pool'

export default async function handler(req, res){
    if(req.method === 'GET'){
        const {order_id} = req.query
        let sql = 'SELECT * FROM Category;'

        try{
            const [rows] = await pool.execute(sql)
            res.status(200).json(rows)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Internal Server Error T^T'})
        }
    }else{
        res.status(405).json({message: 'Method not allowed ._.\"'})
    }
}