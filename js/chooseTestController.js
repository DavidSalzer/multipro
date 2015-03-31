
function TestChooserController() {
    var numberOfVisits = 0;
    var self = this;
    var tests = null;

    //sets all events of the page choosetestpage
    this.attachEvents = function () {
        $(document).on('click', '#choose-test-btn', function () {
            //check that there is a test chosen
            var choice = ($('#year-choose-dropdown :selected').attr('value')); //the number of test in array
            var choiseNumOfQuestions = $('#number-for-excercise .number-content').text(); //the number of wanted questions
            //console.log(tests[choice]);
            self.leave();//leave current page
            main.testController.initTest(tests[choice].id, choiseNumOfQuestions); //set the test page data
            //main.navigatorController.changeToPage('test');//move to the test page
           
            main.testController.visit();//change page to test
        });
        $(document).on('mousedown', '.plus', function () {//add number of questions to excersise
            addNumberOfQuestions();
            var longclick = setInterval(function () {
                addNumberOfQuestions();
            }, 100);
            $(document).off('mouseup', '.plus').on('mouseup', '.plus', function () { clearInterval(longclick) });//for long click

        });
        $(document).on('mousedown', '.minus', function () {//reduce number of questions to excersise
            reduceNumberOfQuestions();
            var longclick = setInterval(function () {
                reduceNumberOfQuestions();
            }, 100);
            $(document).off('mouseup', '.minus').on('mouseup', '.minus', function () { clearInterval(longclick) });//for long click

        });
        //choice of test affects oter fields
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

    //represent an entry to page
    this.visit = function () {
        $('.footer').show();
        $("#test-title").hide();
        $("#general-timer").hide();
        if (numberOfVisits == 0)//only first visit sets all events
            self.attachEvents();
        numberOfVisits++;
        if (tests == null) {//if there isnt yet data for the tests call from server the data
            main.ajax.getTests(function (data) {
                if (!data.error) {
                    var testArr = []; ;
                    for (var i = 0; i < data.length; i++) {
                        testArr.push(new Test(data[i].id, data[i].title, data[i].numberOfQuestions));
                    }
                    tests = testArr;
                    setDataToView();
                }
            });
        }
        //if there is tests data allready just show it
        else
            setDataToView();

    }
    //sets the test from data to view for choice
    function setDataToView() {
                     $('#choose-test-container').show();//show the page

                    self.setTests(); //put the test in dropbox
                    self.updateChoiceOfTest(); //set data according to default test the top test
                    self.setNumberOfQuestions(20); //default as 20                
                    self.setTimer(); //set timer according to chosen test(the default one)
    }

    this.leave = function () {
       
        $('#choose-test-container').hide();//leve page hide the page
        $('.footer').hide();//footer at other parts of the test is hidden

    }
    //private function to get the max of question for given test
    function getMaxNumberOfQuestions(){
        return parseInt($("#number-Of-Questions .content").text());
    }    
}

