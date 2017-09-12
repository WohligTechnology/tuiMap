var templateservicemod = angular.module('templateservicemod', []);
templateservicemod.service('TemplateService', function ($http, $state) {

    // this.title = "Home";
    this.meta = "Google";
    this.metadesc = "Home";
    this.searchHeaderLoad = false;
    this.searchLoader = false;
    this.paginationLoader = false;
    this.allLoader = false;
    this.isMine = false;
    this.uploadLoader = false;

    var d = new Date();
    this.year = d.getFullYear();

    this.init = function () {
        this.headermenu = "views/headermenu.html";
        this.header = "views/header.html";
        this.menu = "views/menu.html";
        this.slider = "views/slider.html";
        this.content = "views/content/content.html";
        this.footermenu = "views/footermenu.html";
        this.footer = "views/footer.html";
    };

    this.changecontent = function (page) {
        if (page != "home") {
            $("body > .loaders").remove();
            $("body > .loadedContent").fadeIn(1000);
        }
        this.init();
        var data = this;
        data.content = "views/content/" + page + ".html";
        return data;

    };

    this.init();

});
