/**
 * CSC 648 Spring 2023 - Team 6
 * File: driver.js
 * Author: Xiao Deng
 * 
 * Description: API endpoint that handles driver data requests
 */

// establish connection to database

import {createPool} from 'mysql2/promise'

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const pool = createPool({
  host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
  user: 'admin',
  password: 'Keymaster06!',
  database: 'gateway-db',
  connectionLimit: 10
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password, phone, license, insurance, licenseSize, insuranceSize } = req.body;
    const sql = "INSERT INTO Driver (full_name, email, phone, hash, salt, driver_license, insurance) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    let tempLicenseArr = []
    for(let i = 0; i < licenseSize; i++){
      tempLicenseArr.push(license[i])
    }

    let licenseArr = new Uint8Array(tempLicenseArr)

    let tempInsuranceArr = []
    for(let i = 0; i < insuranceSize; i++){
      tempInsuranceArr.push(insurance[i])
    }

    let insuranceArr = new Uint8Array(tempInsuranceArr)
    
    const values = [name, email, phone, hash, 'salt', licenseArr, insuranceArr];


    try {
        const [result] = await pool.execute(sql, values);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}