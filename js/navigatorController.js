//conteolls navigation for pages through hashing controllers should have visit and leave for working with Navigator
function Navigator() {
    var self = this;
    
    var currentPage = '';
    //all controllers are could through main
    var controllers = {"logIn":"logInController","signIn":"signInController","choose-test":"testChooseController", "test":"testController", "reportPage":"reportController", "answers-page":"answerPageController"};


    //attch events for change pages one is the on hash change and other - documnet ready for refresh pages
    this.attachEvents = function () {

        //if refresh so also call the function
        //$(document).on('ready', function () {
        //    if (location.hash == '') {
        //        self.changeHash();
        //    }

        //});

        window.onhashchange = self.changeHash;
    }
    //gets the current page hash with out '#'
    this.getCurrentHash=function(){
        return (location.hash).substring(1);
    }

    this.changeToPage = function (page) {
        //if the moving back to test  which means not getting to test from chosse test so jump to choose test
        //if (page == 'test' && currentPage != 'choose-test')
        //    location.hash = 'choose-test';
        //else//other pages
        if (self.getCurrentHash() != page)
            location.hash = page;
        else
            self.changeHash();
    }

    //on change navigate to page
    this.changeHash = function () {
        //scroll to the top of page
        $(window).scrollTop(0);

        //get the hash and go to wanted page and leave currnt page
        var moveTo = (location.hash).substring(1);
        console.log(moveTo);
        console.log(currentPage);
        //leave the page that was at but might be refreshed so if the same as the current dont
        if (currentPage != '')
            main[controllers[currentPage]].leave();
        //if the moving back to test  which means not getting to test from chosse test so jump to choose test
        //if (moveTo == 'test' && currentPage != 'choose-test')
        //    moveTo = 'choose-test';


        //move to the wanted page 
        
        main[controllers[moveTo]].visit();
        currentPage = moveTo; //save the new page as current
        

    }
}