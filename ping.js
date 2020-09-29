const { promises } = require('fs');
const delay = require('delay')
var mysql = require('mysql');
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'mysql-single',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root_password',
    acquireTimeout: 100000
});

let lastConnectionTs = 0

const ping = function (connection) {
    return new Promise(async (resolve, reject) => {
        connection.ping(function (err) {
            if (err) return reject(err)
            lastConnectionTs = Number(new Date)

            return resolve()
        })
    })
}

const query = require('./query')
const loadSampleData = require('./loadSampleData')
const TARGET_DB_SIZE = process.env.TARGET_DB_SIZE || 20

const benchmarkConnection = function () {
    return new Promise((resolve, reject) => {
        pool.getConnection(async function (err, connection) {
            connection && connection.on('error', function (err) {
                console.log('Connection error!', err)
                return reject(e)
            })
            try {
                if (err) {
                    return reject(err);
                }

                await ping(connection)

                //check for database
                await require('./createSampleTables')(connection)

                //check db size
                // const [{ db_size_mb: sizeRes }] = await query(connection, `SELECT  sum(round(((data_length + index_length) / 1024 / 1024), 2))  as "db_size_mb"
                // FROM information_schema.TABLES`)
                // console.log("Database size, MB", sizeRes)

                // console.log(await query(connection, 'show table status from `sampledb`;'))

                //fill with data
                // if (sizeRes < TARGET_DB_SIZE) {
                // console.log(`>>> Database size is ${sizeRes} MB. ${TARGET_DB_SIZE} expected. Filling with more data`)
                for (let i = 0; i < 5; i++) {
                    await loadSampleData(connection, 1000 * 1000)
                }
                // }

                return resolve()
            } catch (e) {
                return reject(e)
            } finally {
                // console.log('relase connection')
                connection && connection.release(); // always put connection back in pool after last query
            }

            // var sql = "SELECT id,name FROM users";
            // connection.query(sql, [], function (err, results) {
            //     connection.release(); // always put connection back in pool after last query
            //     if (err) {
            //         console.log(err);
            //         callback(true);
            //         return;
            //     }
            //     callback(false, results);
            // });
        });
    })
}
const secsSince = lastTs => Math.round((Number(new Date) - lastTs) / 1000)

const start = async function () {
    for (let i = 0; i < 1000; i++) {
        await delay(1000)
        try {
            await benchmarkConnection()
            console.log(new Date, 'Benchmark OK!')
        } catch (e) {
            console.log(String(e).slice(0, 200))
            console.log(new Date, 'Benchmark failed, last connection ' + secsSince(lastConnectionTs) + 's ago')
        }
    }
}
start()