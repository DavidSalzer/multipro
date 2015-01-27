function ReportController() {
    var self = this;

    this.attachEvents = function () {
    }

    this.initChart = function () {

        self.tips = ['אחוז השינויים הגבוה שאתה מבצע בסוף המבחן פוגע בציונך'];
        self.setTipIndex(0);

        self.results = [100, 117, 66, 103, 127, 98, 100, 73, 60]; //temp
        self.setResults(self.results);

        self.questionsTime = [{time:5,corectAns:true},{time:5,corectAns:true},{time:1,corectAns:true},{time:3,corectAns:true},{time:3,corectAns:true},{time:2,corectAns:true},{time:7,corectAns:true},{time:5,corectAns:true},{time:4,corectAns:true},{time:1,corectAns:true},{time:1,corectAns:true},{time:3,corectAns:true},{time:9,corectAns:true},{time:13,corectAns:true},{time:3,corectAns:true},{time:5,corectAns:true}];

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
        var data_pie = new google.visualization.DataTable();
        data_pie.addColumn('string', 'Topping');
        data_pie.addColumn('number', 'Slices');
        data_pie.addRows([
        ['תשובות נכונות', 3],
        ['תשובות שגויות', 1]
        ]);

        // Set chart options
        var options_pie = {
            'width': 400,
            'height': 300,
            'legend': { 'position': "none" },
            'colors': ['#6cbf67', '#dbe8f0'],
            'fontName': 'Open Sans Hebrew'
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div_pie'));
        chart.draw(data_pie, options_pie);
    }
    this.drawChartBar = function () {
        
        sum = 0;
        annotation = [];
        for (count in self.results) {
            sum = sum + self.results[count];
        }
        for (count in self.results) {
            annotation[count] = Math.round((self.results[count] / sum) * 100) + '%';
        }
        var data_bar = google.visualization.arrayToDataTable([
        ['', '', { role: 'style' }, ''],
        ['שאלות שחזרת עליהן', self.results[0], 'color: #09bef3', annotation[0]],
        ['שאלות ששינית בהן תשובה', self.results[1], 'color: #f15c44', annotation[1]],
        ['שאלות בהן שינית מטעות לתשובה נכונה', self.results[2], 'color: #f8f16c', annotation[2]],
        ['שאלות בהן שינית מתשובה נכונה לטעות', self.results[3], 'color: #6cbf67', annotation[3]],
        ['שאלות בהן שינית מטעות לטעות', self.results[4], 'color: #e3687d', annotation[4]],
        ['ניחושים מסך השאלות', self.results[5], 'color: #a254a0', annotation[5]],
        ['הצלחות בניחושים', self.results[6], 'color: #5588c7', annotation[6]],
        ['שאלות עם זמן מענה ארוך', self.results[7], 'color: #f57b4c', annotation[7]]
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
        self.tipIndex = index +1 ;
        $('#tips').html( " טיפ  " + self.tipIndex+" : " + self.tips[index]);
    }
    this.drawChart = function () {
        self.drawChartPie();
        self.drawChartBar();
    }
}