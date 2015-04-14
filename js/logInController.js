function LogInController() {
     var self = this;
     var numberOfVisits=0;

     //first entrance need to attach all events of page else we dont want double events
     this.attachEvents = function () {
         $(document).on('click', '#login-submit', form_submit); //submit form

         $(document).on('click', '#go-to-signin-btn', function () {
             main.navigatorController.changeToPage('signIn');
         })
     }
     //represents an netrance to page
     this.visit = function () {
         if (numberOfVisits == 0) {

             self.attachEvents();

         }
         $('#go-to-signin-btn').show();
         $('.Login-page').show();
         $('.footer').show();
         $("#timer").hide();
        $('#user-container').hide();
        $('#logo').hide();
        $("#test-title").hide();
        $("#general-timer").hide();
         numberOfVisits++;
     }

     this.leave = function () { 
           $('.Login-page').hide();
           $('#go-to-signin-btn').hide();
     }

     function form_submit() {
         
         var password = $('.form-Login-input.password').val();
         var email = $('.form-Login-input.email').val();
         main.ajax.logIn(email, password, function (data) {
             if (!data.error) {//add user to data base and go to chhose test-if there is no erroe
                 main.userId = data.user.ID; //the user id that was created-saved globally
                 main.navigatorController.changeToPage('choose-test');
                 $('#user-name,#welcome-name').text(data.user.data.display_name);
                 console.log(data);
             } //success
             else {
                 var msg = '';
                 for (var i = 0; i < data.error.length; i++)
                     msg += data.error[i].text + ', ';
                 alert(msg);
             } //error
         });
     }
}