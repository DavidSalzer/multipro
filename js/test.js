function TestController() {
    var self = this;
    this.alphabets = ["א", "ב", "ג", "ד", "ה", "ו"];
    this.questions = [];
    this.doneQuestions = [];
    this.notdoneQuestions = [];
    var numberOFVisits = 0;
    var testId;
    var numOfQuestions;
    var firstQuestion;//the first question is the question after the last question done

    //represents an entrance to the page-the only way to enter the test page
    this.visit = function () {
      //call from server questions for given test
        main.ajax.getQuestionsForTest(main.userId,testId,numOfQuestions, function (data) {
          console.log(main.userId);
          console.log(testId);
          //self.visit();
            var arr=data;
            if (!data.error) {    
                console.log(data);          
                oninitTest(data.test,data.done);//sets the test with not done questions and with done questions-would begin at not done questions
                 //time out for tips- in the mean time disabled

                //setTimeout(function(){
                //    self.showTip(1);
                //     setTimeout(function(){
                //         self.showTip(2);
                //     },20000);
                //},20000);
            } //if data doesnt have error
        });
       
        
        $("#test-container").show();
        $("#test-title").show();
        $("#general-timer").show();
        
        if (numberOFVisits == 0)
            self.attachEvents();
        numberOFVisits++;
    }
    //represents an exit from the test page
    this.leave = function () {
         $("#test-container").hide();
         main.timerController.resetGeneralTimers();
    }

    this.showTip=function(number){
        $('.tip'+number).fadeIn();
        setTimeout(function(){self.hideTip(number)},5000);
    }
    this.hideTip=function(number){
        $('.tip'+number).fadeOut();
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
        $(".swiper-wrapper ").on("click", ".swiper-slide-active .active .asterisk", self.asterisk);

        $(".swiper-wrapper").on("click", ".swiper-slide-active .active .circle", self.circle);

        $(".swiper-wrapper").on("click", ".swiper-slide-active .active .answer-icon", self.pushAnswer);

        $(".swiper-wrapper").on("click", ".swiper-slide-active .active .answer-item .number", self.pushAnswer);

        $(".swiper-wrapper").on("click", ".swiper-slide-active .active .not-answer-icon", self.notAnswer);

        $(".swiper-wrapper").on("click", ".swiper-slide-active .active .clear", self.clear);

        $(".swiper-wrapper").on("click", ".swiper-slide-active .active .guess", self.guess);

        $(".swiper-wrapper").on("focusout", ".swiper-slide-active .active .question-feature-text input",saveComment);

        $("#finish").on("click", self.finishTest);

        $('.tip-x').on('click',function(event){
            $(event.target).parents('.test-tip').hide();
        })

        $("#user-container").on("click", function () {
            window.location = "indexStatistics.html";
        });
    }

    //init the test page with the questions
    this.initTest = function (_testId,_numOfquestions) {
        testId=_testId;  
        numOfQuestions=_numOfquestions;   
        
    }
    
    //after inserting comment saves the comment
    function saveComment(event){
        var current=self.swiper.activeIndex;
        self.questions[current].handler.comment=$(event.target).val();
    }
   
    function oninitTest(questions_not_done,questions_done) {
                
                firstQuestion=questions_done.length;//the first question is the question after the last question done
                 for (var i = 0; i <questions_done.length; i++) {//sets the questions that were done allready and are not going to be active
                    var numOfquestion=i + 1;
                    var question=questions_done[i];
                    self.doneQuestions.push(question);//add to done and add to test
                    self.questions.push(question);
                }
                for (var j=0; j <questions_not_done.length; i++,j++) {
                    var numOfquestion=i+1;
                    var question=(new Question(numOfquestion,questions_not_done[j]));
                    self.questions.push(question);//add to not done and add to test
                    self.notdoneQuestions.push(question);
                     self.testResult[i] = {
                        circle: 0,
                        asterisk: 0,
                        visited: 0,
                        guess: 0,
                        chooseNotAnswer: []
                    };
                }
               
                main.timerController.initGeneralTimer(questions_not_done.length*1.5);//set timer for minute and half for each question
                html = '';
                                
                for (i = 0; i <  self.doneQuestions.length; i++) {
                     html +=setSlideQuestion(false,self.doneQuestions[i]);
                 }
                 //loop on questions not done
                for (i = 0; i < self.notdoneQuestions.length; i++) {
                     html +=setSlideQuestion(true,self.notdoneQuestions[i]);
                     /////////////////////////////////////////////                   
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
                        self.swiper = mySwiper;
                        //initialized slider for the first slide
                        setJumpBar();//sets pagination as jump bar
                        var current = mySwiper.activeIndex;
                        if(current>=firstQuestion)
                            onVisitQuestion(current);
                        
                        //set jumper bar- that would have question numbers
                        $('.swiper-pagination-switch').each(function (key) {
                            $(this).html(key + 1);
                        });
                        //updates the pagination to current paginatuon- fast jumper
                        mySwiper.updatePagination = function () {
                            var current = mySwiper.activeIndex;
                            var last = mySwiper.previousIndex;
                            if(current!=last){
                                var width=37;//single element of pagination width with margin
                                var holderWidth=$('.pagination').width();
                                var numberOfElements=$('.swiper-pagination-switch').length;
                                var pos=current*37;
                                var overallWidth=width*numberOfElements;
                                var pagePos=overallWidth-pos-37;//the actual position on the elemnt 
                                var centerOfParent=width*7;
                                console.log(pagePos);
                                $('.pagination').scrollLeft(pagePos-centerOfParent);//-would keep the bar at the position of the currnt slide
                                $($('.swiper-pagination-switch')[current]).addClass('swiper-active-switch');
                                $($('.swiper-pagination-switch')[last]).removeClass('swiper-active-switch');
                            }

                        }; //stop the update of pagination but set that would set the activated slider
                        mySwiper.swipeTo(firstQuestion);

                    },
                    onSlideChangeStart: function (swiper) {
                        
                        //each time focused on question a timer is set to check if question is centered if less then given time so its not considered that the user is in the question, 
                        //so when a question is focused the given question statrs a timer and the prev question is stopped the timer (if relevent)
                        var current = swiper.activeIndex;
                        var last = swiper.previousIndex;
                        if(current>=firstQuestion)//only if the question is part of the active test so handle question
                            onVisitQuestion(current);
                        if(last>=firstQuestion)//only if the last question is part of active test so handle question
                            onLeaveQuestion(last);
                       
                    }
                });

                //handles the visit of question on change of slide
               function onVisitQuestion(current){
                                $(self.swiper.slides[current]).find('.timer').hide();
                                //check if timeout was set at all
                                if (fadetimer != null)
                                    clearTimeout(fadetimer);
                                fadetimer = setTimeout(function () {//timeout for showing timer
                                    $(self.swiper.slides[current]).find('.timer').show();
                                }, 60000);
                                 self.questions[current].handler.visit(function (data) {
                                    $(self.swiper.slides[current]).find('.timer .question-feature-text').html(data);
                                }); //visit the question and start timer to see if the user actually wants to be in the question and if stays so save how much time, additionally the timer woud be shown after a minute. 
            }
            //handles the leaving of question on change of slide
            function onLeaveQuestion(last){
                console.log('leave q');
                            self.questions[last].handler.leave(function () {
                                //check if got to last question if yes and still in stage 1 so move to stage 2
                                checkStage(last);
                                stagesHolder[stage].push(new timeLineObject(self.questions[last]));
                            }); //stops the previous question and check if it was considedrd a visit to add to stage holder
            }
            self.onLeaveQuestion=onLeaveQuestion;        
    }
    
    function setJumpBar() {
        
                    $elemArr = $('.swiper-pagination-switch');
                    $elemArr.toggleClass('swiper-visible-switch', true);
                    //for (var i = 0; i < $elemArr.length; i++) {
                    //    //$($elemArr[i]).toggleClass('swiper-hidden-switch', i % 5 !== 0);
                    //    $($elemArr[i]).toggleClass('swiper-visible-switch');
                    //}
    }
    
    //set a slider question for a  question on init test get active for active question for not done question and not active for in pass done question
    function setSlideQuestion(active,question){
                var activeclass=(active)?'active':'not-active';
                var asterisk = (question.handler.asterisk) ? "selected" : "";//for done questions add the data to view
                var questionMark = (question.handler.questionMark) ? "selected" : "";
                var guess=(question.handler.guess) ? "selected" : "";


                var html='';
                    html += '<div class="swiper-slide">';
                    html += '     <div class="question-container '+activeclass+'" data-question-num=' + question.questionNumber+ '>';
                    html += '         <div class="title">';
                    html += '               <div class="question-status">';
                    html += '                   <div class="asterisk settings-item '+asterisk+'" title="תזכורת לחשוב על זה שוב"></div>';
                    html += '                   <div class="circle settings-item '+questionMark +'" title="תזכורת לפתור אחר כך"></div>';
                    html += '               </div>';
                    html += '               <span class="question-title">';
                    html += '                   <span class="number">' + question.questionNumber + '.</span><span class="text">' + question.question + '</span></div>';
                    html += '               </span>';
                    html += '           <div class="answers-container">';
                    //loop on answers
                    for (j = 0; j < question.answers.length; j++) {
                        var choice = ((j + 1) == question.handler.currentAnswer) ? "answer" : "";
                        html += '             <div class="answer-item" data-answer-num=' + (j + 1) + '><span class="not-answer-icon" title="פסילת תשובה"></span><!--<span class="answer-icon" title="סימון תשובה">--></span><span class="number '+choice+'" title="סימון תשובה">' + self.alphabets[j] + '.</span><span class="text">' + question.answers[j] + '</span></div>';
                    }
                    html += '           </div>';
                    html += '           <div class="question-feature">';
                    html += '               <div class="guess question-feature-item '+guess+'"><div class="icon"></div><div class="question-feature-text">ניחוש</div></div>';
                    html += '               <div class="clear question-feature-item"><div class="icon"></div><div class="question-feature-text">נקה</div></div>';
                    html += '               <div class="comment question-feature-item"><div class="icon"></div>    <div class="question-feature-text"><input type="text" placeholder="כתוב הערה" value="'+question.handler.comment+'"></div> </div>';

                    html += '              <div class="timer question-feature-item"><div class="icon"></div><div class="question-feature-text">12:00</div></div>';
                    html += '           </div>';
                    html += '     </div>';
                    html += '</div>';
                                       
             return html;
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
        if(self.swiper.activeIndex>=firstQuestion)
            self.onLeaveQuestion(self.swiper.activeIndex);
        //if finsh test but still on question so we need to "leave that question"
        
        main.timerController.resetGeneralTimers();
        // var reportController = new ReportController();

        //self.leave(); //leave the page
        //check that there is a report controller if not initiliaze one
        if (main.reportController);//check that report is initiliazesd
        else
           main.reportController= new ReportController();
        
        main.answerPageController.addQuestionArr(self.notdoneQuestions);//add to answer page the data of the question
        main.answerPageController.addToView();
        //main.reportController.visit();
        self.leave();
        main.navigatorController.changeToPage('reportPage');//move to the test page

        report = new Report(self.notdoneQuestions,stagesHolder);
        main.reportController.insertData(report);
        main.ajax.add_question_data_to_user(main.userId, self.questions, testId, function (data) {
               console.log(data);
        });
      
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
        for(var i=0;i<self.notdoneQuestions.length;i++){
            if (self.notdoneQuestions[i].handler.nowAnswer() == null)
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