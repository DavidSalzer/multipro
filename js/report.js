function ReportController() {
    var self = this;
    //var handler = new Report();
    this.data_pie;
    this.chartResults= [100, 117, 66, 103, 127, 98, 100, 73, 60]; //temp;
    this.correctAnswers=0;
    this.nonCorrectAnswers = 100;
    this.numberOfQuestions=200;
    this.timeLine;
    this.attachEvents = function () {

    }
    this.insertData = function (report) {
        this.chartResults = report.getBarChart();
        this.correctAnswers = report.correctAnswers;
        this.nonCorrectAnswers = report.wrongAnswers;
        this.numberOfQuestions = report.numOfQuestions();
        this.timeLine = new TimeLineView('mainTimeLine', 50, '#questionsTime');
        var timelineData = report.getDataForQuestions();
        for (var i = 0; i < timelineData.length; i++) {
            if (timelineData[i].answered)
                this.timeLine.addToTimeLine(timelineData[i].time, timelineData[i].correct);
            else
                this.timeLine.addToTimeLineNotAnswered(timelineData[i].time);
        }
        this.timeLine.addToView();

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
            annotation[count] = Math.round((self.chartResults[count] / sum) * 100) + '%';
        }
        var data_bar = google.visualization.arrayToDataTable([
        ['', '', { role: 'style' }, ''],
        ['שאלות שחזרת עליהן', self.chartResults[0], 'color: #09bef3', annotation[0]],
        ['שאלות ששינית בהן תשובה', self.chartResults[1], 'color: #f15c44', annotation[1]],
        ['שאלות בהן שינית מטעות לתשובה נכונה', self.chartResults[2], 'color: #f8f16c', annotation[2]],
        ['שאלות בהן שינית מתשובה נכונה לטעות', self.chartResults[3], 'color: #6cbf67', annotation[3]],
        ['שאלות בהן שינית מטעות לטעות', self.chartResults[4], 'color: #e3687d', annotation[4]],
        ['ניחושים מסך השאלות', self.chartResults[5], 'color: #a254a0', annotation[5]],
        ['הצלחות בניחושים', self.chartResults[6], 'color: #5588c7', annotation[6]],
        ['שאלות עם זמן מענה ארוך', self.chartResults[7], 'color: #f57b4c', annotation[7]]
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
            'chartArea': { left: 300, top: '12%', width: '50%', height: '75%' },
            'width': 700,
            'tooltip': { 'trigger': "none" },
            'fontName': 'Open Sans Hebrew'
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
}
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
                    return $elem.find($('.timelinewrapper')).width();
                }
                function whenResize() {
                    checkArrows();
                }

                //checks if arrows are needed for scroll add and removes the according to need
                function checkArrows() {
                    if ((position + $elem.width()) < getMostRight())
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
function TimeLineView(name, overAllTime, toElem) {
                var self = this;
                var questionNum = 0; //a runner for which question we are in
                var elemName = name; //the name of the parent of the timeline
                var attachToElem; //if wanted the name of the element that the time line would be attached to
                var overAllTime = overAllTime; //the over all time of the time line that according to it the pieces of the questions would be set
                var width = 1600; //thw shown width of the time line that according to it the proportion of the timeline elemnts would be- its not dynmic according to change of view
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
                //an adder of elemnts to the time line - doesnt actually add to view, after adding elemnts still needed to activate setToView()
                //adds a reular elemnts depens on time and if correct or not correct
                this.addToTimeLine = function (time, correct) {
                    questionNum++;
                    var correctClass = (correct == true) ? "correct" : "notCorrect";
                    var elemWidth = (width / overAllTime) * time;
                    var elem = '<div class="timeLineQuestion answered ' + correctClass + '" id="questionNum' + questionNum + '" style="width:' + elemWidth + 'px">' +
                                    '<div class="top">' + questionNum + '</div>' +
                                     '<div class="bottom"></div>' +
                                '</div>';
                    //only if the time is more then 0 so then the question is added to time line
                    if (time > 0) {
                        timelineList += elem;
                    }
                }
                //as above but an a elemnt of question that was not answered
                this.addToTimeLineNotAnswered = function (time) {
                    questionNum++;
                    var elemWidth = (width / overAllTime) * time;
                    var elem = '<div class="timeLineQuestion notAnswered" id="questionNum' + questionNum + '" style="width:' + elemWidth + 'px">' +
                                    '<div class="top">' + questionNum + '</div>' +
                                     '<div class="bottom"></div>' +
                                '</div>';
                    //only if the time is more then 0 so then the question is added to time line
                    if (time > 0) {
                        timelineList += elem;
                    }
                }
                //Add the created time line to the page(DOM)
                this.addToView = function () {
                    $('#' + name + ' .timelinewrapper').append(timelineList).trigger('create');
                    timelineList = '';//reset for if wanted to add more
                    scroll.chekIfNeedScroll();//check if scroll is needed would check for arrows
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
                    scroll = new TimeLineScroller('#' + name + ' .timeline');//connects controller to created timeline
                }
                createThis();//create 
                self.attachEvents();//attach events
            }