class Question{
    constructor(id,questionText,options,correctAnswer,explanation)
    {
        this.id = id
        this.questionText = questionText
        this.options = options
        this.correctAnswer = correctAnswer;
        this.markedElement = null;
        this.markedAnswer = null;
        this.explanation = explanation == null ? 'No explanation' : explanation;
        this.createQuestion()
    }

    createQuestion() {
        let question = document.createElement('div')
        question.id = this.id
        question.classList.add('question')
        let qText = document.createElement('p')
        qText.textContent = this.questionText
        qText.classList.add('text')
        let optionsList = document.createElement('div')
        optionsList.classList.add('options')
        for(let opt in this.options)
        {
            if(this.options[opt] == null)
            {
                continue
            }
            let option = document.createElement('div')
            option.id = this.options[opt]+opt
            option.classList.add('option')
            let radio = document.createElement('input')
            radio.type = 'radio'
            radio.name = this.questionText
            radio.id = this.options[opt]
            radio.onchange = () =>{
                this.markedElement = option.id
                this.markedAnswer = this.options[opt]
            }
            let label = document.createElement('label')
            label.setAttribute('for',this.options[opt])
            label.textContent = this.options[opt]
            option.append(radio,label)
            optionsList.appendChild(option)
        }
        let submit = document.createElement('input')
        submit.type = 'button'
        submit.value = 'submit'
        submit.classList.add('submit')
        submit.onclick = (element) => this.validate(element)
        question.append(qText,optionsList,submit)
        quizPage.appendChild(question)
    }

    validate(element)
    {
        if(this.markedAnswer == null)
        {
            return
        }
        next.removeAttribute('disabled')
        attempttedQues++
        updateProgress()
        updateScore()
        let option = document.getElementById(this.markedElement)
        if(this.options[this.correctAnswer] == this.markedAnswer)
        {
            option.classList.add('correct')
            score++;
        }
        else
        {
            option.classList.add('wrong')
        }
        if(attempttedQues == questions.length)
        {
            document.getElementById('score').textContent = `${score}/${questions.length}`
            scoreBoard.style.display = 'flex'
        }
        let explanation = document.createElement('div')
        let span = document.createElement('span')
        span.textContent = `correct answer: ${this.options[this.correctAnswer]}`
        explanation.classList.add('explanation')
        explanation.textContent = this.explanation
        document.getElementById(this.id).append(span,explanation)
        element.target.setAttribute('disabled','true')
    }
}

var quizPage = document.getElementById('quiz_page')
var total = document.getElementById('total')
var attempttedQues = 0;
var score = 0;
let attempted = document.getElementById('attempted')
var scoreBoard = document.getElementById('scoreboard')
var questions = null
let index = 0;
var next = document.getElementById('next')
let progress = document.getElementById('progress')
let currentProgress = document.getElementById('current-progress')
const makeRequest = async () => {
    let url = './data.json'
    const res = await fetch(url)
    questions = await res.json()
    total.textContent = questions.length
    shuffle()
    loadQuestion(index)
}
makeRequest()
function loadQuestion(index)
{
    let question = questions[index]
    let q = new Question(question["id"],index+1 +". "+ question["question"],question["options"],question["correctAnswer"],question["explanation"])
}

function updateScore()
{
    attempted.textContent = attempttedQues
}
function shuffle()
{
    for (let i = questions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
    }
}
next.addEventListener('click', () => {
    quizPage.innerHTML=""
    loadQuestion(++index)
    next.setAttribute('disabled','true')
})

function updateProgress()
{
    let width = (attempttedQues / questions.length) * 100
    currentProgress.style.width = width + '%'
    currentProgress.style.height = '10px'
}