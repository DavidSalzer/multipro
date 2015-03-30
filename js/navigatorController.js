function Navigator() {
    var self = this;
    
    var currentPage = '';

    var controllers = {"choose-test":"testChooseController", "test":"testController", "reportPage":"reportController", "answers-page":"answerPageController"};

    var pages = ["choose-test", "test", "reportPage", "answers-page"];

    this.attachEvents = function () {

        //if refresh so also call the function
        $(document).on('ready', function () {
            if(location.hash!='')
                self.changeHash();
        });

        window.onhashchange = self.changeHash;
    }

    this.changeToPage = function (page) {
        ////if the moving back to test  which means not getting to test from chosse test so jump to choose test
        //if (page == 'test' && currentPage != 'choose-test')
        //    location.hash = 'choose-test';
        //else//other pages
            location.hash = page;
    }

    //on change navigate to page
    this.changeHash = function () {
        //scroll to the top of page
        $(window).scrollTop(0);

        //get the hash and go to wanted page and leave currnt page
        var moveTo = (location.hash).substring(1);

        //leave the page that was at but might be refreshed so if the same as the current dont
        if (currentPage != '')
            main[controllers[currentPage]].leave();
        //if the moving back to test  which means not getting to test from chosse test so jump to choose test
        //if (moveTo == 'test' && currentPage != 'choose-test')
        //    moveTo = 'choose-test';
        

        //move to the wanted page 
        console.log(controllers[moveTo]);
        main[controllers[moveTo]].visit();
        currentPage = moveTo; //save the new page as current
        console.log(moveTo);
    }
}