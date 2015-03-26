
function ajaxHandler() {
    var domain = "http://multipro.local/";
    //var domain = "http://multipro.co.il.tigris.nethost.co.il/";
    this.getTestYears = getTestYears;
    this.getTestNames=getTestNames;
    this.getQuestionsForTest = getQuestionsForTest;
    this.getTestNameById = getTestNameById;
    this.getTests = getTests;
    //calls from domain all the years of tests
    function getTestYears(callback) {
        $.ajax({
            type: 'GET',
            url: domain + "?json=multi.getYears&dev=1",
            dataType: 'json',
            success: function (data) {
                dataArr = [];
                for (var attr in data) {//set data to arr and not obj
                    if (attr != 'status')
                        dataArr.push(data[attr]);
                }
                if (callback)
                    callback(dataArr);
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }
    //calls from domain all the names of tests
    function getTestNames(callback) {
        $.ajax({
            type: 'GET',
            url: domain + "?json=multi.getTestNames&dev=1",
            dataType: 'json',
            success: function (data) {
                dataArr = [];
                for (var attr in data) {//set data to arr and not obj
                    if (attr != 'status')
                        dataArr.push(data[attr]);
                }
                if (callback)
                    callback(dataArr);
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }
    //calls from domain all the names of tests
    function getQuestionsForTest(testId, callback) {
        $.ajax({
            type: 'GET',
            url: domain + "?json=multi.getQuestionsForTest&id=" + testId + "&dev=1",
            dataType: 'json',
            success: function (data) {
                dataArr = [];
                for (var attr in data) {//set data to arr and not obj
                    if (attr != 'status')
                        dataArr.push(data[attr]);
                }
                if (callback)
                    callback(dataArr);
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }
    function getTestNameById(testId, callback) {
        $.ajax({
            type: 'GET',
            url: domain + "?json=multi.getTestNameForId&id=" + testId + "&dev=1",
            dataType: 'json',
            success: function (data) {
                if (callback)
                    callback(data);
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }
    function getTests(callback) {
        $.ajax({
            type: 'GET',
            url: domain + "?json=multi.getTests&dev=1",
            dataType: 'json',
            success: function (data) {
                dataArr = [];
                for (var attr in data) {//set data to arr and not obj()
                    if (attr != 'status')
                        dataArr.push(data[attr]);
                }
                if (callback)
                    callback(dataArr);
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }
}