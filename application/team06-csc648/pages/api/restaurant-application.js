/**
 * CSC 648 Spring 2023 - Team 6
 * File: restaurant-application.js
 * Author: Konnor Nishimura
 * 
 * Description: API endpoint that handles restaurant applications
 */

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

export default async function upload(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, address, logo, password, dishNames, dishDescriptions, dishPictures, dishPrices} = req.body;
    const sql = "INSERT INTO Restaurant (name, email, phone, address, logo, hash, salt, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    //console.log(name, email, phone, address, logo, password, dishNames, dishDescriptions, dishPictures, dishPrices);

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    let blob = new Blob([logo]);
    //console.log(logo)

    const values = [name, email, phone, address, await logo.arrayBuffer(), hash, "salt", 1];
    //console.log(values);

    try {
      await pool.execute(sql, values);
      const [result] = await pool.execute("SELECT LAST_INSERT_ID() AS restaurant_id");
      const id = result[0].restaurant_id;
      for (let i = 0; i < dishNames.length; i++) {
        if((dishNames[i] != undefined) && (dishPrices[i] != undefined)){
          const dishValues = [dishNames[i], dishPrices[i], dishDescriptions[i], dishPictures[i], id];
          if(dishDescriptions[i] == undefined){
            dishValues[2] = null;
          }
          if(dishPictures[i] == undefined){
            dishValues[3] = null;
          } else{
            let blob2 = new Blob([dishPictures[i]]);
            dishValues[3] = await blob2.arrayBuffer();
          }
          
          const dishSQL = "INSERT INTO Dish (name, price, description, picture, restaurant_id) VALUES (?, ?, ?, ?, ?)";
          await pool.execute(dishSQL, dishValues);
        }
      }
      res.status(201).json({ message: "Application successfully sent" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}