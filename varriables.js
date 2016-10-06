var selector = require('./selector.json');

var conf = {
    uri : selector.Arrow.Url,
    selectors : selector.Arrow.Info
}

function changeUrlInConf(url){
  var configure = {
      uri : url,
      selectors : selector.Info
  }
  return(configure);
}

module.exports = {
    conf : conf,
    changeUrlInConf : changeUrlInConf
}
