var quizInterval;

var triviaGame = {
    // initial full-scope variables (non-global)
    timeLeft: 60,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unansweredQuestions: 4,
    overallGrade: 0,
    winCondition: 'none',
    questionTracker: 0,
    quizSheet: {
        question1: {
            ques: 'How many F\'s are in this sentence: <br> FINISHED FILES ARE THE RESULT OF YEARS OF SCIENTIFIC STUDY.',
            ans1: '2',
            ans2: '3',
            ans3: '4',
            ans4: '5',
            correctAnswer: 'd',
            winGif: 'assets/images/congrats1.gif',
            loseGif: 'assets/images/failure1.gif'
        },
        question2: {
            ques: 'John has two coins that add up to $0.55, one is not a nickel. What two coins does he have?',
            ans1: '2x quarters',
            ans2: '1x half-dollar, 1x nickel',
            ans3: '55x pennies',
            ans4: 'None of the above',
            correctAnswer: 'b',
            winGif: 'assets/images/congrats2.gif',
            loseGif: 'assets/images/failure2.gif'
        },
        question3: {
            ques: 'If there are 6 apples on a table and you take 4, how many apples are there?',
            ans1: '2',
            ans2: '4',
            ans3: '6',
            ans4: '10',
            correctAnswer: 'c',
            winGif: 'assets/images/congrats3.gif',
            loseGif: 'assets/images/failure3.gif'
        },
        question4: {
            ques: 'If there are 12 fish and half of them drown, how many are there?',
            ans1: '12',
            ans2: '6',
            ans3: '2',
            ans4: '0',
            correctAnswer: 'a',
            winGif: 'assets/images/congrats4.gif',
            loseGif: 'assets/images/failure4.gif'
        }
    },

    // set up initial game state
    setupGame: function () {
        // hide sections, show start section
        $('#quiz-body').addClass('hide-this');
        $('#quiz-results').addClass('hide-this');

        // Start button on click function to wait for game to begin
        $('#start-button').on('click', function () {
            triviaGame.startGame();
        });
    },

    startGame: function () {
        // hide start section, show quiz body
        $('#quiz-start').addClass('hide-this');
        $('#quiz-body').removeClass('hide-this');

        // create question array
        var objKeys = Object.keys(triviaGame.quizSheet);

        // start timer
        quizInterval = setInterval(this.tickTimer, 1000);

        // generate next question
        triviaGame.nextQuestion(objKeys);
    },

    // inject text, wait for submit, check answer, react
    nextQuestion: function (pKeys) {
        // inject question & answer text
        $('#gif-container').addClass('hide-this');
        $('#answers-container').removeClass('hide-this');
        $('#question-header').html(triviaGame.quizSheet[pKeys[this.questionTracker]].ques);
        $('#ans1').text(triviaGame.quizSheet[pKeys[this.questionTracker]].ans1);
        $('#ans2').text(triviaGame.quizSheet[pKeys[this.questionTracker]].ans2);
        $('#ans3').text(triviaGame.quizSheet[pKeys[this.questionTracker]].ans3);
        $('#ans4').text(triviaGame.quizSheet[pKeys[this.questionTracker]].ans4);

        // when an answer button is clicked, check answers
        $('.answer-button').on('click', function () {
            $('.answer-button').off('click');
            triviaGame.checkAnswer(this.value, pKeys);
        });
    },

    tickTimer: function () {
        triviaGame.timeLeft--;
        $('#time-remaining').text(triviaGame.timeLeft);

        if (triviaGame.timeLeft === 0) {
            triviaGame.winCondition = 'timeout';
            triviaGame.showResults();
        }
    },

    checkAnswer: function (pAnswer, pKeys) {
        // decrease unanswered questions
        this.unansweredQuestions--;

        if (triviaGame.unansweredQuestions === 0) {
            $('#next-button').text('Show Results');
        }

        // compare answer to correct answer
        // if you're right
        if (pAnswer === this.quizSheet[pKeys[this.questionTracker]].correctAnswer) {
            this.correctAnswers++;

            // hide answers, fill gif, show gif
            $('#answers-container').addClass('hide-this');
            $('#gif-holder').html('<img src='+ this.quizSheet[pKeys[this.questionTracker]].winGif +' alt="correct!" />');
            $('#gif-container').removeClass('hide-this');
        }
        //if you're wrong
        else {
            this.incorrectAnswers++;

            // hide answers, fill gif, show gif
            $('#answers-container').addClass('hide-this');
            $('#gif-holder').html('<img src='+ this.quizSheet[pKeys[this.questionTracker]].loseGif +' alt="correct!" />');
            $('#gif-container').removeClass('hide-this');
        }

        // listen for next button to be pressed
        $('#next-button').on('click', function () {
            $('#next-button').off('click');

            // if quiz is done show results
            if (triviaGame.unansweredQuestions === 0) {
                triviaGame.winCondition = 'finished';
                triviaGame.showResults();
            }
            // if not increment the question tracker and go to the next question
            else {
                triviaGame.questionTracker++;
                triviaGame.nextQuestion(pKeys);
            }
        });
    },

    showResults: function () {
        // pause timer
        clearInterval(quizInterval);

        // consider win condition
        if (this.winCondition === 'finished') {
            $('#times-up').addClass('hide-this');
        }
        else {
            $('#congrats').addClass('hide-this');
        }

        // fill scores in
        this.overallGrade = String((this.correctAnswers / 4) * 100) + '%';
        $('#score-grade').text(this.overallGrade);
        $('#score-correct').text(this.correctAnswers);
        $('#score-incorrect').text(this.incorrectAnswers);
        $('#score-unanswered').text(this.unansweredQuestions);

        // hide quiz body and show results
        // do this after the score edits in case of lag
        $('#quiz-body').addClass('hide-this');
        $('#quiz-results').removeClass('hide-this');

        $('#restart-button').on('click', function () {
            triviaGame.restartGame();
        })
    },

    restartGame: function () {
        this.timeLeft = 60;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.unansweredQuestions = 4;
        this.overallGrade = 0;
        this.winCondition = 'none';
        this.questionTracker = 0;

        $('#time-remaining').text(triviaGame.timeLeft);
        $('#next-button').text('Next Question');

        $('#congrats').removeClass('hide-this');
        $('#times-up').removeClass('hide-this');

        $('#quiz-results').addClass('hide-this');
        $('#quiz-start').removeClass('hide-this');
    }
};

triviaGame.setupGame();