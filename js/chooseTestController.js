
function TestChooserController(_tests) {
    var numberOfVisits = 0;
    var self = this;
    var tests = _tests;

    //sets all events of the page choosetestpage
    this.attachEvents = function () {
        $(document).on('click', '#choose-test-btn', function () {
            //check that there is a test chosen
            var choice = ($('#year-choose-dropdown :selected').attr('value')); //the number of test in array
            var choiseNumOfQuestions = $('#number-for-excercise .number-content').text();
            //console.log(tests[choice]);
           
            self.leave();
             main.testController.initTest(tests[choice].id,choiseNumOfQuestions);
            //main.testController.visit();
        });
        $(document).on('mousedown', '.plus', function () {//add number of questions to excersise
            addNumberOfQuestions();
            var longclick= setInterval(function(){
                addNumberOfQuestions();
            },100);
             $(document).off('mouseup', '.plus').on('mouseup', '.plus', function () {clearInterval(longclick)});
           
        });
        $(document).on('mousedown', '.minus', function () {//add number of questions to excersise
            reduceNumberOfQuestions();
            var longclick= setInterval(function(){
                reduceNumberOfQuestions();
            },100);
             $(document).off('mouseup', '.minus').on('mouseup', '.minus', function () {clearInterval(longclick)});
           
        });
        $(document).on('change', '#year-choose-dropdown', function (event) {
            self.updateChoiceOfTest();
        })
    }
    function addNumberOfQuestions() {
        var number = parseInt($('.number-content').text());
        var max = getMaxNumberOfQuestions();
        if ((++number) <= max) {//check that not choosing more questions than possible
            $('.number-content').text(number);
            self.setTimer();
        }
    }
    function reduceNumberOfQuestions(){
        var number = parseInt($('.number-content').text());
            if ((--number) >= 0) {//check that not trying to choose less than zero
                $('.number-content').text(number);
                self.setTimer();
            }
    }
    this.updateChoiceOfTest = function () {
        var choice = ($('#year-choose-dropdown :selected').attr('value')); //the number of test in array
        $('#test-title').text(tests[choice].title);
        $('#test-title').text('מבחן ב'+tests[choice].title)
        self.setNumberOfQuestionsOfTest(tests[choice].getNumOfQuestions());
        self.setNumberOfQuestions(20); //default
    }
    //adds the tests to the dropdown
    this.setTests = function () {
        var html = "";
        for (var i = 0; i < tests.length; i++) {
            html += '<option value="' + i + '">' + tests[i].title + '</option>';
        }
        $('#year-choose-dropdown').append(html).trigger('create');//add to the drop down the options of tests
    }
    
    //the computer time is set according to 90 seconds for a question
    this.setTimer = function () {
        var numberOfQusetions = parseInt($('.number-content').text());
        var time = 1.5 * numberOfQusetions;
        var hours = (Math.floor(time / 60));
        var seconds = (Math.floor(time * 60)) % 60;
        var minutes = Math.floor(time) % 60;
        $('#test-computer-time .content').text((hours < 10 ? "0" : "" ) + hours + ":" + (minutes < 10 ? "0" : "" ) + minutes+ ":" + (seconds < 10 ? "0" : "" ) + seconds);
    }
    
    //set number of question of test
    this.setNumberOfQuestionsOfTest = function (num) {
        $('#number-Of-Questions .content').text(num);
        self.setTimer();
    }

    //sets number of questions in the form
    this.setNumberOfQuestions = function (num) {
        var max = getMaxNumberOfQuestions();
        if(num<=max)
            $('#number-for-excercise .number-content').text(num);
        else   
            $('#number-for-excercise .number-content').text(max);
        self.setTimer();
    }

    this.visit = function () {
         $('#choose-test-container').show();
        if (numberOfVisits == 0)//only first visit sets all events
            self.attachEvents();
        self.setTests();
        self.updateChoiceOfTest();
        self.setNumberOfQuestions(20); //default as 20
        numberOfVisits++;
        self.setTimer(); //set timer according to chosen test(the default one)
    }
    this.leave = function () {
        $('#choose-test-container').hide();
       $('.footer').hide();    
    }
    //private function to get the max of question for given test
    function getMaxNumberOfQuestions(){
        return parseInt($("#number-Of-Questions .content").text());
    }    
}

