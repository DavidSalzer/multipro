function SignInController() {
     var self = this;
     var numberOfVisits=0;

     //first entrance need to attach all events of page else we dont want double events
     this.attachEvents = function () {
         $(document).on('click', '#signup-submit', form_submit);//submit form

          $(document).on('click', '#go-to-login-btn', function () {//go to log in button
             main.navigatorController.changeToPage('logIn');
         })
     }
     //represents an netrance to page
     this.visit = function () {
         if (numberOfVisits == 0) {

             self.attachEvents();

         }
          $('#go-to-login-btn').show();
         $('.signIn-page').show();
         numberOfVisits++;
     }

     this.leave = function () { 
          $('.signIn-page').hide();
           $('#go-to-login-btn').hide();
     }

     function form_submit() {
         
         var username = $('.form-signup-input.name').val();
         var password = $('.form-signup-input.password').val();
         var email = $('.form-signup-input.email').val();
         main.ajax.addUser(username, password, email, function (data) {
             if (!data.error) {//add user to data base and go to chhose test-if there is no erroe
                 main.userId = data.id; //the user id that was created-saved globally
                 main.navigatorController.changeToPage('choose-test');
                 $('#user-name,#welcome-name').text(username);
                 console.log(data);
             }
             else {
                 alert(data.text); //show error text
             } //error
         });
     }
}