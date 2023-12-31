/**
 * CSC 648 Spring 2023 - Team 6
 * File: orderDish-complete.js
 * Author: Konnor Nishimura
 * 
 * Description: Deletes query order from OrderDish table
 */

import pool from './pool'

export default async function handler(req, res){
    if(req.method === 'POST'){
        const {order_id} = req.query
        let sql = 'DELETE FROM OrderDish WHERE order_id = ?;'
        let values = [order_id]

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