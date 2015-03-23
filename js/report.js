function ReportController() {
    var self = this;
    var numberOfVisits = 0;

    this.visit = function () { 
        if (numberOfVisits == 0)
            self.attachEvents();
        numberOfVisits++;
         $("#reportPage").show();
         $("#reportPage .stats-title").text($("#reportPage .stats-title").text()+$('#test-title').text());
    }
    this.leave = function () {         
         $("#reportPage").hide();
    }

    //var handler = new Report();
    this.data_pie;
    this.chartResults= [100, 117, 66, 103, 127, 98, 100, 73, 60]; //temp;
    this.correctAnswers=0;
    this.nonCorrectAnswers = 100;
    this.numberOfQuestions=200;
    this.timeLine;
    this.attachEvents = function () {
        $(document).on('click', '#chooseGuess', function () {
            guessClick();
        });
        $(document).on('click', '#viewTimeTest', function () {
            timeLineTestClick();
        });
        $(document).on('click', '#changed-Timeline-button', function () {
            changedTimelineClick();
        });
        $(document).on('click', '#stages-Timeline-button', function () {
            stagesTimeLineClick();
        });
        $(document).on('click', '.drop-box-header', function () {
           dropboxHeaderButtonClick.call(this);
       });
       $(document).on('click', '.drop-box-button', function () {
           dropboxInsideButtonClick.call(this);
       });
    }
    //inserts data in to the report page uses report object to hold and maintain the data
    this.insertData = function (report) {
        this.chartResults = report.getBarChart();
        this.correctAnswers = report.correctAnswers;
        this.nonCorrectAnswers = report.wrongAnswers;
        this.numberOfQuestions = report.numOfQuestions();
        //run the timeline controller
        this.timeLine = new TimeLineView('mainTimeLine', main.timerController.getOverAllTime(), report.getNumOfVisitedQuestions(), '#questionsTime');
        var guesTimeLine = new TimeLineView('guessTimeLinea', 1, 1, '#guessTimeLine');
        
        var stagesTimeLine = {};
        for (i = 1; i <= 3; i++) {
            stagesTimeLine[stages[i]] = new TimeLineView(stages[i] + '-time-line', report.getTimeInStage(stages[i]), report.getNumOfQuestionsForStage(stages[i]), '#' + stages[i] + 'TimeLine');
        }
        var timelineData = report.getDataForQuestions();
        var stagestimelineData = report.getDataForStages();
        console.log(stagestimelineData);
        //create three stages time line
        for (var stage in stagestimelineData) {
            for (var i = 0; i < stagestimelineData[stage].length; i++) {
                if (stagestimelineData[stage][i].answered) {
                    stagesTimeLine[stage].addToTimeLine(stagestimelineData[stage][i].questionNum, stagestimelineData[stage][i].timeInQuestion, stagestimelineData[stage][i].correct,stagestimelineData[stage][i].asterisk,stagestimelineData[stage][i].questionMark);
                }
                else {

                    stagesTimeLine[stage].addToTimeLineNotAnswered(stagestimelineData[stage][i].questionNum, stagestimelineData[stage][i].timeInQuestion,stagestimelineData[stage][i].asterisk,stagestimelineData[stage][i].questionMark);
                }
            }
        }
        for (var i = 0; i < timelineData.length; i++) {
            if (timelineData[i].answered)
                this.timeLine.addToTimeLine(i + 1, timelineData[i].time, timelineData[i].correct,timelineData[i].asterisk,timelineData[i].questionMark);
            else
                this.timeLine.addToTimeLineNotAnswered(i + 1, timelineData[i].time,timelineData[i].asterisk,timelineData[i].questionMark);
            if (timelineData[i].answered && timelineData[i].guess) {
                guesTimeLine.addToTimeLine(i + 1, 1, timelineData[i].correct,timelineData[i].asterisk,timelineData[i].questionMark);
            }
        }
        createChangedTimeLine(report);
        //add to display
        for (var stage in stagestimelineData)
            stagesTimeLine[stage].addToView();
        guesTimeLine.addToView();
        this.timeLine.addToView();
    }
    //adds time lines for changed questions number of timelines depends on the number of changes done the number is according to maximum changes in a specific question in all questions
    function createChangedTimeLine(report){
        var html = '<div class="change-TimeLine-Holder time-line-grandfather">'
       '</div>'
       var a = report.getDataForChangedQuestions();
                                                                                 
       var timeLine = [];
       for (var i = 0; i < a.length; i++) {
           elem = $(html);
           $(elem).append('<div class="time-line-holder" id="changeTimeLine' + i + '" style="display: inline-block;"></div>');
           $('#changedTimeLineParent').append(elem);
           timeLine.push(new TimeLineView('change' + i, 1, 1, '#changeTimeLine' + i));
       }
       for (var i = 0; i < a.length; i++) {
           for (var j = 0; j < a[i].length; j++) {
               if (a[i][j].changed)
                   timeLine[i].addToTimeLine(a[i][j].qNumber, 1, a[i][j].correct,a[i][j].asterisk,a[i][j].questionMark);
               else
                   timeLine[i].addToTimeLineNotChanged(a[i][j].qNumber,a[i][j].asterisk,a[i][j].questionMark);
           }
       }
       //to set the scrolling to be together we need to cinnect the scrollers
       for (var i = 0; i < a.length; i++) {
          timeLine[i].addToView();
           timeLine[i].conncetScrollers('changedTimeLineParent');
       }
    }
    this.initChart = function () {

        self.tips = ['אחוז השינויים הגבוה שאתה מבצע בסוף המבחן פוגע בציונך'];
        self.setTipIndex(0);

        self.results = [100, 117, 66, 103, 127, 98, 100, 73, 60]; //temp
        self.setResults(self.results);

        //self.questionsTime = [{ time: 5, corectAns: true }, { time: 5, corectAns: true }, { time: 1, corectAns: true }, { time: 3, corectAns: true }, { time: 3, corectAns: true }, { time: 2, corectAns: true }, { time: 7, corectAns: true }, { time: 5, corectAns: true }, { time: 4, corectAns: true }, { time: 1, corectAns: true }, { time: 1, corectAns: true }, { time: 3, corectAns: true }, { time: 9, corectAns: true }, { time: 13, corectAns: true }, { time: 3, corectAns: true }, { time: 5, corectAns: true}];

        self.setUser({ firstName: "ישראל", lastName: "ישראלי" });

        // Load the Visualization API and the piechart package.
        google.load('visualization', '1.0', { 'packages': ['corechart'] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.setOnLoadCallback(self.drawChart);
        
    }
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    this.drawChartPie = function () {
        // Create the data table.
        self.data_pie = new google.visualization.DataTable();
        self.data_pie.addColumn('string', 'Topping');
        self.data_pie.addColumn('number', 'Slices');
        self.data_pie.addRows([
        ['תשובות נכונות', self.correctAnswers],
        ['תשובות שגויות', self.nonCorrectAnswers]
        ]);

        // Set chart options
        self.options_pie = {
            'width': 400,
            'height': 300,
            'legend': { 'position': "none" },
            'colors': ['#6cbf67', '#dbe8f0'],
            'pieSliceTextStyle': {
                'color': 'black'
            },
             'pieSliceText': 'label',
            'fontName': 'Open Sans Hebrew'
        };
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div_pie'));
        chart.draw(self.data_pie, self.options_pie);
    }
    this.drawChartBar = function () {

        sum = this.numberOfQuestions;
        annotation = [];
        //for (count in self.results) {
        //    sum = sum + self.results[count];
        //}
        for (count in self.results) {
            annotation[count] = Math.round((self.chartResults[count] / sum) * 100);
        }
       
        var data_bar = google.visualization.arrayToDataTable([
        ['', '', { role: 'style' }, ''],
        ['שאלות שחזרת עליהן', annotation[0], 'color: #09bef3', annotation[0]+'%'],
        ['שאלות ששינית בהן תשובה', annotation[1], 'color: #f15c44', annotation[1]+'%'],
        ['שאלות בהן שינית מטעות לתשובה נכונה', annotation[2], 'color: #f8f16c', annotation[2]+'%'],
        ['שאלות בהן שינית מתשובה נכונה לטעות', annotation[3], 'color: #6cbf67', annotation[3]+'%'],
        ['שאלות בהן שינית מטעות לטעות', annotation[4], 'color: #e3687d', annotation[4]+'%'],
        ['ניחושים מסך השאלות', annotation[5], 'color: #a254a0', annotation[5]+'%'],
        ['הצלחות בניחושים', annotation[6], 'color: #5588c7', annotation[6]+'%'],
        ['שאלות עם זמן מענה ארוך', annotation[7], 'color: #f57b4c', annotation[7]+'%']
        ]);

        var view = new google.visualization.DataView(data_bar);
        view.setColumns([0, 1,
                        { calc: "stringify",
                            sourceColumn: 3,
                            type: "string",
                            role: "annotation"
                        },
                        2]);
        var options_bar = {
            'legend': { position: "none" },
            'chartArea': { left: 250, top: '12%', width: '60%', height: '75%' },
            'width': 700,
            'tooltip': { 'trigger': "none" },
            'fontName': 'Open Sans Hebrew',
             'hAxis': { ticks: [{v:10, f:'10%'},{v:20, f:'20%'},{v:30, f:'30%'},{v:40, f:'40%'},{v:50, f:'50%'},{v:60, f:'60%'}, {v:70, f:'70%'},{v:80, f:'80%'},{v:90, f:'90%'},{v:100, f:'100%'}],textStyle:{fontSize:11} }
        };

        var chart = new google.visualization.BarChart(document.getElementById('chart_div_bar'));

        chart.draw(view, options_bar);

    }
    this.setResults = function (results) {
        self.results = results;
    }
    this.setQuestionsTime = function (questionsTime) {
        var time;
        for (quest in questionsTime) {
            time = time + questionsTime[quest].time;
        }
        for (quest in questionsTime) {
            self.questionsTime[quest].time = Math.round((self.questionsTime[quest].time / time) * 1110);
            self.questionsTime[quest].questNum = quest;
            self.questionsTime[quest].corectAns = questionsTime[quest].corectAns;
        }
        //self.questionsTime = questionsTime;
        $('#questionsTime').html();
        //<div id="questionsTime" style="background-color: #cec6c6 ; display: inline-block;"></div>
    }
    this.getQuestionsTime = function () {
        return self.questionsTime;
    }
    this.setUser = function (user) {
        self.user = user;
        $('#userName').html(self.user.firstName + " " + self.user.lastName);
    }
    this.setTipIndex = function (index) {
        self.tipIndex = index + 1;
        $('#tips').html(" טיפ  " + self.tipIndex + " : " + self.tips[index]);
    }
    this.drawChart = function () {
        if ($("#reportPage").is(':visible')) {
            self.drawChartPie();
            self.drawChartBar();
        }
    }
    function timeLineTestClick(){
        $('.nonStageTimeLine-Holder').show();
        $('.stageTimeLine-Holder').hide();
        $('#changedTimeLineParent').hide();
        $('#questionsTime').show();
        $('#guessTimeLine').hide();
    }
    function guessClick() {
        $('.nonStageTimeLine-Holder').show();
        $('.stageTimeLine-Holder').hide();
        $('#changedTimeLineParent').hide();
        $('#questionsTime').hide();
        $('#guessTimeLine').show();     
    }
    function changedTimelineClick() {
        $('.nonStageTimeLine-Holder').hide();
        $('.stageTimeLine-Holder').hide();
        $('#questionsTime').hide();
        $('#guessTimeLine').hide();
        $('#changedTimeLineParent').show();
           
    }
    function stagesTimeLineClick(){
        $('.nonStageTimeLine-Holder').hide();
        $('.stageTimeLine-Holder').show();
    }
    function dropboxInsideButtonClick() {
           $(this).parents('.drop-box').find('.drop-box-header').text($(this).text());
           $(this).parents('.drop-box-inside').hide();
       }
       function dropboxHeaderButtonClick() {
           if($(this).parent().parent().find('.drop-box-inside').is(':hidden'))
                $(this).parent().parent().find('.drop-box-inside').show();
            else   
                 $(this).parent().parent().find('.drop-box-inside').hide();
       }
    
}
 //for a given time line elemnts controlls the scrolling of the time line
//for a given time line elemnts controlls the scrolling of the time line
       function TimeLineScroller(element) {
           var self = this;
           var position = 0; //the position anchor for scrolling
           var $elem = $(element); //jquery elemnt that would be scrolled
           this.attachEvents = function () {
               $(window).resize(function () {
                   whenResize(); //on resize--check if arrows would be needed
               });
           }
           //on call for scroll scrolls right
           this.scrollRight = function () {
               var mostRight = getMostRight();
               position += $elem.width() * (75 / 100);
               //check if we are not at the the right most edge if yes fix position that wont run out of bounds
               if (position >= mostRight - $elem.width()) {
                   position = mostRight - $elem.width();
               }
               goTo(); //activate scroll
               checkArrows();
           }
           //on call for scroll scrolls left
           this.scrollLeft = function () {
               position -= $elem.width() * (75 / 100);
               //check if we are not at the the left most edge if yes fix position that wont run out of bounds
               if (position <= 0) {
                   position = 0;
               }
               goTo(); //activate scroll
               checkArrows();
           }
           //checks globally mostly after create if needs scroll and disables the arrows if needed
           this.chekIfNeedScroll = function () {
               checkArrows();
           }
           //activation of scroll
           function goTo() {
               $($elem).animate({
                   //move to position set by the scroll
                   scrollLeft: position
               }, {
                   duration: 600, //the speed 
                   specialEasing: {
                       width: "linear",
                       height: "easeOutBounce"
                   },
                   complete: function () {
                   }
               });
           }
           //get the right most edge
           function getMostRight() {
               //clone the main wrapper of the time line so we can get the exact width of the time line even when is hidden
               var copied_elem = $elem.parent().parent().parent().clone()
                              .attr("id", false)
                              .css({ visibility: "hidden", display: "block",
                                  position: "absolute"
                              });
               copied_elem.find('.time-line-holder').css({ display: "inline-block" });
               $("body").append(copied_elem);
               var scroller_height = copied_elem.height();
               var scroller_width = copied_elem.find('#' + $elem.parent().attr('id') + ' .timelinewrapper').width();

               copied_elem.remove();
               return scroller_width;
           }
           function whenResize() {
               checkArrows();
           }

           //checks if arrows are needed for scroll add and removes them according to need
           function checkArrows() {
               //clone the main wrapper of the time line so we can get the exact width of the time line even when is hidden
               var copied_elem = $elem.parent().parent().parent().clone()
                              .attr("id", false)
                              .css({ visibility: "hidden", display: "block",
                                  position: "absolute"
                              });
               copied_elem.find('.time-line-holder').css({ display: "inline-block" });
               $("body").append(copied_elem);
               var scroller_height = copied_elem.height();
               var scroller_width = copied_elem.find('#' + $elem.parent().attr('id') + ' .timeline').width();
               copied_elem.remove();
               console.log(scroller_width);
               if ((position + scroller_width) < getMostRight())
                   $elem.parent().find('.arrowHolderRight').show();
               else
                   $elem.parent().find('.arrowHolderRight').hide();
               if ((position > 0))
                   $elem.parent().find('.arrowHolderLeft').show();
               else
                   $elem.parent().find('.arrowHolderLeft').hide();
           }
           self.attachEvents();
       }
       //represents a time line in html, name-must-a name given for the time line would be its id, overAllTime-must,toElem-optional
       function TimeLineView(name, overAllTime, numOfQuestions, toElem) {
           var self = this;
           var nOfQuestions = numOfQuestions;
           var questionNum = 0; //a runner for which question we are in
           var elemName = name; //the name of the parent of the timeline
           var attachToElem; //if wanted the name of the element that the time line would be attached to
           var overAllTime = overAllTime; //the over all time of the time line that according to it the pieces of the questions would be set
           var averageTimePerQuestion = (overAllTime / numOfQuestions); //the average time that is given for each question would be used to calculate the width of elements
           var width = 70; //thw shown width of the time line that according to it the proportion of the timeline elemnts would be- its not dynmic according to change of view
           var timelineList = ''; //the holder of the list of the elemnts to be inserted to the timeline
           var scroll; //scroller controll for the time line would be created at creation of timeline
           //check if wanted to attach the time line to specific element, if not the to be attahed to element would just be body
           if (toElem)
               attachToElem = toElem;
           else
               attachToElem = 'body';

           this.attachEvents = function () {
               $(document).on('click', "#" + name + " .arrowHolderLeft", function () {
                   scroll.scrollLeft(); //attach scroll
               });
               $(document).on('click', "#" + name + " .arrowHolderRight", function () {
                   scroll.scrollRight(); //attach scroll
               });
           }
           //connects the events of scrolling of two time lines together
           this.conncetScrollers = function (parentToAll) {
               //$(document).off('click', "#" + name + " .arrowHolderLeft");
               //$(document).off('click', "#" + name + " .arrowHolderRight");
               $(document).off('click', "#" + name + " .arrowHolderLeft");
               $(document).off('click', "#" + name + " .arrowHolderRight");
               $(document).on('click', "#" + parentToAll + " .arrowHolderLeft", function () {
                   //scroll.scrollLeft(); 
                   scroll.scrollLeft(); //attach scroll
               });
               $(document).on('click', "#" + parentToAll + " .arrowHolderRight", function () {
                   //scroll.scrollRight(); 
                   scroll.scrollRight(); //attach scroll
               });
               //$(document).on('click', "#" + other.getName() + " .arrowHolderLeft", function () {
               //    scroll.scrollLeft(); //attach scroll
               //    other.getScroller().scrollLeft();
               //});
               //$(document).on('click', "#" + other.getName() + " .arrowHolderRight", function () {
               //    scroll.scrollRight(); //attach scroll
               //    other.getScroller().scrollRight(); //attach scroll
               //});
           }
           this.getName = function () {
               return elemName;
           }
           this.getScroller = function () {
               return scroll;
           }
           //an adder of elemnts to the time line - doesnt actually add to view, after adding elemnts still needed to activate setToView()
           //adds a reular elemnts depens on time and if correct or not correct
           this.addToTimeLine = function (questionNum, time, correct, asterisk, questionMark) {
               var _asterisk = (asterisk) ? "<img src='img/baloonasterisk.png'></img>" : "";//add asterisk as img if true
               var _questionMArk = (questionMark) ? "?" : "";
               var hidden = (asterisk || questionMark) ? "hasContent" : "noContent"; //variable that holds the class of the yellow part if to be shown or hidden - if no content so hide   
               var correctClass = (correct == true) ? "correct" : "notCorrect";
               var elemWidth = (time / averageTimePerQuestion) * (width);
               //check that wont be to small
               if (elemWidth < 45) {
                   elemWidth = 45;
               }
               var elem = '<div class="timeLineQuestion answered ' + correctClass + '" id="questionNum' + questionNum + '" style="width:' + elemWidth + 'px">' +
                                            '<div class="yellowTop ' + hidden + '">' + _questionMArk + '' + _asterisk + '</div>' +
                                            '<div class="top">' + questionNum + '</div>' +
                                             '<div class="bottom"></div>' +
                                        '</div>';


               timelineList += elem; //question is added to time line

           }
           //as above but an a elemnt of question that was not answered
           this.addToTimeLineNotAnswered = function (questionNum, time, asterisk, questionMark) {
                var _asterisk = (asterisk) ? "<img src='img/baloonasterisk.png'></img>" : "";//add asterisk as img
               var _questionMArk = (questionMark) ? "?" : "";
               var hidden = (asterisk || questionMark) ? "hasContent" : "noContent"; //variable that holds the class of the yellow part if to be shown or hidden - if no content so hide   
               var elemWidth = (time / averageTimePerQuestion) * (width);
               //check that wont be to small
               if (elemWidth < 45) {
                   elemWidth = 45;
               }
               var elem = '<div class="timeLineQuestion notAnswered" id="questionNum' + questionNum + '" style="width:' + elemWidth + 'px">' +
                                            '<div class="yellowTop ' + hidden + '">' + _questionMArk + '' + _asterisk + '</div>' +
                                            '<div class="top">' + questionNum + '</div>' +
                                             '<div class="bottom"></div>' +
                                        '</div>';
               //only if the time is more then 0 so then the question is added to time line
               if (time > 0) {
                   timelineList += elem;
               }
           }
           this.addToTimeLineNotChanged = function (questionNum) {

               var elemWidth = width;
               var elem = '<div class="timeLineQuestion notChanged" id="questionNum' + questionNum + '" style="width:' + elemWidth + 'px">' +
                                            '<div class="top">' + questionNum + '</div>' +
                                             '<div class="bottom"></div>' +
                                        '</div>';
               //add to time line              
               timelineList += elem;

           }
           function addTo(callback) {
               $('#' + name + ' .timelinewrapper').append(timelineList).trigger('create');
               timelineList = '';
               callback();
           }
           //Add the created time line to the page(DOM)
           this.addToView = function () {
               $('#' + name + ' .timelinewrapper').append(timelineList).trigger('create');
               timelineList = ''; //reset for if wanted to add more
               scroll.chekIfNeedScroll(); //check if scroll is needed would check for arrows
           }
           //Add to DOM the wrapper of the timeline - adds name according to wanted name
           function createThis() {
               $(attachToElem).append('<div class="timelineHolder" id=' + name + '>' +
                                               '<div class="arrowHolderLeft" id="leftArrow"><img src="img/arrow2.png"></div>' +
                                                '<div class="timeline">' +
                                               '<div class="timelinewrapper"></div>' +
                                               '</div>' +
                                               '<div class="arrowHolderRight" id="rightArrow"><img src="img/arrow1.png" ></div>' +
                                               '</div>').trigger('create');
               scroll = new TimeLineScroller('#' + name + ' .timeline'); //connects controller to created timeline
           }
           createThis(); //create 
           self.attachEvents(); //attach events
       }