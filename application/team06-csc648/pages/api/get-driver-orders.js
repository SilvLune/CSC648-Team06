import {createPool} from 'mysql2/promise'

const pool = createPool({
    host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
    user: 'admin',
    password: 'Keymaster06!',
    database: 'gateway-db',
    connectionLimit: 10
})


export default async function handler(req, res){
    if(req.method === 'GET'){
        const {driver_id} = req.query
        let sql = 'SELECT *, Restaurant.address AS restaurant_address, `Order`.address AS order_address FROM `Order` LEFT JOIN Restaurant ON Order.restaurant_id = Restaurant.restaurant_id WHERE driver_id = ?'
        let values = [driver_id]

        try{
            const [rows] = await pool.execute(sql, values)
            res.status(200).json(rows)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Internal Server Error T^T'})
        }
    }else{
        res.status(405).json({message: 'Method not allowed ._.\"'})
    }
}