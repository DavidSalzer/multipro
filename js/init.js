var main = {//holds all controllers
    ajax: new ajaxHandler(),
    timerController: new TimerController(),
    testChooseController: null,
    testController: new TestController(),
    reportController: new ReportController(),


    start: function () {
        //main.reportController = new TestController();
        main.reportController.initChart();
        main.ajax.getTests(function (data) {
            if (!data.error) {
                var testArr = []; ;
                for (var i = 0; i < data.length; i++) {
                    testArr.push(new Test(data[i].id, data[i].title, data[i].numberOfQuestions));
                }
                main.testChooseController = new TestChooserController(testArr);
                main.testChooseController.visit();
            }
        });
    }
}
    main.start();
    //var reportController = new ReportController();
    //    reportController.initChart();

    //var timerController = new TimerController();
    //
    //var testController = new TestController();
    //testController.attachEvents();
    //testController.initTest(1038);
