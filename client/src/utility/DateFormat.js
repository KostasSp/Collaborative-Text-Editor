//originally made for my Investment tracker project - came in handy for this one

const currentDateTime = () => {
  let date = new Date();
  let year = date.getFullYear(),
    month = date.getMonth() + 1, // months are zero-indexed
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    seconds = date.getSeconds();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  if (seconds < 10) seconds = "0" + seconds;

  return (
    day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + seconds
  );
};

module.exports = currentDateTime();
