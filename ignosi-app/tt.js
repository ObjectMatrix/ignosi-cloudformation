const fs = require('fs');
const util = require('util');


// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

async function asyncGetStuff(file, lesson, key) {
  const dataSource = await readFile(file, 'utf-8')
  let data = JSON.parse(dataSource)
  const result = data.filter(item => item[key] === lesson)
  return result
}
const lessonName = '08-OLD-SOCIAL STUDIES-8.10.B'

const sortByKey = (array, key) => {
  return array.sort(function(a, b) {
      const aKey = a[key]
      const bKey = b[key]
      return ((aKey < bKey) ? -1 : ((aKey > bKey) ? 1 : 0))
    })
  }

// const passageByQuestion = (id, index, randomize = false) => {
//     return passages.filter(pssg => {
//       if(!randomize) {
//         return (pssg.pbPassageID === id && pssg.pbSequencer === index)
//       }
//       return (pssg.pbPassageID === id)  
//   })
// }

const answerByQuestion = (qid, randomize = false) => {
  const ansArray = answers.filter(ans => {
    return ans.abQuestionId === qid
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

const getOnePassage = (qid) => {
  return passages.filter(passage => passage.pbPassageID === qid)
}

const getOneAnswer = (qid, randomize) => {
  let answerSet = answers.filter(answer => answer.abQuestionId === qid)
  if(!randomize) {
    return answerSet
  }
  return shuffleFisherYates(answerSet)
}

let questions = []
let passages = []
let answers = []

/**
 * Intialize for a given lessonName
 * Q&P: sorted by SerialNumber
 * A: answer set randomize
 * @param {lesson} lesson 
 */
async function initialize (lesson) {
  questions = await asyncGetStuff('astabquestionbank.json', lesson, 'qbLessonName')
  questions = await sortByKey(questions, 'SerialNumber')

  passages = await asyncGetStuff('astabpassagebank.json', lesson, 'pbLessonName')
  passages = await sortByKey(passages, 'SerialNumber')

  answers = await asyncGetStuff('astabanswerbank.json', lesson, 'abLessonName')
  console.log (answers)
}
async function getQuestions(lesson) {
  await initialize(lesson)

}
getQuestions(lessonName)