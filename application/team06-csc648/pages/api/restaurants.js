import {createConnection} from 'mysql2';
import { NextApiRequest, NextApiResponse } from 'next';

const connection = createConnection({
    host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
    user: 'admin',
    password: 'Keymaster06!',
    database: 'gateway-db'
});

export default function handler(req, res){
    if(req.method === 'GET'){
        const {search, category} = req.query
        let sql = 'SELECT * FROM Restaurant'
        let values = []
        if(search !== 'none'){
            sql += ' WHERE name Like ?'
            values.push(`%${search}%`)
        }
        if(category && category != 0){
            if(values.length > 0){
                sql += ' AND category_id = ?'
            }else{
                sql += ' WHERE category_id = ?'
            }
            values.push(category)
        }
        connection.query(sql, values, (error, results) =>{
            if(error){
                console.log(error)
                res.status(500).json({message: 'Internal Server Error T^T'})
            }else{
                res.status(200).json(results);
            }
        })
    }else{
        res.status(405).json({message: 'Method not allowed ._.\"'})
    }
}