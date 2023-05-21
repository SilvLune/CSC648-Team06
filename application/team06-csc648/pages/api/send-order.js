/**
 * CSC 648 Spring 2023 - Team 6
 * File: send-order.js
 * Author: Konnor Nishimura
 * 
 * Description: API endpoint that handles sending orders to the database
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
    const { restaurant_id, customer_id, driver_id, status, total, delivery_fee, order_date_time, address } = req.body;
    const sql = "INSERT INTO `Order` (restaurant_id, customer_id, driver_id, status, total, delivery_fee, order_date_time, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    //console.log(restaurant_id, customer_id, driver_id, status, total, delivery_fee, order_date_time, address);

    const values = [restaurant_id, customer_id, driver_id, status, total, delivery_fee, order_date_time, address];
    //console.log(values);

    try {
      await pool.execute(sql, values);
      const [result] = await pool.execute("SELECT LAST_INSERT_ID() AS order_id");
      const id = result[0].order_id;

      res.status(201).json({ message: "Order successfully created", id: id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}