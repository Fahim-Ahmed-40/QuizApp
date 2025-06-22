const progressBar =document.querySelector(".progress-bar"),
progressText =document.querySelector(".progress-text");

const progress =(value) => {
   const percentage = (value/time) * 100;
   progressBar.style.width = `${percentage}%`;
   progressText.innerHTML=`${value}`;
}

let questions=[],
  time=30,
  score=0,
  currentQuestion,
  timer;

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startscreen = document.querySelector(".start-screen");


const startQuiz = () =>{
    const num= numQuestions.value;
    const cat = category.value;
    const diff=difficulty.value;

    let url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        questions=data.results;
        startscreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion=1;
        showQuestion(questions[0]);
    });
};



// const startQuiz = () => {
//     const num = numQuestions.value;
//     const cat = category.value;
//     const diff = difficulty.value;

//     let url = `https://opentdb.com/api.php?amount=${num}&type=multiple`;

//     if (cat !== "any" && cat !== "") {
//         url += `&category=${cat}`;
//     }

//     if (diff !== "any" && diff !== "") {
//         url += `&difficulty=${diff}`;
//     }

//     fetch(url)
//         .then((res) => res.json())
//         .then((data) => {
//             if (data.results.length === 0) {
//                 alert("No questions found for the selected options. Please try different settings.");
//                 return;
//             }
//             questions = data.results;
//             startscreen.classList.add("hide");
//             quiz.classList.remove("hide");
//             currentQuestion = 1;
//             showQuestion(questions[0]);
//         });
// };
















startBtn.addEventListener("click",startQuiz);

const submitBtn = document.querySelector(".submit"),
nextBtn=document.querySelector(".next");

const showQuestion =(question) =>{
    const questionText= document.querySelector(".question"),
    answerWrapper = document.querySelector(".answer-wrapper"),
    questionNumber =document.querySelector(".number");

    questionText.innerHTML = question.question;
    //correct an wrong answers are separate lets mix them
    const answers=[
        ...question.incorrect_answers,
        question.correct_answer.toString(),
    ];
    //correct answer will be always at last
    // lets shuffle the array

    answers.sort(()=> Math.random() - 0.5);
    answerWrapper.innerHTML = "";
    answers.forEach((answer)=>{
       answerWrapper.innerHTML+=`
       <div class="answer ">
                        <span class="text"> ${answer}</span>
                        <span class="checkbox">
                            <span class="icon">&#10003;</span>
                        </span>
                    </div>
        `
    });

    questionNumber.innerHTML=`
    Question <span class="current">${
        questions.indexOf(question)+ 1}
        </span> <span class="total">/${questions.length}</span>
    `;

    //lets add eventListner on answer

    const answersDiv  = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) =>{
        answer.addEventListener("click",()=>{
            //if answer not already submitted
            if(!answer.classList.contains("checked")){
            //remove selected from other answer
            answersDiv.forEach((answer)=>{
                answer.classList.remove("selected")
            });
            //add selected on currently clicked
            answer.classList.add("selected");
            //after any answer is selected enable submit btn
            submitBtn.disabled = false;
        }
        });
    });
    //after uploading start timer
    time= timePerQuestion.value;
    startTimer(time);

};

const startTimer = (time) => {
    timer = setInterval(() => {
      if(time >= 0){
        //if timer more than 0 means time remaining 
        //move progress
        progress(time);
        time--;
      }
      else{
        //if time finishes means less than 0
        checkAnswer();
      }
    },1000);

};

submitBtn.addEventListener("click", () =>{
    checkAnswer();
});
// const checkAnswer = () => {
//     //firstclear interval when check answer triggered
//     clearInterval(timer);

//     const selectedAnswer = document.querySelector(".answer.selected");
//     //any answer is selected
//     if(selectedAnswer){
//         const answer = selectedAnswer.querySelector(".text");
//         if(answer == questions[currentQuestion - 1].correct_answer) {
//             //if answer is matched with current question correct answer
//              score++;
//              //add correct class on selected
//              selectedAnswer.classList.add("correct");
//         }
//         else{
//             //if wrong selected
//             //add wrong class on selected but then also add correct on correct answer
//             //correct added lets add wrong on selected
//             selectedAnswer.classList.add("wrong");
//             const correct_Answer = document.querySelectorAll(".answer").forEach((answer)=>{
//                 if(
//                     answer.querySelector(".text").innerHTML == 
//                     questions[currentQuestion - 1].correct_answer)
//                     {
//                   //only add correct class to correct answer
//                        answer.classList.add("correct");
//                     }
//             });
//         }
//     }
// };
//////////##############
const checkAnswer = () => {
    clearInterval(timer); // stop timer when submitted

    const selectedAnswer = document.querySelector(".answer.selected");

    if (selectedAnswer) {
        const selectedText = selectedAnswer.querySelector(".text").textContent.trim();
        const correctAnswerText = questions[currentQuestion - 1].correct_answer.trim();

        if (selectedText === correctAnswerText) {
            selectedAnswer.classList.add("correct");
            score++;
        } else {
            selectedAnswer.classList.add("wrong");

            // Highlight the correct answer
            document.querySelectorAll(".answer").forEach((answer) => {
                const answerText = answer.querySelector(".text").textContent.trim();
                if (answerText === correctAnswerText) {
                    answer.classList.add("correct");
                }
            });
        }
    }

    // After submitting, show next button
    nextBtn.style.display = "block";
    submitBtn.disabled = true;

    // Prevent clicking new options
    document.querySelectorAll(".answer").forEach((a) => {
        a.classList.add("checked");
    });

    //answer check will be also  triggered when time reaches
    //what if nothing selected and time finishes
    //lets just add correct class on correct answer

    // else{
    //     const correctAnswer=document.querySelectorAll(".answer")
    //     .forEach((answer)=>{
    //         if(
    //             answer.querySelector(".text").innerHTML==
    //             questions[currentQuestion - 1].correct_answer
    //         ){
    //             answer.classList.add("correct");
    //         }
    //     });
    // }

    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer) =>{
        answer.classList.add("checked");
        //add checked class on all answer as we check for it when on click answer if its present do nothing
    });
};


































// const checkAnswer = () => {
//     clearInterval(timer); // stop timer when submitted

//     const selectedAnswer = document.querySelector(".answer.selected");

//     if (selectedAnswer) {
//         const selectedText = selectedAnswer.querySelector(".text").textContent.trim();
//         const correctAnswerText = questions[currentQuestion - 1].correct_answer.trim();

//         if (selectedText === correctAnswerText) {
//             selectedAnswer.classList.add("correct");
//             score++;
//         } else {
//             selectedAnswer.classList.add("wrong");

//             // Highlight the correct answer
//             document.querySelectorAll(".answer").forEach((answer) => {
//                 const answerText = answer.querySelector(".text").textContent.trim();
//                 if (answerText === correctAnswerText) {
//                     answer.classList.add("correct");
//                 }
//             });
//         }
//     } else {
//         // This else now properly matches the if (selectedAnswer) block
//         const correctAnswerText = questions[currentQuestion - 1].correct_answer.trim();
//         document.querySelectorAll(".answer").forEach((answer) => {
//             const answerText = answer.querySelector(".text").textContent.trim();
//             if (answerText === correctAnswerText) {
//                 answer.classList.add("correct");
//             }
//         });
//     }

//     // Show next button and disable submit
//     nextBtn.style.display = "block";
//     submitBtn.disabled = true;

//     // Prevent clicking more answers after submission
//     document.querySelectorAll(".answer").forEach((a) => {
//         a.classList.add("checked");
//     });
// };



  