import { devNull } from 'os';
import path from 'path';
// console.log(__dirname, "dirname")
const fs = require('fs');
import createSqlWasm from "sql-wasm";

// const filebuffer = fs.readFileSync(path.join(__dirname, '../src/utils/db/test.sqlite'));

 
// (async () => {
//     const sql = await createSqlWasm({ wasmUrl: path.join(__dirname, "../src/utils/db/sqlite3.wasm" )});
//     // From here on, the SQL.js API can be used...
//     const db = new sql.Database(filebuffer);
    
    
//     try {
//         // //Execute some sql
//         // let sqlstr = ""
//         // sqlstr = "CREATE TABLE hello (a int, b char);";
//         // sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
//         // sqlstr += "INSERT INTO hello VALUES (1, 'world');"
//         // db.run(sqlstr); // Run the query without returning anything
        
//         var res = db.exec("SELECT * FROM hello");
//         console.log({ res })
//         res.map(i => console.log(...i.columns, i.values))
        
//         var stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");
 
//         // // Bind values to the parameters and fetch the results of the query
//         console.log({ stmt }, stmt.step())
//         while (stmt.step())  { 
//             console.log(stmt.get()); 
//         }
        
//         // // free the memory used by the statement
        
//         stmt.free();
//         // // // Export the database to an Uint8Array containing the SQLite database file
//         const data = db.export();
//         const buffer = new Buffer.from(data);
//         fs.writeFileSync(path.join(__dirname, '../src/utils/db/test.sqlite'), buffer);
       
//     }
//     catch(e) {
//         console.log(e)
//     }
    

// })();

class SQLHelper {
    constructor() {
        this.db = null
    }
    
    init  = async (wafuz_name) => {
        const dbDumpBuffer = fs.readFileSync(path.join(__dirname, `../wafunctions/${wafuz_name}/db/db.sqlite`));
        const sql = await createSqlWasm({ wasmUrl: path.join(__dirname, "../src/utils/db/sqlite3.wasm" )});
        // From here on, the SQL.js API can be used...
        this.db = new sql.Database(dbDumpBuffer);
    }

    db_exec = (queryString = "SELECT * FROM hello") => {
        var res = db.exec(queryString);
        console.log({ res })
        res.map(i => console.log(...i.columns, i.values))
        return res
    }

    // Run the query without returning anything
    db_run = (queryString = "CREATE TABLE hello (a int, b char);") => {
        let sqlstr = queryString
        sqlstr = queryString;
        this.db.run(sqlstr); 
    }

    persist = () => {
        // // // Export the database to an Uint8Array containing the SQLite database file
        const data = db.export();
        const buffer = new Buffer.from(data);
        fs.writeFileSync(path.join(__dirname, `../wafunctions/${wafuz_name}/db/db.sqlite`), buffer);
    }
}
// persist()

export default {
    SQLHelper
}