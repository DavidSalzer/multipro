
function ajaxHandler() {
    //var domain = "http://multipro.local/";
    var domain = "http://multipro.co.il.tigris.nethost.co.il/";

    this.getTestYears = getTestYears;
    this.getTestNames=getTestNames;
    this.getQuestionsForTest = getQuestionsForTest;
    this.getTestNameById = getTestNameById;
    this.getTests = getTests;
    this.set_last_question = set_last_question;
    this.get_last_question = get_last_question;
    this.tester = tester;
    this.addUser = addUser;
    this.logIn = logIn;
    this.logOut = logOut;
    this.add_question_data_to_user = add_question_data_to_user;
    this.get_logged_in = get_logged_in;
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
    //calls from domain questions of tests-and sets the questions in two arrays one is for the not done questions and second for done questions, gets the number of wanted questions of not done
    function getQuestionsForTest(user_id,test_id,numberOfQuestions, callback) {
        $.ajax({
            type: 'GET',
            url: domain + "?json=multi.getQuestionsForTest&dev=1",
            dataType: 'json',
             data:{
                userID:user_id,
                numberOfQuestions:numberOfQuestions,
                testID:test_id
            },
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
    //gets all test from server
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
    function set_last_question(user_id,test_id,number_of_question,callback) {
        $.ajax({
            type: 'GET',
            data:{
                userID:user_id,
                testID:test_id,
                numOfQuestion:number_of_question
            },
            url: domain + "?json=multi.set_last_question&dev=1",
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
    //gets the number of the last question of given test id
    function get_last_question(user_id,test_id,callback) {
        $.ajax({
            type: 'GET',
            data:{
                userID:user_id,
                testID:test_id
            },
            url: domain + "?json=multi.get_last_question&dev=1",
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
    function add_question_data_to_user(userId,qArr,testid,callback) {
        $.ajax({
            type: 'POST',
            data: {
                questionArr:JSON.stringify(qArr),
                userID:userId,
                testID:testid
            },
            url: domain + "?json=multi.set_test_behavior&dev=1",
            dataType: 'json',
            success: function (data) {
                if (callback)
                    callback(data);
            },
            error: function (e) {
                console.log(e.message);
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
            url: domain + "?json=multi.getQB&dev=1",
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
            xhrFields: {
             withCredentials: true
           },  
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
    function logIn(email,pass,callback) {
        var d = new Date();
        var n = d.getTime();
        $.ajax({
            type: 'GET',
            data: {
                email: email,
                password: pass
            },
            xhrFields: {
             withCredentials: true
           },   
            url: domain + "?json=users.logIn&dev=1&x="+n,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (callback)
                    callback(data);
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
            xhrFields: {
             withCredentials: true
           },
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

    //gets current userthat is logged in on current session
    function get_logged_in(callback) {
        $.ajax({
            type: 'POST',
            xhrFields: {
             withCredentials: true
           },
                 
            url: domain + "?json=users.getCurrent&dev=1",
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