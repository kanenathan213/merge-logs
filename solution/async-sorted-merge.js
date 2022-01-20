"use strict";

// Print all entries, across all of the *async* sources, in chronological order.


function insertIntoSortedPosition(item, arr) {
  arr.splice(findInsertPosition(item, arr), 0, item)
}

function findInsertPosition(item, arr) {
  let low = 0,
      high = arr.length

  while (low < high) {
      const mid = Math.floor((low + high) / 2)
      if (arr[mid].log.date < item.log.date) low = mid + 1
      else high = mid
  }
  return low
}

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    Promise.all(logSources.map(source => source.popAsync())).then((logs) => {
      const sortedLogs = []
      for (let i = 0; i < logs.length; i++) {
        insertIntoSortedPosition({
          log: logs[i],
          logSourceIndex: i,
        }, sortedLogs)
      }
      return sortedLogs
    }).then((sortedLogs) => {
      while (true) {
        if (sortedLogs.length === 0) {
          printer.done()
          resolve(console.log("Async sort complete."))
          break;
        }
        const { log: oldestLog, logSourceIndex } = sortedLogs.shift()
        printer.print(oldestLog)
        logSources[logSourceIndex].popAsync().then((nextLog) => {
          if (nextLog !== false) {
            insertIntoSortedPosition({ log: nextLog, logSourceIndex }, sortedLogs)
          }
        })
      }
    })
  });
};
