const moment = require('moment')

module.exports = {
  'getDayDate': dateStr => moment(dateStr).format('LL'),
  'getHourDate': dateStr => moment(dateStr).format('LLLL')
}
