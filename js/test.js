function TestController() {
    var self = this;
    var numberOFVisits = 0;


    this.visit = function (testId) {
        if (testId)
            self.initTest(testId);
        $("#test-container").show();
        $("#test-title").show();
        $("#general-timer").show();
        if (numberOFVisits == 0)
            self.attachEvents();
        numberOFVisits++;
    }
    this.leave = function () {
         $("#test-container").hide();
    }
    var stage = stages[1];//initilizes as firstStage
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
    this.initTest = function (testId,numOfquestions) {        
        //call from server questions for given test
        main.ajax.getQuestionsForTest(testId, function (data) {
            var arr=data;
            if (!data.error) {
                if(numOfquestions)
                    arr=cutarr(arr,numOfquestions);
                    console.log(numOfquestions);
                console.log(arr);
                oninitTest(arr);
            } //if data doesnt have error
        });
    }
    function cutarr(arr,bound){
                var cutArr=[];
                for(var i=0;i<bound&&i<arr.length;i++)
                    cutArr.push(arr[i]);
                return cutArr;
    }
   
    function oninitTest(data) {
                for (var i = 0; i < data.length; i++) {
                    self.questions.push(new Question(i + 1, data[i]));
                }
                main.timerController.initGeneralTimer(data.length*1.5);//set timer for minute and half for each question
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
                        html += '             <div class="answer-item" data-answer-num=' + (j + 1) + '><span class="not-answer-icon" title="פסילת תשובה"></span><!--<span class="answer-icon" title="סימון תשובה">--></span><span class="number" title="סימון תשובה">' + self.alphabets[j] + '.</span><span class="text">' + self.questions[i].answers[j] + '</span></div>';
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


                //set Swiper
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
                    onSwiperCreated: function (mySwiper) {
                        //initialized slider for the first slide
                        setJumpBar()
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
                        //set jumper bar- that would have question numbers
                        $('.swiper-pagination-switch').each(function (key) {
                            $(this).html(key + 1);
                        });
                        //updates the pagination to current paginatuon- fast jumper
                        mySwiper.updatePagination = function () {
                            var current = mySwiper.activeIndex;
                            var last = mySwiper.previousIndex;
                            if(current!=last){
                                $($('.swiper-pagination-switch')[current]).addClass('swiper-active-switch');
                                $($('.swiper-pagination-switch')[last]).removeClass('swiper-active-switch');
                            }

                        }; //stop the update of pagination but set that would set the activated slider

                    },
                    onSlideChangeStart: function (swiper) {
                        //setJumpBar()
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
                       // swiper.updatePagination();
                    }
                });
    }
    function setJumpBar() {
        
                    $elemArr = $('.swiper-pagination-switch');
                    $elemArr.toggleClass('swiper-visible-switch', false);
                    for (var i = 0; i < $elemArr.length; i++) {
                        //$($elemArr[i]).toggleClass('swiper-hidden-switch', i % 5 !== 0);
                        $($elemArr[i]).toggleClass('swiper-visible-switch');
                    }
    }
    //check visited for this question
    this.visited = function () {

    }

    //save a asterisk for this question
    this.asterisk = function () {
        var $this = $(this);
        $this.toggleClass("selected");
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        self.questions[questionNum - 1].handler.asterisk = $this.hasClass("selected");
        
    }

    //save a circle for this question
    this.circle = function () {
        var $this = $(this);
        $this.toggleClass("selected");
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        self.questions[questionNum - 1].handler.questionMark = $this.hasClass("selected");
        
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
             number.removeClass("answer");//display
             self.questions[questionNum - 1].handler.eraseAnswer(val);//data
        }
        
     }
    

    //set not user
    this.notAnswer = function () {
        var $this = $(this);
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        var val = $this.parents(".answer-item").attr("data-answer-num");
        var number = $(this).parent().find(".number");
        //if allready has class so double clicked so remove the non answer
        if (number.hasClass("not-answer")) {
            number.removeClass("not-answer");
            self.questions[questionNum - 1].handler.eraseNonAnswer(val);
        }
        else {//if clicked and is not a double clicked so add as non answer and erase answer
            //dispaly
            number.removeClass("answer");
            number.addClass("not-answer");
            //data
            self.questions[questionNum - 1].handler.addNonAnswer(val);
            self.questions[questionNum - 1].handler.eraseAnswer(val);
        }

    }
   

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
        main.timerController.resetGeneralTimers();
        // var reportController = new ReportController();

        self.leave(); //leave the page
        //check that there is a report controller if not initiliaze one
        if (main.reportController);
        else
           main.reportController= new ReportController();
        main.reportController.visit();
        $("body").css({ "background-color": "#f2f2f4", "direction": "ltr" });
        report = new Report(self.questions, stagesHolder);
        main.reportController.insertData(report);
        //self.checkAnswers();
        //var reportController = new ReportController();
        //reportController.initChart();

        //reportController.initChart();
        main.reportController.drawChart();

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
     /*   {
        var givenq = [{
            "question": "מי מהבאים אינו מהווה התוויית נגד מוחלטת לשימוש בגלולה למניעת הריון ?",
            "answers": ["אם שעברה אירוע מוחי בגיל 40", "אנמיה", "בת 37 מעשנת", "כאבים ברגל ללא בירור"],
            "correctAns": 2,
            "handler": new QuestionHandler()
        },
    {
        "question": "הגורם היחיד שיכול להשפיע על הופעה מוקדמת יותר של גיל המעבר הינו:  ",
        "answers": ["גזע", "צבע עור", "עישון ", "מספר ההריונות בעבר"],
        "correctAns": 3,
        "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
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
            "handler": new QuestionHandler()
        }

    ]
        for (var i = 0; i < givenq.length; i++) {
            self.questions.push(new Question(i + 1, givenq[i]));
        }
    }*/


}