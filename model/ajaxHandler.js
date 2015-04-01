
function ajaxHandler() {
    //var domain = "http://multipro.local/";
    var domain = "http://multipro.co.il.tigris.nethost.co.il/";

    this.getTestYears = getTestYears;
    this.getTestNames=getTestNames;
    this.getQuestionsForTest = getQuestionsForTest;
    this.getTestNameById = getTestNameById;
    this.getTests = getTests;
    this.tester = tester;
    this.addUser = addUser;
    this.logIn = logIn;
    this.logOut = logOut;
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

    function tester() {
        $.ajax({
            type: 'GET',
            data:{
                username:"blba56",
                password:"123456",
                email:"asd@dsadhhhhs.com"  
            },
            url: domain + "?json=users.getCurrent&dev=1",
            dataType: 'json',
            success: function (data) {
                console.log(data);
            },
            error: function (e) {
                console.log(e.message);
            }
        });
    }
    //add user to the word press database with no permissons
    function addUser(username,pass,email,callback) {
        $.ajax({
            type: 'GET',
            data:{
                username:username,
                password:pass,
                email:email  
            },
            url: domain + "?json=users.add_user&dev=1",
            dataType: 'json',
            success: function (data) {
               if(callback)
                    callback(data)
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }
    //log in for given user log in with the wordpress
    function logIn(username,pass,callback) {
        $.ajax({
            type: 'GET',
            data:{
                username:username,
                password:pass
            },
            url: domain + "?json=users.logIn&dev=1",
            dataType: 'json',
            success: function (data) {
               if(callback)
                    callback(data)
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }
    //logs out current user that is logged on current session
    function logOut(callback) {
        $.ajax({
            type: 'GET',       
            url: domain + "?json=users.logOut&dev=1",
            dataType: 'json',
            success: function (data) {
               if(callback)
                    callback(data)
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }

    //checks if there is a user logged on current session
    function check_logged_in(callback) {
        $.ajax({
            type: 'GET',       
            url: domain + "?json=users.check_is_logged_in&dev=1",
            dataType: 'json',
            success: function (data) {
               if(callback)
                    callback(data)
            },
            error: function (e) {
                console.log(e.message);
                callback(new ErrorHandler(0)); //sends an error handler
            }
        });
    }


}