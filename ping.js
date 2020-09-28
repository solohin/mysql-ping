const { promises } = require('fs');
const delay = require('delay')
var mysql = require('mysql');
var pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'singlemysql',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
});

let lastConnectionTs = 0

const benchmarkConnection = function () {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {


            if (err) {
                return reject(err);
            }



            connection.ping(function (err) {
                if (err) return reject(err)
                lastConnectionTs = Number(new Date)

                return resolve(err)
            })


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
            console.log('Benchmark OK!')
        } catch (e) {
            console.log('Benchmark failed, last connection ' + secsSince(lastConnectionTs) + 's ago')
        }
    }
}
start()