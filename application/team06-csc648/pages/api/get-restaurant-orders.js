import pool from './pool'

export default async function handler(req, res){
    if(req.method === 'POST'){
        const {restaurant_id} = req.query
        let sql = 'SELECT * FROM `Order` LEFT JOIN Restaurant ON `Order`.restaurant_id = Restaurant.restaurant_id WHERE Restaurant.restaurant_id = ?;'
        let values = [restaurant_id]

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