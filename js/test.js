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
        $(".asterisk .icon").on("click", function () {
            $(".swiper-slide-active .number").toggleClass("asterisk")
            $(".swiper-slide-active .number").removeClass("circle")
        });

        $(".circle .icon").on("click", function () {
            $(".swiper-slide-active .number").toggleClass("circle");
            $(".swiper-slide-active .number").removeClass("asterisk")
        });

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
            html += '     <div class="question-container">';
            html += '         <div class="title">';
            html += '               <div class="question-status">';
            html += '                   <div class="asterisk settings-item"></div>';
            html += '                   <div class="circle settings-item"></div>';
            html += '               </div>';
            html += '               <span class="question-title">';
            html += '                   <span class="number">' + (i+1) + '.</span><span class="text">' + self.questions[i].question + '</span></div>';
            html += '               </span>';
            html += '           <div class="answers-container">';
            //loop on answers
            for (j = 0; j < self.questions[i].answers.length; j++) {
                html += '             <div class="answer-item"><span class="number">' + self.alphabets[j] + '.</span><span class="text">' + self.questions[i].answers[j] + '</span></div>';
            }
            html += '           </div>';
            html += '           <div class="question-feature">';
            html += '               <div class="clear question-feature-item"><div class="icon"></div><div class="question-feature-text">נקה</div></div>';
            html += '               <div class="guess question-feature-item"><div class="icon"></div><div class="question-feature-text">ניחוש</div></div>';
            html += '               <div class="comment question-feature-item"><div class="icon"></div>    <div class="question-feature-text"><input type="text" placeholder="כתוב הערה"></div> </div>';
            html += '           </div>';           
            html += '     </div>';
            html += '</div>';

        }

     
                                 
        $(".swiper-wrapper").html(html);

        //init the swiper
        var mySwiper = new Swiper('.swiper-container', {
            pagination: '.pagination',
            mode: 'vertical',
            paginationClickable: true,
            centeredSlides: true,
            mousewheelControlForceToAxis: true,
            mousewheelControl: true,
            slidesPerView: 3,
            watchActiveIndex: true
        });


    }

    //check visited for this question
    this.visited = function () {

    }

    //save a asterisk for this question
    this.asterisk = function () {

    }

    //save a circle for this question
    this.circle = function () {

    }

    //user click on answer -> push to question answers array the last answer 
    this.pushAnswer = function () {

    }

    //user click on guess -> push to question guess 
    this.toggleGuess = function () {

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