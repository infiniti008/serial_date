function monthToNumber(month){
  if (month == "января") {
    month = 1;
  }
  else if (month == "февраля") {
    month = 2;
  }
  else if (month == "марта") {
    month = 3;
  }
  else if (month == "апреля") {
    month = 4;
  }
  else if (month == "мая") {
    month = 5;
  }
  else if (month == "июня") {
    month = 6;
  }
  else if (month == "июля") {
    month = 7;
  }
  else if (month == "августа") {
    month = 8;
  }
  else if (month == "сентября") {
    month = 9;
  }
  else if (month == "октября") {
    month = 10;
  }
  else if (month == "ноября") {
    month = 11;
  }
  else if (month == "декабря") {
    month = 12;
  }
  return(month)
}

module.exports = {
  monthToNumber : monthToNumber
}
