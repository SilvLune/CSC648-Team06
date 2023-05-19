import pool from './pool'

export default async function insertCustomers(req,res){
    console.log('customer insert')
    if(req.method === 'POST'){
        const {name, email, phone, hash, salt} = req.query
        console.log('*insertCustomer* full_name: ' + name)
        console.log('*insertCustomer* email: ' + email)
        console.log('*insertCustomer* phone: ' + phone)
        console.log('*insertCustomer* hash: ' + hash)
        console.log('*insertCustomer* salt: ' + salt)
        let sql = 'INSERT INTO Customer (full_name, email, phone, hash, salt) VALUES (?,?,?,?,?);'
        const values = [name, email, phone, hash, salt]
        try{
            await pool.execute(sql, values)
            res.status(200).json({message: 'Post Customer Success'})
        }catch(error){
            res.status(500).json({message: 'Internal Server Error'})
        }
    }else{
        res.status(405).json({message: "Method not allowed"})
    }
}
