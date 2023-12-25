class Question{
    constructor(id,questionText,options,correctAnswer,explanation)
    {
        this.id = id
        this.questionText = questionText
        this.options = options
        this.correctAnswer = null;
        for(let crct in correctAnswer)
        {
            if(correctAnswer[crct] == 'true' || correctAnswer[crct] == 'True')
            {
                this.correctAnswer = this.options[crct.split("_correct")[0]]
            }
        }
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
        attemptted++
        let option = document.getElementById(this.markedElement)
        if(this.correctAnswer == this.markedAnswer)
        {
            option.classList.add('correct')
            score++;
        }
        else option.classList.add('wrong')
        if(attemptted == total)
        {
            console.log(score)
            document.getElementById('scored').textContent = score
            let scoreBoard = document.getElementById('score')
            scoreBoard.style.visibility = 'visible'
        }
        let explanation = document.createElement('div')
        let span = document.createElement('span')
        span.textContent = `correct answer: ${this.correctAnswer}`
        explanation.classList.add('explanation')
        explanation.textContent = this.explanation
        document.getElementById(this.id).append(span,explanation)
        element.target.setAttribute('disabled','true')
    }
}

var quizPage = document.getElementById('quiz_page')
var total = document.getElementById('total')
var attemptted = 0;
var score = 0;
var questions = null
const makeRequest = async () => {
    let url = 'https://quizapi.io/api/v1/questions?apiKey=GJpmwF0WZUXozYXYjaQZF9187gwFj9bo54r84QLF&Limit=10&difficulty=easy'
    const res = await fetch(url)
    questions = await res.json()
    total.textContent = questions.length
    let index = 1;
    for(let question of questions)
    {
        let q = new Question(question["id"],index++ +". "+ question["question"],question["answers"],question["correct_answers"],question["explanation"])
    }
}
makeRequest()