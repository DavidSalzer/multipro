var stages=[0,'firstStage','secondStage','thirdStage']//stages that are in the test
//holds a question of test
function Question(obj){
    this.question=obj.question;//the question itself
    this.answers = obj.answers;//an array of answers
    this.correctAns = obj.correctAns;//the correct answer
    this.handler = new QuestionHandler();//the handler of the behavior of the question
    this.handler.correctAnswer = obj.correctAns;//sets the correct answer at the handler
}
//A handler for the questions
function QuestionHandler(){  
    var delayTimeBetweenQuestion=5;//number of seconds of delay that are for saying if the user is at the question or just passing by.
    var self = this;
    var checkIfStay;//the timeout for time of delay for focus on question
    var tempAnswer=null;//initiliazes as null for no answer
    var stage = stages[1];//initilize as firststage of test
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
        self.timer.startTimer(function () { 
                if(callback)//set to view to user     
                    callback(self.timer.setToView())           
        });
    }
    this.leave = function () {//once there is a focus out of a question then it might have been early so stop the timer so the number of visits wouldnt update, furthermore if there was an answer or it was changed so add the given answer
        if (self.timer.seconds > delayTimeBetweenQuestion) {
            self.timesvisited++;
            self.timeInVisit[stage].push(self.timer.setToView());
        }
        this.timer.stopTimer();
        if (tempAnswer != null) {
            self.givenAnswers[stage].push(tempAnswer);
        }
    }
    var timeForAnswer=null;//timeout for answer
    this.addAnswer = function (answer) {//once given answer add to given answers for further processing, concept- if change while in question not consdiered a change and only the last answer would be considered, chnage is called for when user leffed a question and returend and only then would save question 
        self.eraseNonAnswer(answer);//check if in non answers array and erase if overthere
        tempAnswer = answer;//the answer for while on focus on question
    }
    this.eraseAnswer = function (answer) {
        if (tempAnswer == answer)
            tempAnswer = null;
    } //erases the given answer
    //for given non-correct answer add to givenNonAnswers array, holds only one value for each choice
    this.addNonAnswer = function (answer) {
        //if the given non answer was an answer so erase ita. 
        if (tempAnswer == answer)
            tempAnswer = null;
        if (self.givenNonAnswers.indexOf(answer) == -1)//only if not in array allready
            self.givenNonAnswers.push(answer);
    }
    this.eraseNonAnswer=function(answer){
        var place=self.givenNonAnswers.indexOf(answer)
          if(place!=-1)//if in array erase
               self.givenNonAnswers.splice(place,1);
    }
    //returns the tempAnswer which is the corrent answer
    this.nowAnswer = function () {
        return tempAnswer;
    }
    //clears the answer and the non answers
    this.clear = function () {
        tempAnswer = null;
        self.givenNonAnswers = [];
    }
    this.getGivenAnswersAll=function(){
        var arr= self.givenAnswers.firstStage.concat(self.givenAnswers.secondStage.concat(self.givenAnswers.thirdStage));
        return arr;
    }
    //returns if the answer was answered correctly
    this.answerdCorrectly = function () {
        if (tempAnswer != null)
            return tempAnswer == self.correctAnswer;
        else
            return false;
    }
    this.getOverAllTimeInQuestion = function () {
        var sum = 0;
        for (var stage in self.timeInVisit) {
            var tempArr = self.timeInVisit[stage];
            for (var i = 0; i < tempArr.length; i++) {
                sum += new Timer().convertFromFormat(tempArr[i]);
            }
        }
        return sum;
    }   
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
     this.convertFromFormat = function (time) {
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
function Report(givenQuestions) {
    var self = this;
    var numberOfquestions=givenQuestions.length;
    var questions=givenQuestions;//an array of all the question that holds all the data on the question the questions would be QuestionHandler
    var qchart =[0,0,0,0,0,0,0,0];//array that holds all data on questions 1:questions that returned, 2: questions that were changed answer 3: changed from mistake to correct 4: changed from correct to mistake 5: changed from mistake to mistake 6: num of guesses 7: coreect guesses 8:long time questions
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
            arr.push({time:questions[i].handler.getOverAllTimeInQuestion(),correct:questions[i].handler.answerdCorrectly(),answered:questions[i].handler.nowAnswer()!=null});
        }
        return arr;
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

