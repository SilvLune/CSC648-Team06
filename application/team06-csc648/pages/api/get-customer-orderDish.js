/**
 * CSC 648 Spring 2023 - Team 6
 * File: get-customer-orderDish.js
 * Author: Konnor Nishimura
 * 
 * Description: Gets an order by query ID
 */

import pool from './pool'

export default async function handler(req, res){
    if(req.method === 'POST'){
        const {order_id} = req.query
        let sql = 'SELECT * FROM OrderDish LEFT JOIN Dish ON Dish.dish_id = OrderDish.dish_id WHERE order_id = ?;'
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