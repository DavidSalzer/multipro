var stages=[0,'firstStage','secondStage','thirdStage']//stages that are in the test- constant variable
//holds a question of test
function Question(qnumber,obj){
    this.question=obj.question;//the question itself
    this.answers = obj.answers;//an array of answers
    this.correctAns = obj.correctAns;//the correct answer
    this.bookReferance = obj.bookReferance;//the rference for the question
    this.year=obj.year;//the year of the question from the test- comes from data base
    this.questionNumber = qnumber;//the number of question in test
    this.handler = new QuestionHandler();//the handler of the behavior of the question
    this.handler.correctAnswer = obj.correctAns;//sets the correct answer at the handler
}
//A handler for the questions comment the question handler doesnt handle stages- it was a mistake but could still work as regular with taking all answers
function QuestionHandler(){  
    var delayTimeBetweenQuestion=5;//number of seconds of delay that are for saying if the user is at the question or just passing by.
    var self = this;
    var timeForAnswer=null;//timeout for answer the timeout for time of delay for focus on question
    var tempAnswer=null;//initiliazes as null for no answer
    QuestionHandler.stage = stages[1];//initilize as firststage of test- static field not depended by object - to be able to be changed for all questions
    this.asterisk = false;
    this.questionMark = false;
    this.currentAnswer = null;//the actual answer of the question initiliazed as null for no answer
    this.correctAnswer = 0;
    this.guess=0;//initilize as non guess
    this.timer = new Timer();
    this.givenAnswers = {firstStage:[],
                         secondStage:[],
                         thirdStage:[]   };//holds the option of answers that were given, for further process- mistakes,changes, changes from mistakes and correct. according to each stage
    this.givenNonAnswers = [];//holds the the option of answers that were chosen as not correct would hold only one instance and if erased would be changed.
    this.timesvisited=0;//times visited at question a visit is only according to a given time that the user is focused on
    this.timeInVisit = {firstStage:[],
                        secondStage:[],
                        thirdStage:[]};//holds for each focus on question how much time was on focus according to each stage
   //when visit a question it might be only to scroll on, so check time for considiring if called for visit, saves the times the question was focused on and,  and how much time was focused in question
   //the callback would return with astring of the time and would be given only after delaytime for show timer
    this.visit = function (callback) {
                            //tempAnswer = self.currentAnswer;
                            self.timer.startTimer(function () {
                                if (callback)//set to view to user     
                                    callback(self.timer.setToView())
                            });
                        }
    this.leave = function (callback) {//once there is a focus out of a question then it might have been early so stop the timer so the number of visits wouldnt update, furthermore if there was an answer or it was changed so add the given answer
        if (self.timer.minutes > 0 || self.timer.seconds > delayTimeBetweenQuestion || tempAnswer != null) {
            self.currentAnswer = tempAnswer;
            self.timesvisited++;
            self.timeInVisit[QuestionHandler.stage].push(self.timer.setToView());
            if (callback)
                callback();
        }
        if (timeForAnswer != null) {//stop the delay for adding answer as given answer
            clearTimeout(timeForAnswer);
            timeForAnswer = null;
        }
        this.timer.stopTimer();
        //if there is a given answer so add the answer to memory
        if (tempAnswer != null) {
            self.currentAnswer = tempAnswer;
            self.givenAnswers[QuestionHandler.stage].push(tempAnswer);
            tempAnswer = null;
        }
    }

    this.addAnswer = function (answer) {//once given answer add to given answers for further processing, concept- if change while in question not consdiered a change and only the last answer would be considered, chnage is called for when user leffed a question and returend and only then would save question or changed after 60 seconds
        self.eraseNonAnswer(answer); //check if in non answers array and erase if overthere
        if (timeForAnswer != null) {//stop the delay for adding answer as given answer
            clearTimeout(timeForAnswer);
            timeForAnswer = null;
        }
        timeForAnswer = setTimeout(function () { self.givenAnswers[QuestionHandler.stage].push(answer) }, 180000); //after 3 minutes save the answer() if wont be changed would be added the leave of question
        tempAnswer = answer; //the answer for while on focus on question
        console.log(self.getGivenAnswersAll());
    }
    this.eraseAnswer = function (answer) {
        if (this.currentAnswer == answer)
            self.currentAnswer = null;
        if (tempAnswer == answer)
            tempAnswer = null;
        if (timeForAnswer != null) {//stop the delay for adding answer as given answer
            clearTimeout(timeForAnswer);
            timeForAnswer = null;
        }
    }  //erases the given answer
    //for given non-correct answer add to givenNonAnswers array, holds only one value for each choice
    this.addNonAnswer = function (answer) {
        //if the given non answer was an answer so erase ita. 
        if (tempAnswer == answer)
            tempAnswer = null;
        if (self.currentAnswer && self.currentAnswer == answer)
            self.currentAnswer = null;
        if (self.givenNonAnswers.indexOf(answer) == -1)//only if not in array allready
            self.givenNonAnswers.push(answer);
    }
    this.eraseNonAnswer=function(answer){
        var place=self.givenNonAnswers.indexOf(answer)
          if(place!=-1)//if in array erase
               self.givenNonAnswers.splice(place,1);
    }
    //returns the tempAnswer which is the current answer
    this.nowAnswer = function () {
        //checks if the temp is the actual now answer because it might still be in the time that the answer wasnt added yet as for entering or exiting question
        if (tempAnswer!=null&& tempAnswer != self.currentAnswer)
            return tempAnswer;
        else
            return self.currentAnswer;
    }
    //clears the answer and the non answers and resets guess
    this.clear = function () {
        tempAnswer = null;
        self.currentAnswer = null;
        self.givenNonAnswers = [];
        self.guess = 0;
    }
    this.getGivenAnswersAll=function(){
        var arr= self.givenAnswers.firstStage.concat(self.givenAnswers.secondStage.concat(self.givenAnswers.thirdStage));
        return arr;
    }
    //returns if the answer was answered correctly
    this.answerdCorrectly = function () {
        if (self.currentAnswer != null)
            return self.currentAnswer == self.correctAnswer;
        else
            return false;
    }
    //gets the over all time that was in question in  all stages
    this.getOverAllTimeInQuestion = function () {
        var sum = 0;
        for (var stage in self.timeInVisit) {
            var tempArr = self.timeInVisit[QuestionHandler.stage];
            for (var i = 0; i < tempArr.length; i++) {
                sum += Timer.convertFromFormat(tempArr[i]);//converts the given time to seconds
            }
        }
        return sum;
    }
       
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function timeLineObject(question) {
    this.questionNum = question.questionNumber;
    this.timeInQuestion = Timer.convertFromFormat(question.handler.timer.setToView());//the number of seconds in current time in question
    this.correct=question.handler.answerdCorrectly();
    this.answered = question.handler.nowAnswer() != null;
    this.asterisk = question.handler.asterisk;
    this.questionMark=question.handler.questionMark;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Timer(){
     this.timestop;
     this.mseconds=0;
     this.seconds=0;
     this.minutes=0;
     this.startTime;
     this.interval;
     this.setToView=function(){
         return ((this.minutes < 10 ? "0" : "" ) + this.minutes + ":" + (this.seconds < 10 ? "0" : "" ) + this.seconds);
     }
     this.showmseconds=function(){
         return ((this.mseconds < 10 ? "0" : "" )+this.mseconds)
     }
     //for given format from timer as time="mm:ss" would get number of seconds
     Timer.convertFromFormat = function (time) {
         var parsed = time.split(":");
         var minutes = Number.parseInt(parsed[0]);
         var seconds= Number.parseInt(parsed[1]);
         return minutes*60+seconds
     }
     function tick() {
        var self=this;
         var elapsed = now() - self.startTime;
         var cnt =  elapsed;
         this.minutes=Math.floor(cnt / 60000);
         this.seconds=(Math.floor(cnt / 1000))%60;
         this.mseconds=(Math.floor(cnt/10))%100;
     }

     this.startTimer=function(callback) {
         var self=this;
         clearInterval(self.interval);
         self.startTime = now.call(this);
         self.interval = setInterval(function(){
             tick.call(self);
             if(callback)
                callback();
         }, 10);
     }
     this.stopTimer=function(callback){
         var self=this;
         clearInterval(self.interval);
         self.timestop=now();
     }
     function now() {
        return ((new Date()).getTime());
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Report(givenQuestions,stagesHolder) {
    var self = this;
    var numberOfquestions=givenQuestions.length;
    var questions=givenQuestions;//an array of all the question that holds all the data on the question the questions would be QuestionHandler
    var qchart =[0,0,0,0,0,0,0,0];//array that holds all data on questions 1:questions that returned, 2: questions that were changed answer 3: changed from mistake to correct 4: changed from correct to mistake 5: changed from mistake to mistake 6: num of guesses 7: coreect guesses 8:long time questions
    var stagesArrays = stagesHolder;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.initReport = function (givenQuestions) {
        questions = givenQuestions;
        numberOfquestions = givenQuestions.length;
    }
    this.setChartStats = function () {
        //set the questions that were rreturnde so go through all questions and find all of them that hold number of times visited greater than 1
        for (var i = 0; i < questions.length; i++) {
            //if correct answer count and also if worng
            if (questions[i].handler.answerdCorrectly())
                this.correctAnswers++;
            else
                this.wrongAnswers++;
            //count number of questions that were returned to them
            if (questions[i].handler.timesvisited > 1)
                qchart[0]++;
            //count number of question that were answered more than once(that have more than one answer)
            if (questions[i].handler.getGivenAnswersAll().length > 1)
                qchart[1]++;
            //count number of question that were answered correctly but were answered preiviously wrong
            if (questions[i].handler.answerdCorrectly() && checkIfChangedFromWrong(questions[i].handler))
                qchart[2]++;
            //count number of questions that were answered wrong but were answered preiviously
            if (!questions[i].handler.answerdCorrectly() && checkIfChangedFromCorrect(questions[i].handler))
                qchart[3]++;
            //count number of questions that were answered wrong but also were changed from wrong
            if (!questions[i].handler.answerdCorrectly() && checkIfChangedFromWrong(questions[i].handler))
                qchart[4]++;
            //count number of guesses
            if (questions[i].handler.guess == 1) 
                qchart[5]++;            
            //count guesss that were correct
            if (questions[i].handler.guess == 1 && questions[i].handler.answerdCorrectly())
                qchart[6]++;
             //count the questions that were in over all time more than 3 minutes
            if (questions[i].handler.getOverAllTimeInQuestion() >= 180)
                qchart[7]++;
        }

    }
    this.numOfQuestions = function () {
        return numberOfquestions;
    }
    this.getBarChart=function(){
        return qchart;
    }
   //returns an array of an objects that give data for dtime line time,correct and if answered at all
    this.getDataForQuestions = function () {
        var arr = []
        for (var i = 0; i < questions.length; i++) {
            arr.push({ time: questions[i].handler.getOverAllTimeInQuestion(), correct: questions[i].handler.answerdCorrectly(), answered: questions[i].handler.nowAnswer() != null, guess: questions[i].handler.guess == 1,changed:questions[i].handler.getGivenAnswersAll().length>1,asterisk:questions[i].handler.asterisk,questionMark :questions[i].handler.questionMark  });            
        }
        return arr;
    }
    this.getDataForChangedQuestions = function () {
        var arr = [];
        var numberOFChanges = findMostChanged();
        for (var i = 0; i < numberOFChanges; i++) {
            arr.push(new Array());
        }
        for (var j = 0; j < questions.length; j++) {
            var qarr = questions[j].handler.getGivenAnswersAll();
            if (qarr.length > 1) {
                for (var i = 0; i < numberOFChanges; i++) {
                    if (qarr.length - 1 >= i) {
                        var correct = (qarr[i] == questions[j].correctAns)
                        arr[i].push({ qNumber: j + 1, correct: correct, changed: true,asterisk:questions[j].handler.asterisk,questionMark :questions[j].handler.questionMark });
                    }
                    else
                        arr[i].push({ qNumber: j + 1, changed: false,asterisk:questions[j].handler.asterisk,questionMark :questions[j].handler.questionMark });
                }
                //for
            }
        }
        return arr;
    }
    
    //get num of questions that were visited
    this.getNumOfVisitedQuestions = function () {
        //run through questions and find all the question that the times visited by them were more than 0
        var overall = 0; //initiliaze as none of the questions were visited
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].handler.timesvisited > 0)
                overall++;
        }
        return overall;
    }
    //returns for a given stage the number of questions visited by that stage
    this.getNumOfQuestionsForStage=function(stage){
        return(stagesArrays[stage].length)
    }
    this.getDataForStages = function () {
        return stagesArrays;
    }
    //for a given stage retuns the over all time in stage
    this.getTimeInStage = function (stage) {
        var sum = 0;
        for (var i = 0; i < stagesArrays[stage].length; i++)//run through stage and sum time in each question
            sum += stagesArrays[stage][i].timeInQuestion;
        return sum;
    }
    self.setChartStats();
    // check if there were answers before that were mistakes 
    function checkIfChangedFromWrong(question) {
        var allAns = question.getGivenAnswersAll();//get the array with all the array of answers
        var foundMistake=false;
        for(var i=0;i<allAns.length-1&&!foundMistake;i++){
            
            if (allAns[i] != question.correctAnswer)
                foundMistake = true;
            }
        return foundMistake;
     }
     //runs through all questions and finds the number of most changed question answeres
    function findMostChanged(){
        var most=0;
        for (var i = 0; i < questions.length; i++){
            var numOfAnswersAtQuestion=questions[i].handler.getGivenAnswersAll().length;
            if( numOfAnswersAtQuestion>most){
                most=numOfAnswersAtQuestion;
            }
        }
        return most;
    }
    //a check if there was an a erliar change that was correct
    function checkIfChangedFromCorrect(question) {
        var allAns = question.getGivenAnswersAll();//get the array with all the array of answers
        var foundCorrect=false;
        for(var i=0;i<allAns.length-1&&!foundCorrect;i++){
            if (allAns[i] == question.correctAnswer)
                foundCorrect = true;
            }
        return foundCorrect;
     }
    //returns a array with all the time lengths of the questions
}
///////////////////////////////////////////////////////////////////////////////     
function AnswerChart() {        
        this.correct;
        this.wrong;    
}
//for given elemnt knows how to print it with possibblities for cahnges.
function Printer(elem){
    var $toPrint = $(elem).clone();//clones the div to be printed
    
    var win = null;
        
   this.swiperToVisible=function(){
       $toPrint.find('.swiper-slide').toggleClass('swiper-slide-active',true);
   }
   this.clearClass=function(removeClass){
       $toPrint.find('.'+removeClass).remove();
   }  
   this.print=function()
    {
        Popup($toPrint.html());
    }

    function Popup(data) 
    {
        win = window.open();
        self.focus();
        win.document.open();
        win.document.write('<'+'html'+'><'+'head'+'>');
        win.document.write('<link rel="stylesheet" type="text/css" href="css/reset.css">'+
                                                      '<link rel="stylesheet" href="css/idangerous.swiper.css">'+
                                                      '<link rel="stylesheet" href="css/jquery-ui.css">'+
                                                       '<link rel="stylesheet" href="css/timeTo.css">'+
                                                      '<link rel="stylesheet" type="text/css" href="css/StyleMain.css">'+
                                                   '<link rel="stylesheet" type="text/css" href="css/StyleStatistics.css">'+
                                                      '<link rel="stylesheet" type="text/css" href="css/czChart.css">'+
                                                      '<script src="js/jquery.js"></script>');
        win.document.write('<'+'/'+'head'+'"><'+'body'+' dir="rtl"><div dir="rtl">');
        win.document.write(data);
        
        win.document.write('</div><'+'/'+'body'+'><'+'/'+'html'+'>');      
        
       // win.document.close();
        win.print();
        win.close();        
        return true;
    }
}
///////////////////////////////////////////////////////////////////////
//class for error handling
function ErrorHandler(etype) {
     var errorTexts = ["תקלה בחיבור לשרת"];
     //hold the types of erros
     //0-connection error with server
     this.error=true;//says that there is an error
     this.errorType = etype;
     this.errorText = errorTexts[this.errorType];
 }

 ///////////////////////////////////////////////////////////
 // class that would hold data for tests - id the post id at the wordress tittle - the title of the test and number questions that the test has at the data base
 function Test(_id,_title,_numOfQuestions) {
    var numberOfQuestions = _numOfQuestions;
    
    this.id = _id;//an id that represents the test mainly for the data base
    this.title = _title;
    this.getNumOfQuestions = function () {
        return numberOfQuestions;    
    }
}

