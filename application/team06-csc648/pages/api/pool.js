import {createPool} from 'mysql2/promise'

const pool = createPool({
    host: "gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com",
    user: 'admin',
    password: 'Keymaster06!',
    database: 'gateway-db',
    connectionLimit: 10
})

module.exports = pool