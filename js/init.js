var main = {//holds all controllers
    ajax: new ajaxHandler(),

    signInController:new SignInController(),
    timerController: new TimerController(),
    testChooseController: new TestChooserController(),
    testController: new TestController(),
    reportController: new ReportController(),
    answerPageController: new AnswerPageController('#answers-page'),
    navigatorController: new Navigator(),


    start: function () {
        //main.reportController = new TestController();
        main.navigatorController.attachEvents();
        main.reportController.initChart();
        main.navigatorController.changeToPage('choose-test');//the first page to move to
        
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
