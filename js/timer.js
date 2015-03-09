function TimerController() {
    var self = this;

    this.generalTimer; //the test timer
    this.generalTimerRun;
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
        self.generalTimerSeconds = minutes;
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
           }, 60000);

    }

    this.updateGeneralTimerDisplay = function () {
        //if (self.generalTimerSeconds != 0) {
            var h = parseInt(self.generalTimerSeconds / 60);
            var m = self.generalTimerSeconds - h * 60;
            if (parseInt(h / 10) == 0) {
                h = "0" + h;
            }
            if (parseInt(m / 10) == 0) {
                m = "0" + m;
            }

            $("#general-timer").html(h + ":" + m + ":00");
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