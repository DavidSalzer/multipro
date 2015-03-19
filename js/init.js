
    var reportController = new ReportController();
        reportController.initChart();

    var timerController = new TimerController();
    timerController.initGeneralTimer(78);
    var testController = new TestController();
    testController.attachEvents();
    testController.initTest(13);
