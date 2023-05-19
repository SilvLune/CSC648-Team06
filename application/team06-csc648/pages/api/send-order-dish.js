/**
 * CSC 648 Spring 2023 - Team 6
 * File: send-order-dish.js
 * Author: Konnor Nishimura
 * 
 * Description: API endpoint that handles sending each dish in an order to the database
 */

import {createPool} from 'mysql2/promise'

const pool = createPool({
  host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
  user: 'admin',
  password: 'Keymaster06!',
  database: 'gateway-db',
  connectionLimit: 10
})

export default async function upload(req, res) {
  if (req.method === 'POST') {
    const { order_id, dish_id, quantity } = req.body;
    const sql = "INSERT INTO OrderDish (order_id, dish_id, quantity) VALUES (?, ?, ?)";

    //console.log(order_id, dish_id, quantity);

    const values = [order_id, dish_id, quantity];
    //console.log(values);

    try {
      await pool.execute(sql, values);

      res.status(201).json({ message: "Dish order successfully created"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}