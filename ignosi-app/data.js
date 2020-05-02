const fs = require('fs');
const util = require('util');


// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile)
const appendFile = util.promisify(fs.appendFile)

async function asyncGetStuff(file, lesson, key) {
  const dataSource = await readFile(file, 'utf-8')
  let data = JSON.parse(dataSource)
  const result = data.filter(item => item[key] === lesson)
  return result
}
const lessonName = '11-SCIENCE-11.6.D'

const sortByKey = (array, key) => {
  return array.sort(function(a, b) {
      const aKey = a[key]
      const bKey = b[key]
      return ((aKey < bKey) ? -1 : ((aKey > bKey) ? 1 : 0))
    })
  }

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

const getOnePassage = (pid) => {
  let pass = '';
  passages.filter(passage => {
    if(passage.pbPassageID === pid) {
      // console.log(passage.pbPassage)
      pass = passage.pbPassage
    }
  })
  // console.log(pssg)
  return pass
}

const getOneAnswer = (qid, randomize = true) => {
  let answerSet = answers.filter(answer => answer.abQuestionId === qid)
  
  answerSet = answerSet.map( ans => {
  let currentAnswer = ans.abAnswer.replace(/^,/, '')
    return `<br /><input type="radio" id="${ans.abAnswerId}" value="${ans.abCorrectAnswer}"> ${currentAnswer}`
  })
  if(!randomize) {
    return answerSet
  }
  answerSet = shuffleFisherYates(answerSet)
  return answerSet
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
async function initialize (lesson, randomoze = false) {
  questions = await asyncGetStuff('astabquestionbank.json', lesson, 'qbLessonName')
  questions = await sortByKey(questions, 'SerialNumber')
  if(randomoze){
    questions = shuffleFisherYates(questions)
  }

  passages = await asyncGetStuff('astabpassagebank.json', lesson, 'pbLessonName')
  answers = await asyncGetStuff('astabanswerbank.json', lesson, 'abLessonName')
}

async function getQuestionList(lesson) {
  await initialize(lesson)
  let fileName = lessonName.replace(/,?,\s+/g,'')
  fileName = fileName + '.html'
  await writeFile(fileName, `<!DOCTYPE html><html><head><title>${lessonName}</title></head><body>'`)
  for (let i = 0; i<questions.length; i++) {
    const question = questions[i].qbQuestion
    const passage = getOnePassage(questions[i].qbPassageId) || ''
    const answer = getOneAnswer(questions[i].qbQuestionId).join('')

    await appendFile(fileName, question)
    await appendFile(fileName, passage)
    await appendFile(fileName, answer)
    await appendFile(fileName, '<hr />')
  }
  await appendFile(fileName, '</body></html>')
}
getQuestionList(lessonName)