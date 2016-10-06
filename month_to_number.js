function monthToNumber(month){
  if (month == "января") {
    month = 1;
  }
  else if (month == "октября") {
    month = 11;
  }
  return(month)
}

module.exports = {
  monthToNumber : monthToNumber
}
