const query = require('./query')
var randomWords = require('random-words');

module.exports = async function (connection, targetItems = 3) {
    const PER_TX = Math.min(Math.round(targetItems / 50) + 1, 20000)

    const [{ cnt: itemsExist }] = await query(connection, 'SELECT COUNT(id) as cnt from sampledb.messages')

    // console.log('db items', itemsExist)

    if (itemsExist >= targetItems) return

    console.log('>>> Whoops! Noot enough sample items. Was database wiped!?', itemsExist)

    const rows = []
    for (let i = itemsExist; i < Math.min(targetItems, itemsExist + PER_TX); i++) {
        // for (let i = 0; i < targetItems; i++) {
        rows.push([randomWords({ min: 2, max: 40 }).join(' ')])
    }
    // console.log(rows)
    await query(connection, 'USE sampledb;')
    await query(connection, "INSERT INTO messages (some_words) VALUES ?", [rows])
}