module.exports = fs => {
  return {
    'members': require('./team')(fs),
    'seminars': require('./seminar')(fs),
    'news': require('./news')(fs),
    'feed': require('../feed')(require('./news')(fs), require('./seminar')(fs)),
    'publications': require('./publication')(fs),
    'projects': require('./projects')(fs)
  }
}
