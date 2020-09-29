const query = require('./query')

module.exports = async function (connection) {
    const dbResult = await query(connection, 'CREATE DATABASE IF NOT EXISTS sampledb')
    if (dbResult.changedRows !== 0) {
        console.log('>>> DB created')
    }

    const tableResult = await query(connection, `
create table IF NOT EXISTS sampledb.messages(
    id INT NOT NULL AUTO_INCREMENT,
    some_words TEXT NOT NULL,
    added_date datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ( id )
);   
    `)

    if (tableResult.changedRows !== 0) {
        console.log('>>> Table created')
    }

}