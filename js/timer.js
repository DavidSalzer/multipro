function TimerController() {
    var self = this;

    this.generalTimer; //the test timer
    this.generalTimerRun;
    this.generalTimerMinutes;
    this.generalTimerSeconds;
    this.timer = new Timer(); 
    
    //returns the amount of time in seconds from start until urrent
    this.getOverAllTime = function () {
        return (self.timer.seconds + (self.timer.minutes * 60));
    }
    this.questionTimer; //save timer for current question

    //this.timeline=[{questionNumber,time}];
    this.attachEvents = function () {
        //$('#general-timer').timeTo(100, function(){  }); 
    }

    this.initGeneralTimer = function (minutes) {
        self.generalTimerMinutes = minutes;
        self.generalTimerSeconds = minutes * 60;
        self.updateGeneralTimerDisplay();
        self.startGeneralTimer();
        self.timer.startTimer();
        self.generalTimer = setTimeout(
           function () {
               $("#general-timer").html("00:00:00");
               alert("המבחן נגמר!");
               testController.finishTest(); //finish test               
           }, minutes * 60 * 1000);

    }

    this.startGeneralTimer = function () {

        self.generalTimerRun = setInterval(
           function () {
               self.generalTimerSeconds--;
               self.updateGeneralTimerDisplay();
           }, 1000);

    }

    this.updateGeneralTimerDisplay = function () {
        //if (self.generalTimerMinutes != 0) {
        var minutes = (Math.floor(self.generalTimerSeconds / 60))%60;
        var hours = (Math.floor(self.generalTimerSeconds / (60*60)));
        var seconds = self.generalTimerSeconds%60;       

        $("#general-timer").html((hours < 10 ? "0" : "" ) + hours+ ":" +(minutes < 10 ? "0" : "" ) + minutes+ ":" + (seconds < 10 ? "0" : "" ) + seconds);
        //}
        //else {
        //    $("#general-timer").html("00:00:00");
        //    alert("המבחן נגמר!");
        //    testController.finishTest(); 

        //}
    }

    this.resetGeneralTimers=function(){
        clearInterval(self.generalTimerRun);
        clearTimeout(self.generalTimer);
        self.timer.stopTimer();
    }
    this.stopGeneralTimer = function () {
        clearTimeout(self.generalTimer);
        self.timer.stopTimer();
    }

    this.startQuestionTimer = function () {

    }
}