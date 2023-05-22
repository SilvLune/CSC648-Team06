import pool from './pool'

export default async function handler(req, res){
    if(req.method === 'GET'){
        const {id} = req.query
        let sql = 'SELECT * FROM Restaurant WHERE restaurant_id = ?'
        let values = [id]

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