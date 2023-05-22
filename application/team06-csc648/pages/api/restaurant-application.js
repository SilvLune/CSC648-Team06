/**
 * CSC 648 Spring 2023 - Team 6
 * File: restaurant-application.js
 * Author: Konnor Nishimura
 * 
 * Description: API endpoint that handles restaurant applications
 */

import {createPool} from 'mysql2/promise'
import passwordUtil from '../utils/passwordUtils'

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '2mb'
      }
  }
}

const pool = createPool({
  host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
  user: 'admin',
  password: 'Keymaster06!',
  database: 'gateway-db',
  connectionLimit: 10
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, address, category, logo, logoSize, password} = req.body;
    const sql = "INSERT INTO Restaurant (name, email, phone, address, logo, hash, salt, category_id, avg_delivery_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    const saltHash = passwordUtil.genPassword(password)
    const salt = saltHash.salt
    const hash = saltHash.hash

    console.log(category)
    
    //console.log(logo)
    let tempLogoArr = []
    for(let i = 0; i < logoSize; i++){
      tempLogoArr.push(logo[i])
    }

    let logoArr = new Uint8Array(tempLogoArr)

    const values = [name, email, phone, address, logoArr, hash, salt, category, 60];
    //console.log(values);

    try {
      await pool.execute(sql, values);
      const [result] = await pool.execute("SELECT LAST_INSERT_ID() AS restaurant_id");
      const id = result[0].restaurant_id;

      res.status(201).json({ message: "Application successfully sent", id: id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}