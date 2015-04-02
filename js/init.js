var main = {//holds all controllers
    ajax: new ajaxHandler(),

    logInController: new LogInController(),
    signInController: new SignInController(),
    timerController: new TimerController(),
    testChooseController: new TestChooserController(),
    testController: new TestController(),
    reportController: new ReportController(),
    answerPageController: new AnswerPageController('#answers-page'),
    navigatorController: new Navigator(),


    start: function () {
        main.navigatorController.attachEvents();
        main.reportController.initChart();
        main.ajax.get_logged_in(function (data) {
            console.log(data)
            if (data != false) {//if logged in and got user so go to choose test
                main.userId = data.ID; //the user id that was created-saved globally
                main.navigatorController.changeToPage('choose-test');
                $('#user-name,#welcome-name').text(data.data.display_name);
                console.log(data);
            }
            else {//not logged in so go to log in page
                main.navigatorController.changeToPage('logIn'); //the first page to move to
            }
        })
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
