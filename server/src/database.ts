import mysql from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

export function connectToDB() {
  const db = mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: 'tasks',
            })
    db.connect((err) => {
                if (err) {
                  console.error('Error connecting to database:', err);
                  return;
                }
                console.log('Connected to MySQL');
              });
        
            return db;
  }