import {createPool} from 'mysql2/promise'

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
}

const pool = createPool({
    host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
    user: 'admin',
    password: 'Keymaster06!',
    database: 'gateway-db',
    connectionLimit: 10
})

export default async function handler(req, res){
    if(req.method === 'POST'){
        let sql = 'INSERT INTO Dish (name, price, description, picture, restaurant_id) VALUES (?, ?, ?, ?, ?)'
        const { name, price, description, picture, pictureSize, restaurant_id} = req.body;

        let tempPicArr = []
        for(let i = 0; i < pictureSize; i++){
            tempPicArr.push(picture[i])
        }

        let picArr = new Uint8Array(tempPicArr)

        const values = [name, price, description, picArr, restaurant_id];

        console.log(picArr)
        console.log(pictureSize)

        try{
            const [result] = await pool.execute(sql, values)
            res.status(200).json(result)
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Internal Server Error T^T'})
        }
    }else{
        res.status(405).json({message: 'Method not allowed ._.\"'})
    }
}