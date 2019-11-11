module.exports = db => {
  return {
    'members': require('./team')(db),
    'seminars': require('./seminar')(db),
    'news': require('./news')(db),
    'feed': require('../feed')(require('./news')(db), require('./seminar')(db)),
    'publications': require('./publication')(db),
    'projects': require('./projects')(db)
  }
}
