function TestController() {
    var self = this;

    var stage = stages[1];
    //holds questions for each visit according to stage in test
    var stagesHolder = {firstStage:[],
                         secondStage:[],
                         thirdStage:[]   };//holds the option of answers that were given, for further process- mistakes,changes, changes from mistakes and correct. according to each stage
    this.testResult = []; //save all user behavior about the questions

    question = {
        circle: 0,
        asterisk: 0,
        visited: 0,
        comment: ""
    }

    this.attachEvents = function () {
        $(".swiper-wrapper").on("click", ".asterisk", self.asterisk);

        $(".swiper-wrapper").on("click", ".circle", self.circle);

        $(".swiper-wrapper").on("click", ".answer-icon", self.pushAnswer);

        $(".swiper-wrapper").on("click", ".answer-item .number", self.pushAnswer);

        $(".swiper-wrapper").on("click", ".not-answer-icon", self.notAnswer);

        $(".swiper-wrapper").on("click", ".clear", self.clear);

        $(".swiper-wrapper").on("click", ".guess", self.guess);

        $("#finish").on("click", self.finishTest);

        $("#user-container").on("click", function () {
            window.location = "indexStatistics.html";
        });
    }

    //init the test page with the questions
    this.initTest = function (testArr) {
        html = '';
        //loop on answers
        for (i = 0; i < self.questions.length; i++) {
            html += '<div class="swiper-slide">';
            html += '     <div class="question-container" data-question-num=' + (i + 1) + '>';
            html += '         <div class="title">';
            html += '               <div class="question-status">';
            html += '                   <div class="asterisk settings-item" title="תזכורת לחשוב על זה שוב"></div>';
            html += '                   <div class="circle settings-item" title="תזכורת לפתור אחר כך"></div>';
            html += '               </div>';
            html += '               <span class="question-title">';
            html += '                   <span class="number">' + (i + 1) + '.</span><span class="text">' + self.questions[i].question + '</span></div>';
            html += '               </span>';
            html += '           <div class="answers-container">';
            //loop on answers
            for (j = 0; j < self.questions[i].answers.length; j++) {
                html += '             <div class="answer-item" data-answer-num=' + (j + 1) + '><span class="not-answer-icon" title="פסילת תשובה"></span><span class="answer-icon" title="סימון תשובה"></span><span class="number">' + self.alphabets[j] + '.</span><span class="text">' + self.questions[i].answers[j] + '</span></div>';
            }
            html += '           </div>';
            html += '           <div class="question-feature">';
            html += '               <div class="guess question-feature-item"><div class="icon"></div><div class="question-feature-text">ניחוש</div></div>';
            html += '               <div class="clear question-feature-item"><div class="icon"></div><div class="question-feature-text">נקה</div></div>';
            html += '               <div class="comment question-feature-item"><div class="icon"></div>    <div class="question-feature-text"><input type="text" placeholder="כתוב הערה"></div> </div>';

            html += '              <div class="timer question-feature-item"><div class="icon"></div><div class="question-feature-text">12:00</div></div>';
            html += '           </div>';
            html += '     </div>';
            html += '</div>';

            /////////////////////////////////////////////
            self.testResult[i] = {
                circle: 0,
                asterisk: 0,
                visited: 0,
                guess: 0,
                chooseNotAnswer: []
            };

        }


        $(".swiper-wrapper").html(html);
        $(document).tooltip();
        var fadetimer = null; //timeout for showing timer for each question
        //init the swiper
        var mySwiper = new Swiper('.swiper-container', {
            pagination: '.pagination',
            mode: 'vertical',
            //createPagination:false,
            paginationClickable: true,
            centeredSlides: true,
            mousewheelControlForceToAxis: true,
            mousewheelControl: true,
            slidesPerView: 'auto',
            watchActiveIndex: true,
            onSlideChangeStart: function (swiper) {
                //each time focused on question a timer is set to check if question is centered if less then given time so its not considered that the user is in the question, 
                //so when a question is focused the given question statrs a timer and the prev question is stopped the timer (if relevent)
                var current = swiper.activeIndex;
                var last = swiper.previousIndex;

                $(swiper.slides[current]).find('.timer').hide();
                //check if timeout was set at all
                if (fadetimer != null)
                    clearTimeout(fadetimer);
                fadetimer = setTimeout(function () {//timeout for showing timer
                    $(swiper.slides[current]).find('.timer').show();
                }, 60000);
                self.questions[last].handler.leave(function () {
                    //check if got to last question if yes and still in stage 1 so move to stage 2
                    checkStage(last);
                    stagesHolder[stage].push(new timeLineObject(self.questions[last]));
                }); //stops the previous question and check if it was considedrd a visit to add to stage holder
                self.questions[current].handler.visit(function (data) {
                    $(swiper.slides[current]).find('.timer .question-feature-text').html(data);
                }); //visit the question and start timer to see if the user actually wants to be in the question and if stays so save how much time, additionally the timer woud be shown after a minute. 
            }
        });
        //initialized slider for the first slide

        var current = mySwiper.activeIndex;
        $(mySwiper.slides[current]).find('.timer').hide();
        if (fadetimer != null)
            clearTimeout(fadetimer);
        fadetimer = setTimeout(function () {//timeout for showing timer
            $(mySwiper.slides[current]).find('.timer').show();
        }, 60000);
        self.questions[current].handler.visit(function (data) {
            $(mySwiper.slides[current]).find('.timer .question-feature-text').html(data);
        }); //visit the question and start timer to see if the user actually wants to be in the question and if stays so save how much time, additionally the timer woud be shown after a minute. 
        self.swiper = mySwiper;
    }
    //check visited for this question
    this.visited = function () {

    }

    //save a asterisk for this question
    this.asterisk = function () {
        var $this = $(this);
        $this.toggleClass("selected");
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        var asterisk = self.testResult[questionNum - 1].asterisk = !self.testResult[questionNum - 1].asterisk;

        //if selected
        if (asterisk) {
            $this.parents(".question-status").find(".circle.selected").removeClass("selected");
            self.testResult[questionNum - 1].circle = 0;
        }
    }

    //save a circle for this question
    this.circle = function () {
        var $this = $(this);
        $this.toggleClass("selected");
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        var circle = self.testResult[questionNum - 1].circle = !self.testResult[questionNum - 1].circle;

        //if selected
        if (circle) {
            $this.parents(".question-status").find(".asterisk.selected").removeClass("selected");
            self.testResult[questionNum - 1].asterisk = 0;
        }

    }

    //user click on answer -> push to question answers array the last answer
    this.pushAnswer = function () {
        var $this = $(this);
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        var number = $this.parent().find(".number");
        var val = $this.parents(".answer-item").attr("data-answer-num");
        var question = self.questions[questionNum - 1].handler;
        //check if double clicked to erase givenanswer
        if (val != question.nowAnswer()) {
            //displaying
            var allNumber = $this.parents(".answers-container").find(".number.answer").removeClass("answer"); //clear all given answers                
            number.removeClass("not-answer");
            number.addClass("answer");
            //add data
            self.questions[questionNum - 1].handler.addAnswer(val);
           
        }
        else{//if double clicked to erase answer  
             number.removeClass("answer");
             self.questions[questionNum - 1].handler.eraseAnswer(val);
        }
        /*//check if val was chosen as a not answer before if yes remove data
        var checkNotAnswer = self.testResult[questionNum - 1].chooseNotAnswer.indexOf(val);
        if (checkNotAnswer != -1) {
        self.testResult[questionNum - 1].chooseNotAnswer.splice(checkNotAnswer, 1); //remove from not answeard array the value of the chosen twice not answer
        self.questions[questionNum - 1].handler.eraseNonAnswer(val);
        }
        //check if question was answerd allready
        if (!check_if_remove_answer($this)) {
        self.testResult[questionNum - 1].chooseAnswer = val;
        self.questions[questionNum - 1].handler.addAnswer(val); //save given answer even if changes

        //if the correct answer
        if (val == self.questions[questionNum - 1].correctAns) {
        self.testResult[questionNum - 1].correct = true;
        }
        else {
        self.testResult[questionNum - 1].correct = false;
        }

        //displaying
        var allNumber = $this.parents(".answers-container").find(".number.answer").removeClass("answer");
        if (!number.hasClass("answer")) {
        number.removeClass("not-answer");
        number.addClass("answer");
        }
        }*/

    }
    //user clicks on answer second time  ->remove answear from array and from view
     function check_if_remove_answer($this){
         var hasBeenAnswered = false;
         var questionNum = $this.parents(".question-container").attr("data-question-num");
         var number = $this.parent().find(".number");
          var val = $this.parents(".answer-item").attr("data-answer-num");
         //check if there is allready a chosen answear and if there is delete it
         if (self.testResult[questionNum - 1].chooseAnswer && self.testResult[questionNum - 1].chooseAnswer==val ) {
             hasBeenAnswered = true;
                delete self.testResult[questionNum - 1].chooseAnswer;
                delete self.testResult[questionNum - 1].correct;
                //remove from display
               if (number.hasClass("answer")) {
                     number.removeClass("answer");
               }//if
        }//if
        return hasBeenAnswered;
    }//function check_if_remove_answear

    //set not user
    this.notAnswer = function () {
        var $this = $(this);
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        var val = $this.parents(".answer-item").attr("data-answer-num");
        var number = $(this).parent().find(".number");  
        //if the chosen not answer was chosen as answer before f\so erase the data    
        if (self.testResult[questionNum - 1].chooseAnswer)//check if at all is there a chosen answer
            if(self.testResult[questionNum - 1].chooseAnswer==val)
                delete self.testResult[questionNum - 1].chooseAnswer;
        //if chosen not answear so add to array chosen not answear
        if(!check_if_remove_notAnswear($this)){
            self.testResult[questionNum - 1].chooseNotAnswer.push(val);
            self.questions[questionNum - 1].handler.addNonAnswer(val);
            //add to display
            if (!number.hasClass("not-answer")) {
                number.removeClass("answer");
                number.addClass("not-answer");
            }
        } 
      
    }
    //user clicks on not answer second time  ->remove not answear from array and from view
     function check_if_remove_notAnswear($this){
       
         var hasBeenAnswered = false;
         var questionNum = $this.parents(".question-container").attr("data-question-num");
         var val = $this.parents(".answer-item").attr("data-answer-num");
         var number = $this.parent().find(".number");
         
         //check if there is allready a chosen answear and if there is delete it
         var chosenNotAnswer = self.testResult[questionNum - 1].chooseNotAnswer.indexOf(val);
          
         if (chosenNotAnswer != -1) {
                 hasBeenAnswered = true;
                 self.testResult[questionNum - 1].chooseNotAnswer.splice(chosenNotAnswer,1);//remove from not answeard array the value of the chosen twice not answer
                 self.questions[questionNum - 1].handler.eraseNonAnswer(val);
                 //remove from display
                 if (number.hasClass("not-answer")) {
                     number.removeClass("not-answer");
                 } //if             
        }//if
         
        return hasBeenAnswered;
    }//function check_if_remove_notAnswear

    //clear all sign
    this.clear = function () {
       
        var question = $(this).parents(".question-container");
        question.find(".number.answer").removeClass("answer");
        question.find(".number.not-answer").removeClass("not-answer");
        question.find(".circle.selected").removeClass("selected");
        question.find(".asterisk.selected").removeClass("selected");
        question.find(".guess.selected").removeClass("selected");
        var questionNum = $(this).parents(".question-container").attr("data-question-num");
        self.testResult[questionNum - 1].chooseNotAnswer = [];
        if (self.testResult[questionNum - 1].chooseAnswer){
            delete self.testResult[questionNum - 1].chooseAnswer;
             delete self.testResult[questionNum - 1].correct;
            }
        self.questions[questionNum - 1].handler.clear();   
    }

    //user click on guess -> push to question guess
    this.guess = function () {
        var $this = $(this);
        $this.toggleClass("selected");
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        var guess = self.questions[questionNum - 1].handler.guess = self.testResult[questionNum - 1].guess = !self.testResult[questionNum - 1].guess;
        
    }


    this.finishTest = function () {
        //if finsh test but still on question so we need to "leave that question"
        self.questions[self.swiper.activeIndex].handler.leave(function () {
              stagesHolder[stage].push(new timeLineObject(self.questions[self.swiper.activeIndex]));
        }); //stops the previous question and check if it was considedrd a visit to add to stage holder
        timerController.resetGeneralTimers();
        // var reportController = new ReportController();
        
        $("#test-container").hide();
        $("#reportPage").show();
        $("body").css({ "background-color": "#f2f2f4", "direction": "ltr" });
        report = new Report(self.questions,stagesHolder);
        reportController.insertData(report);
        //self.checkAnswers();
        //var reportController = new ReportController();
        //reportController.initChart();
       
        //reportController.initChart();
        reportController.drawChart();

    }

    this.checkAnswers = function () {
        var correct = 0;
        var notCorrect = 0;
        var guess = 0;
        for (var i = 0; i < self.testResult.length; i++) {
            if (self.testResult[i].correct) {
                correct++;
            }
            else {
                notCorrect++;
            }

            if (self.testResult[i].guess) {
                guess++;
            }
        }
        reportController.initChartPie();
        //reportController.initChartPie(10, 4);
    }

    this.alphabets = ["א", "ב", "ג", "ד", "ה", "ו"];
    this.questions = [];
    //checks If all questions were answerd to see if need to move to third Stage
    function checkStage(qNumber) {
        if (qNumber + 1 == self.questions.length && stage == stages[1])
                       stage = stages[2];
         //check If all questions were answerd to see if need to move to third Stage
        if(stage!=stages[3]&&!findNotAnswered()){
            stage = stages[3];
        }
        
    }
    //checks if there is a question not answered
    function findNotAnswered(){
        var found = false;
        for(var i=0;i<self.questions.length;i++){
            if (self.questions[i].handler.nowAnswer() == null)
                found = true;
        }
        return found;            
    }
    var givenq=[{
        "question": "מי מהבאים אינו מהווה התוויית נגד מוחלטת לשימוש בגלולה למניעת הריון ?",
        "answers": ["אם שעברה אירוע מוחי בגיל 40", "אנמיה", "בת 37 מעשנת", "כאבים ברגל ללא בירור"],
        "correctAns": 2,
        "handler":new QuestionHandler()
    },
    {
        "question": "הגורם היחיד שיכול להשפיע על הופעה מוקדמת יותר של גיל המעבר הינו:  ",
        "answers": ["גזע", "צבע עור", "עישון ", "מספר ההריונות בעבר"],
        "correctAns": 3,
        "handler":new QuestionHandler()
    },
        {
            "question": "לאחר חריגת ביצית בשלה בביוץ:   ",
            "answers": [
        "נשאר בשחלה גופיף צהוב שמפריש פרוגסטרון ותומך בהריון",
"הביצית הבשלה שחרגה מפרישה לעצמה את ההורמונים הדרושים להתפתחות הריון",
"הגופיף הצהוב הינו איזור בשחלה ללא תפקיד",
"רק אם ביצית תופרה על ידי זרע יופרש פרוגסטרון מהגופיף הצהוב"
        ],
            "correctAns": 1,
            "handler":new QuestionHandler()
        },

        {
            "question": "מה נכון לגבי PID  ? ",
            "answers": [
       "יותר שכיח בנשים מבוגרות שאין פוריות",
"יכול לחלוף גם ללא טיפול",
"זיהום עולה ממערכת המין התחתונה",
"התקן תוך רחמי מוריד את הסיכוי למחלה  "
        ],
            "correctAns": 3,
            "handler":new QuestionHandler()
        },

        {
            "question": "מה מהבאים נכון לגבי שימוש בהנקה כאמצעי מניעה ?",
            "answers": [
       "איננה מומלצת כלל ",
"מומלצת רק בתוספת של מיני פיל",
"הנקה מעלה פרולקטין אשר מעכבת את מנגנון הביוץ",
"אפשרי בנשים עד 12 חודשים לאחר הלידה המשתמשות בהנקה כאמצעי תזונה יחיד לתינוק"
        ],
            "correctAns": 3,
            "handler":new QuestionHandler()
        },

        {
            "question": "מה נכון לגבי תסמינים וואזו-מוטורים בתקופת הבלות ?",
            "answers": [
       "משך גל החום משתנה ",
"תדירות הופעה משתנה   ",
"גלי החום יכולים להופיע עד 5 שנים מזמן הפסקת הווסת",
"כל התשובות נכונות"
        ],
            "correctAns": 4,
            "handler":new QuestionHandler()
        },

        {
            "question": "מה נכון לגבי התקן תוך רחמי ?",
            "answers": [
       "העלייה בסיכון לפרפורצייה של הרחם נצפית רק בהתקן נחושת",
"הרעלת נחושת הינה סיבוך שכיח",
"התקן על בסיס פרוגסטרון יעיל לכעשר שנים",
"בהתקן הורמונאלי על בסיס נחושת נוצרת דלקת מקומית",
        ],
            "correctAns": 4,
            "handler":new QuestionHandler()
        },

        {
            "question": "איזה מההיגדים הבאים לגבי הרחם איננו נכון ?",
            "answers": [
       "זרימת הדם במועד מגיעה לכ- 650 מ'ל דם בדקה ",
"עורקי הרחם הינם המקור היחיד לאספקת הדם  ",
"העלייה בזרימת הדם לעובר נובעת עקב התרחבות עורקי השילייה ",
"ברקסטון-היקס מתחילים בשליש השני"
        ],
            "correctAns": 2,
            "handler":new QuestionHandler()
        },

        {
            "question": "מה מהבאים נכון לגבי מטבוליזם של פחמימות בהריון ? ",
            "answers": [
       "היפרגליקמייה בצום, היפוגליקמייה לאחר ארוחה ",
"היפוגליקמייה בצום, היפרגליקמייה לאחר ארוחה",
"היפואינסולינמייה בצום",
"רגישות לאינסולין "

        ],
            "correctAns": 2,
            "handler":new QuestionHandler()
        },

        {
            "question": "מה נכון לגבי השינויים במערכת הנשימה בהריון ?",
            "answers": [
       "היקף בית החזה קטן",
"הנפח השאריתי residual volume עולה",
"ישנה חמצת נשימתית קלה",
"נפח בית החזה קטן"
        ],
            "correctAns": 4,
            "handler":new QuestionHandler()
        },

        {
            "question": "מה נכון לגבי השינויים במערכת הדם בהריון ?",
            "answers": [
       "עלייה במספר הטסיות ומצד שני ירידה בנפח שלהן",
"אין שינוי בשקיעת הדם",
"העלייה בנפח הדם נגרמת בעיקר מעליית נפח הפלסמה",
"העלייה בנפח הדם נגרמת בעיקר מעלייה במספר התאים האדומים"
        ],
            "correctAns": 3,
            "handler":new QuestionHandler()
        },

        {
            "question": "מה נכון לגבי השינויים במערכת השתן בהריון ?",
            "answers": [
       "הידרו-אורתר והידרונפרוזיס פיזיולוגים",
"ירידה בזרימת הדם לכליות ",
"עלייה באוריאה וירידה בפינוי הקריאטנין ",
"ירידה בהפרשת גלוקוז וחלבון בשתן"
        ],
            "correctAns": 1,
            "handler":new QuestionHandler()
        },

        {
            "question": "איזה מהשינויים הבאים במערכת העיכול לא נכון לגבי פרוגסטרון ?",
            "answers": [
       "היפרטרופייה של החניכיים  ",
"רידה בתנועתיות כיס המרה ",
"צירות",
"עלייה בניע הוושט ועלייה בהתרוקנות הקיבה"
        ],
            "correctAns": 4,
            "handler":new QuestionHandler()
        },

        {
            "question": "איזה מגורמי הסיכון הבאים אינו קשור להופעת סרטן רירית הרחם ?",
            "answers": [
       "השמנת יתר",
"לידה של חמישה ילדים בהיסטוריה המיילדותית ",
"סכרת ",
"מנופאוזה בגיל 58"

        ],
            "correctAns": 2,
            "handler":new QuestionHandler()
        }

    ]
    for(var i=0;i<givenq.length;i++){
         self.questions.push(new Question(i+1,givenq[i]));
    }


}