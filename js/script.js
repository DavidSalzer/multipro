var domain = "http://multipro.co.il.tigris.nethost.co.il/";
function request(url, callback) {

    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (data) {
            callback(data);
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}

function getTest() {
    var givenq=[];
    var url = domain + "?json=get_recent_posts&post_type=question";
    request(url, function (data) {
        if (data && data.posts) {
            var questions = data.posts;
            for (var i = 0; i < questions.length; i++) {
                givenq[i] = {};
                givenq[i].question = questions[i]["custom_fields"]["wpcf-question"][0];
                givenq[i].answers = questions[i]["custom_fields"]["wpcf-answer"][0];
                givenq[i].correctAns = questions[i]["custom_fields"]["wpcf-correct"][0];
                givenq[i].handler = new QuestionHandler();
            }
        }
        console.log(data);
    });
}

