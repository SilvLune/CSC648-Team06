import pool from './pool'

export default async function handler(req, res){
    if(req.method === 'POST'){
        const {driver_id, order_id} = req.query
        let sql = 'UPDATE `Order` SET driver_id = ? WHERE order_id = ?;'
        let values = [driver_id, order_id]

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