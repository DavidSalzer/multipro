
    var reportController = new ReportController();
        reportController.initChart();

    var timerController = new TimerController();
    
    var testController = new TestController();
    testController.attachEvents();
    testController.initTest(13);
