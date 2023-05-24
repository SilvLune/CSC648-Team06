import pool from './pool'

export default async function getDriver(req, res){
    console.log("*getDriver*")
    if(req.method === 'GET'){
        const {email} = req.query
        let sql = 'SELECT * FROM Driver WHERE email = ?;'
        try{
            const [rows] = await pool.execute(sql, [email])
            console.log(rows)
            res.status(200).json(rows)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Internal Server Error'})
        }

    }else{
        res.status(405).json({message: 'Method not allowed'})
    }
}