let $lastActive;

$(document).ready(function () {
    let $questionWrapper = $("#question-wrapper"); 				// This variable explains to jquery what to look for 
    // in the HTML selectors. i.e. our question wrapper

    loadQuestionsInto($questionWrapper);			   			// This loads the question from the JSON file (called elsewhere), 
    // into our wrapper.
    $('.special-character').on('click', function () {
        if ($lastActive) { 						   			    // This Boolean checks to see if the last active input 
            $lastActive											// was from .question-item (thus making it our user input). 
                // If it is, this becomes a 'truthy' variable meaning it executes.
                .val($lastActive.val() + $(this).attr('data-char'))
                .focus();			   							// This is a predefined jquery command which gives the focus back  
            // to the same element selected prior to the 'on click command'. 
        }  														// in this case, the 'char' button press.
    });

    $questionWrapper.on('focus', '.question-item input', function () {
        $lastActive = $(this);									// This marks which input is the last selected before 'char' click
    });
});

$('#hide-submit').click(function () {
    $('.table-hide').toggle();                              // This adds a jquery class to 'toggle' the visibility of an element.
    $(this).find('span').toggleClass('hide');
});

//code for the check button
$('#submit').click(function () {
    $(this).addClass("hidden");
    $('#again').removeClass("hidden");

    $('.question').each(function () {
        let correctAnswerArray = $(this).attr('data-answer').split('|');
        let userAnswer = $(this).find('input').val();

        if (checkAnswer(correctAnswerArray, userAnswer)) {  //Adds CSS to show green/red indicator around the input box.
            $(this).closest('.form-group')
                .addClass('has-success')
                .removeClass('has-error');
        } else {
            $(this).closest('.form-group')
                .removeClass('has-success')
                .addClass('has-error');
        }

        $(this).next('.answer')
            .removeClass('hide');

    });
});

// The below code is for the Try Again? button
$('#again').click(function () {
    $(this).addClass("hidden");
    $('#submit').removeClass("hidden");

    loadQuestionsInto($("#question-wrapper"));
});

function loadQuestionsInto($container) {                    // Now container=questionWrapper (where the questions are stored on the page)
    let filename = $container.data('question-file');

    $.getJSON(`js/${filename}?cache=` + Date.now())           // This is a slight modification to cause 'cache-busting'. Basically, it appends a number to the url to prevent the browser caching this file.

        //If the file is successfully loaded this method is called
        .done(function (data) {
            $container.empty();
            selectedQuestionsArray = [];
            for (let i = 0; i < 5; i++) {
                let question = data.splice(Math.random() * data.length | 0, 1);
                selectedQuestionsArray.push(question[0]);
            }

            selectedQuestionsArray.forEach(function (question, i) { //What follows is what creates the template for our questions.
                let questionSplit = question.question.split('####');
                // This splits a string at the #### delimiter and allows the input field to be placed in the middle of the sentence

                let questionLine = '';
                questionLine += `<span class="question-line">${questionSplit[0]}</span>`;
                questionLine += `<input type="text" class="user-input form-control" placeholder="answer">`;
                questionLine += `<span class="question-line">${questionSplit[1]}</span>`;

                let questionItem = `<div class="question-item form-group">
                        <div class="question" data-answer="${question.correctAnswer}">
                            ${questionLine}
                        </div>
                        <div class="answer hide">
                            ${question.explanation}
                        </div>
                    </div>`; //The backticks (`) allow for 'template literals'. These are string templates which allow embedded expressions. 

                $container.append(questionItem);

            });
        })
        //If the file is NOT successfully loaded this method is called to aid my debugging
        .fail(function (jqxhr, textStatus, error) {
            console.log(textStatus, error);
        });
}

function checkAnswer(answerArray, userAnswer) {
    let wasUserCorrect = false;

    answerArray.forEach(function (answer) {
        if (answer.toUpperCase() == userAnswer.toUpperCase()) {
            wasUserCorrect = true;
        }
    })

    return wasUserCorrect;
}