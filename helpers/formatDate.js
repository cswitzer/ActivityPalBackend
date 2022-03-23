const alphaToNumericDict = require("./alphaNumMonthDict.js")

const formatDate = (startTime, date) => {
  const [time, modifier] = startTime.split(" ")
  let [hours, minutes] = time.split(":")
  if (hours === "12") hours = "00"
  if (modifier === "PM") hours = parseInt(hours) + 12
  console.log(hours)

  let numericDate = alphaToNumericDict[date.split(" ")[0]]
  let year = date.split(", ")[1]
  let day = date.split(" ")[1].split(", ")[0].replace(",", "")
  return `${numericDate}-${day}-${year} ${hours}:${minutes}`
}

module.exports = formatDate
