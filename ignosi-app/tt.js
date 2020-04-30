const fs = require('fs');
const util = require('util');


// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

function getStuff(file) {
  return readFile(file, 'utf-8');
}

// Can't use `await` outside of an async function so you need to chain
// with then()
const lesson = '08-OLD-SOCIAL STUDIES-8.10.B'

const questions = getStuff('astabquestionbank.json').then( d => {
  let data = JSON.parse(d)
  const result = data.filter( dat => dat['qbLessonName'] === lesson)
  const sortedResult = sortByKey(result, 'SerialNumber')
  return sortedResult
})
const passages = getStuff('astabpassagebank.json').then( d => {
  let data = JSON.parse(d)
  const result = data.filter( dat => dat['pbLessonName'] === lesson)
  return result
})
const answers = getStuff('astabanswerbank.json').then( d => {
  let data = JSON.parse(d)
  const result = data.filter( dat => dat['abLessonName'] === lesson)
  return result
})

const sortByKey = (array, key) => {
  return array.sort(function(a, b) {
      const aKey = a[key]
      const bKey = b[key]
      return ((aKey < bKey) ? -1 : ((aKey > bKey) ? 1 : 0))
    })
  }

const passageByQuestion = (id, index, randomize = false) => {
    return passages.filter(pssg => {
      if(!randomize) {
        return (pssg.pbPassageID === id && pssg.pbSequencer === index)
      }
      return (pssg.pbPassageID === id)  
  })
}

const answerByQuestion = (id, randomize = false) => {
  const ansArray = answers.filter(ans => {
    return ans.abQuestionId === id
  })
  if(!randomize) {
    return ansArray
  }
  return shuffleFisherYates(ansArray)
}

// https://medium.com/@oldwestaction/randomness-is-hard-e085decbcbb2
const shuffleFisherYates = (array) => {
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
}

answers.then (data => console.log(data))


