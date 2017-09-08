var quizInterval;

var triviaGame = {
    // initial full-scope variables (non-global)
    timeLeft: 60,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unansweredQuestions: 0,
    overallGrade: 0,
    answerSheet: ['d', 'b', 'c', 'a'],
    winCondition: 'none',

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

        // start timer
        quizInterval = setInterval(this.tickTimer, 1000);

        // when the submit button is clicked, check all answers
        $('#submit-button').on('click', function () {
            triviaGame.winCondition = 'submitted';
            triviaGame.checkAnswers();
        });
    },

    tickTimer: function () {
        triviaGame.timeLeft--;
        $('#time-remaining').text(triviaGame.timeLeft);

        if (triviaGame.timeLeft === 0) {
            triviaGame.checkAnswers();
        }
    },

    checkAnswers: function () {
        var questionArray = ['q1-answer', 'q2-answer', 'q3-answer', 'q4-answer'];
        var answerArray = [];

        clearInterval(quizInterval);

        // build answer array from form inputs
        for (var i = 0; i < questionArray.length; i++) {
            // generate answer list and set answered flag
            var questionAnswers = document.getElementsByName(questionArray[i]);
            var answered = false;

            for (var j = 0; j < questionAnswers.length; j++) {
                // run through each answer to find the selected one
                if (questionAnswers[j].checked) {
                    answerArray.push(questionAnswers[j].value);
                    answered = true;
                }
            }
            // if the questions isn't answered, mark it as none
            if (answered === false) {
                answerArray.push('none');
            }
        }

        // compare answer array to answer sheet
        for (var k = 0; k < answerArray.length; k++) {
            if (answerArray[k] === 'none') {
                this.unansweredQuestions++;
            }
            else if (answerArray[k] === this.answerSheet[k]) {
                this.correctAnswers++;
            }
            else {
                this.incorrectAnswers++;
            }
        }

        // calculate overall grade
        this.overallGrade = String((this.correctAnswers / 4) * 100) + '%';
        this.showResults()
    },

    showResults: function () {
        // consider win condition
        if (this.winCondition === 'submitted') {
            $('#times-up').addClass('hide-this');
        }
        else {
            $('#congrats').addClass('hide-this');
        }

        // fill scores in
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
        this.unansweredQuestions = 0;
        this.overallGrade = 0;
        this.winCondition = 'none';

        $('#time-remaining').text(triviaGame.timeLeft);

        $('input[name="q1-answer"]').prop('checked', false);
        $('input[name="q2-answer"]').prop('checked', false);
        $('input[name="q3-answer"]').prop('checked', false);
        $('input[name="q4-answer"]').prop('checked', false);

        $('#quiz-results').addClass('hide-this');
        $('#quiz-start').removeClass('hide-this');
    }
};

triviaGame.setupGame();