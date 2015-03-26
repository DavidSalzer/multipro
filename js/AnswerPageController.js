function AnswerPageController(element) {
    var numberOfVisits=0;
    var alphabets = ["א", "ב", "ג", "ד", "ה", "ו","ז","ח"];
    var  html = '';
    var self = this;
    var attachTo='body';
        
    if (element)
        attachTo = element;

    this.attachEvents = function () {
        $(document).on('click', '.button-container-answer-page .print .icon', function () {
            //var toprint = new Printer('#answers-page');
            //toprint.print();

            //self.BeforePrint();
            //window.print();
            //self.AfterPrint();
        });
        $(document).on('click', '.button-container-answer-page .returnto-report .icon', function () {
            self.leave();
            main.reportController.visit();
        });
    }

    this.visit = function () {
        $(attachTo).show();
        $('#timer').show();
        $('#general-timer').hide();
        if (numberOfVisits == 0) {
            self.attachEvents();
        }
        numberOfVisits++;
    }

    this.leave = function () {
         $('#timer').hide();
         $('#general-timer').show();
         $(attachTo).hide();
    }
    this.BeforePrint = function () {
       
        var toprint = $('#answers-page').clone();
        $('.print-div').append(toprint);
        $('.print-div').show();
        $('.button-container-answer-page').hide();
        $('header').hide();
        $('.wrapper').hide();
    }
    this.AfterPrint = function () {
         $('.print-div').html('');
            $('.print-div').hide();
        $('.button-container-answer-page').show();
        $('header').show();
        $('.wrapper').show();
    }
    this.addQuestionArr = function (qArr) {
        for (var i = 0; i < qArr.length; i++) {
            self.addQuestion(qArr[i]);
        }
    }
    this.addQuestion = function (question) {
        var qState = (question.handler.answerdCorrectly()) ? "correct" : "wrong";
        var asterisk = (question.handler.asterisk) ? "selected" : "";
        var questionMark = (question.handler.questionMark) ? "selected" : "";

        html += '<div class="question-container" data-question-num="' + question.questionNumber + '">';

        html += '<div class="title icons">';
        html += '<div class="question-status">';
        html += '<div class="question-state ' + qState + '"></div>';
        html += '<div class="asterisk settings-item ' + asterisk + '" title="תזכורת לחשוב על זה שוב"></div>';
        html += '<div class="circle settings-item " title="תזכורת לפתור אחר כך"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="question-content">';
        html += '<div class="answers-container">';
        html += '<div class="question-title">';
        html += '<span class="number">' + question.questionNumber + '</span><span class="text">' + question.question + '</span></div>';
        for (var i = 0; i < question.answers.length; i++) {//add answers
            var aState = ((i + 1) == question.correctAns) ? "correct" : "";
            var wrong = ((i + 1) == question.handler.nowAnswer() && !question.handler.answerdCorrectly()) ? "wrong" : "";
            var choice = ((i + 1) == question.handler.nowAnswer()) ? "answer" : "";
            html += '<div class="answer-item" data-answer-num="' + i + 1 + '"><div class="answer-state '+aState+' '+wrong+'"></div><span class="number ' + choice + '" title="סימון תשובה">' + alphabets[i] + '.</span><span class="text">' + question.answers[i] + '</span></div>';
        }
        html += '</div>';
        html += '<div class="answer-feature">';
        html += '<div class="year-feature answer-feature-item">'+question.year+'</div>';
        html += '<div class="reference answer-feature-item" dir="ltr"><span>'+question.bookReferance[1]+'  </span><span> '+question.bookReferance[0] +'</span></div>';
        html += '</div>';
        html += '</div>';
         html += ' <div class="tip-bubble-wrapper"><div class="tip-bubble"><span class="content"><textarea placeholder="הכנס הערה"></textarea></span><div class="icon"></div></div></div>';
          html += '</div>';
    }
    this.addToView = function () {//adds attached elemnts that are sitting in html variable to view
        $(attachTo).append(html).trigger('create');
    }   
}

