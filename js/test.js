function TestController() {
    var self = this;

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
            html += '                   <div class="asterisk settings-item"></div>';
            html += '                   <div class="circle settings-item"></div>';
            html += '               </div>';
            html += '               <span class="question-title">';
            html += '                   <span class="number">' + (i + 1) + '.</span><span class="text">' + self.questions[i].question + '</span></div>';
            html += '               </span>';
            html += '           <div class="answers-container">';
            //loop on answers
            for (j = 0; j < self.questions[i].answers.length; j++) {
                html += '             <div class="answer-item" data-answer-num=' + (j + 1) + '><span class="not-answer-icon"></span><span class="answer-icon"></span><span class="number">' + self.alphabets[j] + '.</span><span class="text">' + self.questions[i].answers[j] + '</span></div>';
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
                guess:0
            };

        }


        $(".swiper-wrapper").html(html);

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
            watchActiveIndex: true
        });


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
        self.testResult[questionNum - 1].chooseAnswer = val;
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
    }

    //set not user
    this.notAnswer = function () {
        var number = $(this).parent().find(".number");
        if (!number.hasClass("not-answer")) {
            number.removeClass("answer");
            number.addClass("not-answer");
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

    }

    //user click on guess -> push to question guess 
    this.guess = function () {      
        var $this = $(this);
        $this.toggleClass("selected");
        var questionNum = $this.parents(".question-container").attr("data-question-num");
        var guess = self.testResult[questionNum - 1].guess = !self.testResult[questionNum - 1].guess;
    }


    this.finishTest = function () {
        timerController.resetGeneralTimers();
        self.checkAnswers();
        $("#test-container").hide();
        $("#reportPage").show();
        $("body").css({ "background-color": "#f2f2f4", "direction": "ltr" });

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
        reportController.initChartPie(correct, notCorrect);
        //reportController.initChartPie(10, 4);
    }

    this.alphabets = ["א", "ב", "ג", "ד", "ה", "ו"];
    this.questions = [
    {
        "question": "מי מהבאים אינו מהווה התוויית נגד מוחלטת לשימוש בגלולה למניעת הריון ?",
        "answers": ["אם שעברה אירוע מוחי בגיל 40", "אנמיה", "בת 37 מעשנת", "כאבים ברגל ללא בירור"],
        "correctAns": 2
    },
    {
        "question": "הגורם היחיד שיכול להשפיע על הופעה מוקדמת יותר של גיל המעבר הינו:  ",
        "answers": ["גזע", "צבע עור", "עישון ", "מספר ההריונות בעבר"],
        "correctAns": 3
    },
        {
            "question": "לאחר חריגת ביצית בשלה בביוץ:   ",
            "answers": [
        "נשאר בשחלה גופיף צהוב שמפריש פרוגסטרון ותומך בהריון",
"הביצית הבשלה שחרגה מפרישה לעצמה את ההורמונים הדרושים להתפתחות הריון",
"הגופיף הצהוב הינו איזור בשחלה ללא תפקיד",
"רק אם ביצית תופרה על ידי זרע יופרש פרוגסטרון מהגופיף הצהוב"
        ],
            "correctAns": 1
        },

        {
            "question": "מה נכון לגבי PID  ? ",
            "answers": [
       "יותר שכיח בנשים מבוגרות שאין פוריות",
"יכול לחלוף גם ללא טיפול",
"זיהום עולה ממערכת המין התחתונה",
"התקן תוך רחמי מוריד את הסיכוי למחלה  "
        ],
            "correctAns": 3
        },

        {
            "question": "מה מהבאים נכון לגבי שימוש בהנקה כאמצעי מניעה ?",
            "answers": [
       "איננה מומלצת כלל ",
"מומלצת רק בתוספת של מיני פיל",
"הנקה מעלה פרולקטין אשר מעכבת את מנגנון הביוץ",
"אפשרי בנשים עד 12 חודשים לאחר הלידה המשתמשות בהנקה כאמצעי תזונה יחיד לתינוק"
        ],
            "correctAns": 3
        },

        {
            "question": "מה נכון לגבי תסמינים וואזו-מוטורים בתקופת הבלות ?",
            "answers": [
       "משך גל החום משתנה ",
"תדירות הופעה משתנה   ",
"גלי החום יכולים להופיע עד 5 שנים מזמן הפסקת הווסת",
"כל התשובות נכונות"
        ],
            "correctAns": 4
        },

        {
            "question": "מה נכון לגבי התקן תוך רחמי ?",
            "answers": [
       "העלייה בסיכון לפרפורצייה של הרחם נצפית רק בהתקן נחושת",
"הרעלת נחושת הינה סיבוך שכיח",
"התקן על בסיס פרוגסטרון יעיל לכעשר שנים",
"בהתקן הורמונאלי על בסיס נחושת נוצרת דלקת מקומית",
        ],
            "correctAns": 4
        },

        {
            "question": "איזה מההיגדים הבאים לגבי הרחם איננו נכון ?",
            "answers": [
       "זרימת הדם במועד מגיעה לכ- 650 מ'ל דם בדקה ",
"עורקי הרחם הינם המקור היחיד לאספקת הדם  ",
"העלייה בזרימת הדם לעובר נובעת עקב התרחבות עורקי השילייה ",
"ברקסטון-היקס מתחילים בשליש השני"
        ],
            "correctAns": 2
        },

        {
            "question": "מה מהבאים נכון לגבי מטבוליזם של פחמימות בהריון ? ",
            "answers": [
       "היפרגליקמייה בצום, היפוגליקמייה לאחר ארוחה ",
"היפוגליקמייה בצום, היפרגליקמייה לאחר ארוחה",
"היפואינסולינמייה בצום",
"רגישות לאינסולין "

        ],
            "correctAns": 2
        },

        {
            "question": "מה נכון לגבי השינויים במערכת הנשימה בהריון ?",
            "answers": [
       "היקף בית החזה קטן",
"הנפח השאריתי residual volume עולה",
"ישנה חמצת נשימתית קלה",
"נפח בית החזה קטן"
        ],
            "correctAns": 4
        },

        {
            "question": "מה נכון לגבי השינויים במערכת הדם בהריון ?",
            "answers": [
       "עלייה במספר הטסיות ומצד שני ירידה בנפח שלהן",
"אין שינוי בשקיעת הדם",
"העלייה בנפח הדם נגרמת בעיקר מעליית נפח הפלסמה",
"העלייה בנפח הדם נגרמת בעיקר מעלייה במספר התאים האדומים"
        ],
            "correctAns": 3
        },

        {
            "question": "מה נכון לגבי השינויים במערכת השתן בהריון ?",
            "answers": [
       "הידרו-אורתר והידרונפרוזיס פיזיולוגים",
"ירידה בזרימת הדם לכליות ",
"עלייה באוריאה וירידה בפינוי הקריאטנין ",
"ירידה בהפרשת גלוקוז וחלבון בשתן"
        ],
            "correctAns": 1
        },

        {
            "question": "איזה מהשינויים הבאים במערכת העיכול לא נכון לגבי פרוגסטרון ?",
            "answers": [
       "היפרטרופייה של החניכיים  ",
"רידה בתנועתיות כיס המרה ",
"צירות",
"עלייה בניע הוושט ועלייה בהתרוקנות הקיבה"
        ],
            "correctAns": 4
        },

        {
            "question": "איזה מגורמי הסיכון הבאים אינו קשור להופעת סרטן רירית הרחם ?",
            "answers": [
       "השמנת יתר",
"לידה של חמישה ילדים בהיסטוריה המיילדותית ",
"סכרת ",
"מנופאוזה בגיל 58"

        ],
            "correctAns": 2
        }

    ]


}