const { createConnection } = require('mysql2');

const connection = createConnection({
  host: 'gateway-db.c4uyinpxegwd.us-west-2.rds.amazonaws.com',
  user: 'admin',
  password: 'Keymaster06!',
  database: 'gateway-db'
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
  } else {
    console.log('Connected to database.');
    connection.query('SELECT * FROM Restaurant', (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
      } else {
        console.log('Query results:', results);
      }
      connection.end();
    });
  }
});

function search(req){
  // user's search term
  var searchTerm = req.query.search;
  // user's category
  //var category = req.query.category;

  let query = "SELECT * FROM Restaurant";
  if (searchTerm !=''){
    query = `SELECT * FROM Restaurant WHERE name LIKE '%` + searchTerm + `%'`;
  }

  database.query(query, (error,result) =>{
    if(error){
      console.error('Error querying database:', error);
    }else{
      console.log('Query results:', result);
    }
    connection.end();
  });
}
