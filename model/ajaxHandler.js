 //var domain = "http://multipro.local/";
 var domain = "http://multipro.co.il.tigris.nethost.co.il/";
 
 function ErrorHandler(etype) {
     var errorTexts = ["תקלה בחיבור לשרת"];
     //hold the types of erros
     //0-connection error with server
     this.error=true;//says that there is an error
     this.errorType = etype;
     this.errorText = errorTexts[this.errorType];
 }

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
             callback(new ErrorHandler(0));//sends an error handler
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
 function getQuestionsForTest(testId,callback) {
     $.ajax({
         type: 'GET',
         url: domain + "?json=multi.getQuestionsForTest&id="+testId+"&dev=1",
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
             callback(new ErrorHandler(0));//sends an error handler
         }
     });
 }
 function getTestNameById(testId,callback) {
     $.ajax({
         type: 'GET',
         url: domain + "?json=multi.getTestNameForId&id="+testId+"&dev=1",
         dataType: 'json',
         success: function (data) {                        
             if (callback)
                 callback(data);
         },
         error: function (e) {
             console.log(e.message);
             callback(new ErrorHandler(0));//sends an error handler
         }
     });
 }