var travelibroservice = angular.module('travelibroservice', ['cfp.loadingBar'])

  .factory('TravelibroService', function ($http, cfpLoadingBar, TemplateService) {
    return {
      http: function (obj, status) {
        var accessToken = $.jStorage.get("accessToken");
        if (!obj) {
          obj = {};
        }
        if (!obj.data) {
          obj.data = {};
        }
        obj.data.accessToken = accessToken;
        switch (status) {
          case 'searchHeaderLoad':
            TemplateService.searchHeaderLoad = true;
            break;
          case 'searchLoad':
            TemplateService.searchLoader = true;
            break;
          case 'paginationLoad':
            if (obj.data.pagenumber == 1) {
              cfpLoadingBar.start();
            } else {
              TemplateService.paginationLoader = true;
            }
            break;
          case 'allLoader':
            cfpLoadingBar.start();
            break;
          default:

        }
        // if(status!=true){
        //   cfpLoadingBar.start();
        // }
        // console.log("start http");
        // console.log(obj,'obj');
        var callbackFor = $http(obj).success(function (data) {
          // if(status!=true){
          //   cfpLoadingBar.complete();
          // }
          switch (status) {
            case 'searchHeaderLoad':
              TemplateService.searchHeaderLoad = false;
              break;
            case 'searchLoad':
              //  alert('TemplateService');
              TemplateService.searchLoader = false;
              break;
            case 'paginationLoad':
              if (obj.data.pagenumber == 1) {
                cfpLoadingBar.complete();
              } else {
                TemplateService.paginationLoader = false;
              }
              break;
            case 'allLoader':
              cfpLoadingBar.complete();
              break;
            default:
          }
          // console.log("end http");
          return data;
        });
        return callbackFor;
      },
      post: function (callApiUrl, formData, status) {
        // console.log(callApiUrl, formData,status);
        var accessToken = $.jStorage.get("accessToken");
        if (!formData) {
          formData = {};
        }
        formData.accessToken = accessToken;
        switch (status) {
          case 'searchHeaderLoad':
            TemplateService.searchHeaderLoad = true;
            break;
          case 'searchLoad':
            // alert('chaalu');
            TemplateService.searchLoader = true;
            break;
          case 'paginationLoad':
            if (formData.pagenumber == 1) {
              cfpLoadingBar.start();
            } else {
              TemplateService.paginationLoader = true;
            }
          case 'allLoader':
            cfpLoadingBar.complete();
            break;
          default:

        }
        // if(status!=true){
        //   cfpLoadingBar.start();
        // }
        // console.log("start post");
        var callbackFor = $http({
          url: callApiUrl,
          data: formData,
          method: "POST",
        }).success(function (data) {
          switch (status) {
            case 'searchHeaderLoad':
              TemplateService.searchHeaderLoad = false;
              break;
            case 'searchLoad':
              // alert('baaand');
              TemplateService.searchLoader = false;
              break;
            case 'paginationLoad':
              if (formData.pagenumber == 1) {
                cfpLoadingBar.complete();
              } else {
                TemplateService.paginationLoader = false;
              }
              break;
            case 'allLoader':
              cfpLoadingBar.complete();
              break;
            default:

          }
          // if(status!=true){
          //   cfpLoadingBar.complete();
          // }
          // console.log("end post");
          return data;
        });
        return callbackFor;
      },
    };
  });
