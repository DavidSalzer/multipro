var stages=[0,'firstStage','secondStage','thirdStage']//stages that are in the test
//A handler for the questions
function QuestionHandler(){  
    var delayTimeBetweenQuestion=5;//number of seconds of delay that are for saying if the user is at the question or just passing by.
    var delayTimeBeforeShowTimer;
    var self = this;
    var checkIfStay;//the timeout for time of delay for focus on question
    var tempAnswer=null;//initiliazes as null for no answer
    var stage = stages[1];//initilize as firststage of test
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
            tempAnswer = null;
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