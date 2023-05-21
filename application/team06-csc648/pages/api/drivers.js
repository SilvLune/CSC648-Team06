/**
 * CSC 648 Spring 2023 - Team 6
 * File: driver.js
 * Author: Xiao Deng
 * 
 * Description: API endpoint that handles driver data requests
 */

// establish connection to database

import {createPool} from 'mysql2/promise'
import passwordUtils from '../utils/passwordUtils'

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
    
    const saltHash = passwordUtils.genPassword(password)
    const salt = saltHash.salt
    const hash = saltHash.hash

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
    
    const values = [name, email, phone, hash, salt, licenseArr, insuranceArr];


    try {
        await pool.execute(sql, values);

        const [result] = await pool.execute("SELECT LAST_INSERT_ID() AS driver_id");
        const id = result[0].driver_id;

        res.status(201).json({ message: "User created successfully", id: id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}