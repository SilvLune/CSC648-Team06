/**
 * CSC 648 Spring 2023 - Team 6
 * File: customers.js
 * Author: Xiao Deng
 * 
 * Description: API endpoint that handles customer data requests
 */


// establish connection to database

import {createPool} from 'mysql2/promise'


const pool = createPool({
  host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
  user: 'admin',
  password: 'Keymaster06!',
  database: 'gateway-db',
  connectionLimit: 10
})

export default async function handler(req, res) {


  // handles customer data POST requests (registration)
  if (req.method === 'POST') {
    const { name, email, password, phone } = req.body;
    const sql = "INSERT INTO Customer (full_name, email, phone, hash, salt) VALUES (?, ?, ?, ?, ?)";
    const values = [name, email, phone, 'hash', 'salt']; // placeholder for password hashing

    try {
      const [result] = await pool.execute(sql, values);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}