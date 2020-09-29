module.exports = function (connection, sql, values = []) {
    return new Promise(async (resolve, reject) => {
        connection.query(sql, values, function (err, results) {

            if (err) {
                return reject(err)
            }
            return resolve(results)
        });
    })
}