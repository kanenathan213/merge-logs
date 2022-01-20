"use strict";

// Print all entries, across all of the sources, in chronological order.

/*

Possible strategies considered
1) Throw all entries into a heap (essentially, let the heap sort them), then pop them off the heap and print them
Pros - clean, easy
Cons - allocates memory for all logs at once

2) Find start and end logs for each log source. Sort by start
Cons - we don't know end date, only have access to last log

3) Pair log sources one by one, merge them

4) (Chosen approach) Add all first entries to a sorted list, then shift / remove 0th index item, print it, then grab next item from that log source, insert it, repeat until empty

Time: O(M*log N)
Space: O(N) where N is number of log sources
where N is number of log sources and M is length of longest log source

*/

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
  const currentItems = []
  for (let i = 0; i < logSources.length; i++) {
    const log = logSources[i].pop()
    if (log === false) {
      continue
    }
    insertIntoSortedPosition({
      log,
      logSourceIndex: i,
    }, currentItems)
  }
  while (currentItems.length > 0) {
    const { log: oldestLog, logSourceIndex } = currentItems.shift()
    printer.print(oldestLog)
    const nextLog = logSources[logSourceIndex].pop()
    if (nextLog !== false) {
      insertIntoSortedPosition({ log: nextLog, logSourceIndex }, currentItems)
    }
  }
  
  printer.done()
  return console.log("Sync sort complete.");
};
