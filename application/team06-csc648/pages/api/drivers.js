/**
 * CSC 648 Spring 2023 - Team 6
 * File: driver.js
 * Author: Xiao Deng
 * 
 * Description: API endpoint that handles driver data requests
 */

// establish connection to database

import { createPool } from 'mysql2/promise'
import multer from 'multer'

const pool = createPool({
  host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
  user: 'admin',
  password: 'Keymaster06!',
  database: 'gateway-db',
  connectionLimit: 10
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: null}).fields([
  { name: 'license', maxCount: 1 },
  { name: 'insurance', maxCount: 1 },
]);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await upload(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        const { name, email, password, phone } = req.body;
        const license = req.files['license'][0].buffer;
        const insurance = req.files['insurance'][0].buffer;

        const sql = "INSERT INTO Driver (full_name, email, phone, hash, salt, license, insurance) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [name, email, phone, 'hash', 'salt', license, insurance];

        const [result] = await pool.execute(sql, values);
        res.status(201).json({ message: "User created successfully" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}