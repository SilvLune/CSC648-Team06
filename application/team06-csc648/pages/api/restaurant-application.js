/**
 * CSC 648 Spring 2023 - Team 6
 * File: restaurant-application.js
 * Author: Konnor Nishimura
 * 
 * Description: API endpoint that handles restaurant applications
 */

import {createPool} from 'mysql2/promise'
import passwordUtil from '../utils/passwordUtils'

const pool = createPool({
  host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
  user: 'admin',
  password: 'Keymaster06!',
  database: 'gateway-db',
  connectionLimit: 10
})

export default async function upload(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, address, logo, logoSize, password, dishNames, dishDescriptions, dishPictures, dishPicSizes, dishPrices} = req.body;
    const sql = "INSERT INTO Restaurant (name, email, phone, address, logo, hash, salt, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    //console.log(name, email, phone, address, logo, password, dishNames, dishDescriptions, dishPictures, dishPrices);

    const saltHash = passwordUtil.genPassword(password)
    const salt = saltHash.salt
    const hash = saltHash.hash

    
    //console.log(logo)
    let tempLogoArr = []
    for(let i = 0; i < logoSize; i++){
      tempLogoArr.push(logo[i])
    }

    let logoArr = new Uint8Array(tempLogoArr)

    const values = [name, email, phone, address, logoArr, hash, salt, 1];
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
            let tempDishArr = []
            for(let j = 0; j < dishPicSizes[i]; j++){
              tempDishArr.push(dishPictures[i][j])
            }

            let dishArr = new Uint8Array(tempDishArr)
            
            dishValues[3] = dishArr;
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