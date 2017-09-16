// JavaScript Document
var initMap = {};
var backgroundClick = {
  object: undefined,
  close: function (e) {
    console.log(backgroundClick.object.backgroundClick);
    // if the classes given below is not added in respective div elements, then it will work normally as it was previously
    if ($(e.target).parents().hasClass(backgroundClick.object.innerClass)) {
      return;
    } else if ($(e.target).hasClass(backgroundClick.object.outerClass)) {
      backgroundClick.object.backgroundClick = !backgroundClick.object.backgroundClick;
      backgroundClick.scope.$apply();
    } else {
      backgroundClick.object.backgroundClick = false;
      backgroundClick.object.backgroundClick = undefined;
      backgroundClick.scope.$apply();
    }
  }
};

$(document).ready(function () {
  $("body").click(function (e) {
    // console.log(backgroundClick.object);
    if (backgroundClick.object) {
      backgroundClick.close(e);
    }
  });
});

$("body").click(function (e) {
  // console.log($(e.target).parent().hasClass('drop-content'));
  // console.log($(e.target).hasClass('toggle-dropDown'));
  if ($(e.target).parent().hasClass('drop-content')) {
    return;
  } else if ($(e.target).hasClass('toggle-dropDown')) {
    // $scope.viewDropdown.showDropdown = !$scope.viewDropdown.showDropdown;
    // $scope.$apply();
  } else {
    // $scope.viewDropdown.showDropdown = false;
    // $scope.$apply();
  }
});



var imageTestingCallback = function (dataURI, type) {
  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var bbSetting = new Blob([ab], {
    type: type
  });
  // Blob to File
  // var file = new File([blob], 'photo-' + "1" + '.png');
  // console.log(file);
  // File to FormData
  var formData = new FormData();
  console.log(formData, "before appending");
  formData.append('file', bbSetting, 'abcd.png');
  console.log(formData, "after appending");
  return formData;
};

var firstapp = angular.module('firstapp', [
  'ui.router',
  'phonecatControllers',
  'templateservicemod',
  'navigationservice',
  'pascalprecht.translate',
  'imageupload',
  'angulartics',
  'fileuploadservicemod',
  'angularFileUpload',
  'angular-google-analytics',
  'highcharts-ng'
]);

firstapp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, cfpLoadingBarProvider, AnalyticsProvider, ipnConfig) {
  // for http request with session
  ipnConfig.defaultCountry = 'us';
  ipnConfig.initialCountry = "auto";

  ipnConfig.utilsScript = "../bower_components/intl-tel-input/lib/libphonenumber/build/utils.js";
  AnalyticsProvider.setAccount('UA-73461827-3');
  $httpProvider.defaults.withCredentials = true;
  cfpLoadingBarProvider.includeSpinner = true;
  cfpLoadingBarProvider.latencyThreshold = 2000;
  cfpLoadingBarProvider.includeBar = true;
  cfpLoadingBarProvider.spinnerTemplate = '<div id="loader" class="travelibro-loader"><img src="img/loader.gif" width="180px"  class="img-responsive" /></div>';
  $stateProvider
    .state('ongojourney', {
      url: "/itinerary/:id",
      templateUrl: "views/template.html",
      controller: 'OnGoJourneyCtrl'
    })
  $urlRouterProvider.otherwise('/itinerary/1');
  $locationProvider.html5Mode(isproduction);
}).run(['Analytics', function (Analytics) {}]);;


// firstapp.directive('loadingText', function ($compile, $parse,$document) {
//   return {
//     restrict: 'EA',
//     replace: false,
//     link: function ($scope, element, attrs) {
//       var $element = $(element);
//       dem = $element;
//       dem.typed({
//         strings: ["Capture | Inspire | Relive...", "Travel Life | Local Life...", "Loading...", "Almost There..."],
//         startDelay: 20,
//         typeSpeed: 100,
//         loop: true
//       });
//     }
//   }
// });

// firstapp.directive('img', function ($compile, $parse) {
//   return {
//     restrict: 'E',
//     replace: false,
//     link: function ($scope, element, attrs) {
//       var $element = $(element);
//       if (!attrs.noloading) {
//         $element.after("<img src='img/loading.gif' class='loading' />");
//         var $loading = $element.next(".loading");
//         $element.load(function () {
//           $loading.remove();
//           $(this).addClass("doneLoading");
//         });
//       } else {
//         $($element).addClass("doneLoading");
//       }
//     }
//   };
// });

firstapp.directive('autoHeight', function ($compile, $parse) {
  return {
    restrict: 'EA',
    replace: false,
    link: function ($scope, element, attrs) {
      var $element = $(element);
      var windowHeight = $(window).height();

      $element.css("min-height", windowHeight);
      setTimeout(function () {
        $element.css("min-height", windowHeight);
      });
    }
  };
});

firstapp.directive('fancyboxBox', function ($document) {
  return {
    restrict: 'EA',
    replace: false,
    link: function (scope, element, attr) {
      var $element = $(element);
      var target;
      if (attr.rel) {
        target = $("[rel='" + attr.rel + "']");
      } else {
        target = element;
      }

      target.fancybox({
        openEffect: 'fade',
        closeEffect: 'fade',
        closeBtn: true,
        helpers: {
          media: {}
        }
      });
    }
  };
});


firstapp.config(function ($translateProvider) {
  $translateProvider.translations('en', LanguageEnglish);
  $translateProvider.translations('hi', LanguageHindi);
  $translateProvider.preferredLanguage('en');
});

firstapp.directive('scrolldown', function ($compile, $parse) {
  return {
    restrict: 'EA',
    replace: false,
    link: function ($scope, element, attrs) {
      var $element = $(element);
      $scope.scrollDown = function () {
        $('html,body').animate({
            scrollTop: $(".second").offset().top
          },
          'slow');
      };
    }
  };
});


firstapp.directive('scroll', function ($window) {
  return {
    restrict: 'EA',
    replace: false,
    link: function ($scope, element, attrs) {
      var $element = $(element);
      var divslide5 = $('#slide5')[0].scrollHeight;
      var winTop = $(window).scrollTop();
      console.log(winTop);
      console.log(divslide5);
      angular.element($window).bind("scroll", function () {
        console.log(divslide5 - 1);
        if (winTop > divslide5) {
          scope.active = true;
          console.log("all done");
        }
      });
    }
  };
});

firstapp.directive("scrolladdclass", function ($window) {
  return function (scope, element, attrs) {
    angular.element($window).bind("scroll", function () {
      var windowHeight = $(window).height() - 120;
      if (this.pageYOffset >= windowHeight) {
        // console.log(windowHeight);
        element.addClass('addfixed');
      } else {
        element.removeClass('addfixed');
      }
    });
  };
});

firstapp.directive("scrolladd1class", function ($window) {
  return function (scope, element, attrs) {
    angular.element($window).bind("scroll", function () {
      var windowHeight = $(window).height();
      if (this.pageYOffset >= 50) {
        // console.log(windowHeight);
        element.addClass('addfixed');
      } else {
        element.removeClass('addfixed');
      }
    });
  };
});

firstapp.directive("scrolladd2class", function ($window) {
  return function (scope, element, attrs) {
    angular.element($window).bind("scroll", function () {
      var windowHeight = $(window).height();
      if (this.pageYOffset >= 370) {
        // console.log(windowHeight);
        element.addClass('addfixed2');
      } else {
        element.removeClass('addfixed2');
      }
    });
  };
});


firstapp.directive('imageonload', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('load', function () {
        scope.$apply(attrs.imageonload);
      });
    }
  };
});
firstapp.directive('uploadImage', function ($http, $filter, $timeout, TemplateService) {
  return {
    templateUrl: 'views/directive/uploadFile.html',
    scope: {
      model: '=ngModel',
      type: "@type",
      callback: "&ngCallback",
      allowType: "@allowType"
    },
    link: function ($scope, element, attrs) {
      if (!$scope.allowType) {
        $scope.allowType = "image/*,application/pdf";
      }
      $scope.showImage = function () {
        console.log($scope.image);
      };
      $scope.check = true;
      if (!$scope.type) {
        $scope.type = "image";
      }
      $scope.isMultiple = false;
      $scope.inObject = false;
      if (attrs.multiple || attrs.multiple === "") {
        $scope.isMultiple = true;
        $("#inputImage").attr("multiple", "ADD");
      }
      if (attrs.noView || attrs.noView === "") {
        $scope.noShow = true;
      }
      // if (attrs.required) {
      //     $scope.required = true;
      // } else {
      //     $scope.required = false;
      // }
      $scope.$watch("image", function (newVal, oldVal) {
        isArr = _.isArray(newVal);
        if (!isArr && newVal && newVal.file) {
          $scope.uploadNow(newVal);
        } else if (isArr && newVal.length > 0 && newVal[0].file) {
          $timeout(function () {
            console.log(oldVal, newVal);
            console.log(newVal.length);
            _.each(newVal, function (newV, key) {
              if (newV && newV.file) {
                TemplateService.uploadLoader = true;
                TemplateService.type = $scope.dataValue;
                $scope.uploadNow(newV);
              }
            });
          }, 100);
        }
      });

      if ($scope.model) {
        if (_.isArray($scope.model)) {
          $scope.image = [];
          _.each($scope.model, function (n) {
            $scope.image.push({
              url: n
            });
          });
        } else {
          if (_.endsWith($scope.model, ".pdf")) {
            $scope.type = "pdf";
          }
        }
      }
      if (attrs.inobj || attrs.inobj === "") {
        $scope.inObject = true;
      }
      $scope.clearOld = function () {
        $scope.model = [];
      };
      $scope.uploadNow = function (image) {
        $scope.uploadStatus = "uploading";

        var Template = this;
        image.hide = true;
        var formData = new FormData();
        formData.append('file', image.file, image.name);
        $http.post(uploadurl, formData, {
          headers: {
            'Content-Type': undefined
          },
          transformRequest: angular.identity
        }).success(function (data) {
          TemplateService.uploadLoader = true;
          $scope.uploadStatus = "uploaded";
          if ($scope.isMultiple) {

            if ($scope.inObject) {
              $scope.model.push({
                "image": data.data[0]
              });
            } else {
              if (!$scope.model) {
                $scope.clearOld();
              }
              $scope.model.push(data.data[0]);
            }
          } else {
            if (_.endsWith(data.data, ".pdf")) {
              $scope.type = "pdf";
            } else {
              $scope.type = "img";
            }
            $scope.model = data.data[0];

          }
          $scope.callback({
            'data': data.data[0]
          });
          // $timeout(function () {
          //    $scope.callback({'data':$scope.model});
          // }, 100);

        }).error(function (data) {
          console.log(data);
        });
      };
    }
  };
});
firstapp.directive('uploadImageCount', function ($http, $filter, $timeout, TemplateService) {
  return {
    templateUrl: 'views/directive/uploadFile.html',
    scope: {
      model: '=ngModel',
      type: "@type",
      callback: "&ngCallback"
    },
    link: function ($scope, element, attrs) {
      $scope.showImage = function () {
        console.log($scope.image);
      };
      $scope.check = true;
      $scope.length = 0;
      $scope.imageDate = "";

      if (!$scope.type) {
        $scope.type = "image";
      }
      $scope.isMultiple = false;
      $scope.inObject = false;
      if (attrs.multiple || attrs.multiple === "") {
        $scope.isMultiple = true;
        $("#inputImage").attr("multiple", "ADD");
      }
      if (attrs.noView || attrs.noView === "") {
        $scope.noShow = true;
      }
      // if (attrs.required) {
      //     $scope.required = true;
      // } else {
      //     $scope.required = false;
      // }

      $scope.$watch("image", function (newVal, oldVal) {
        console.log(newVal);
        console.log(oldVal);
        isArr = _.isArray(newVal);
        if (!isArr && newVal && newVal.file) {
          $scope.uploadNow(newVal);
        } else if (isArr && newVal.length > 0 && newVal[0].file) {
          $timeout(function () {
            console.log(oldVal, newVal);
            console.log(newVal.length);
            $scope.imageDate = newVal[0].file.lastModifiedDate;
            $scope.length = newVal.length;
            _.each(newVal, function (newV, key) {
              if (newV && newV.file) {
                TemplateService.uploadLoader = true;
                $scope.uploadNow(newV);
              }
            });
          }, 100);
        }
      });
      if ($scope.model) {
        if (_.isArray($scope.model)) {
          $scope.image = [];
          _.each($scope.model, function (n) {
            $scope.image.push({
              url: n
            });
          });
        } else {
          if (_.endsWith($scope.model, ".pdf")) {
            $scope.type = "pdf";
          }
        }

      }
      if (attrs.inobj || attrs.inobj === "") {
        $scope.inObject = true;
      }
      $scope.clearOld = function () {
        $scope.model = [];
      };
      $scope.uploadNow = function (image) {
        $scope.uploadStatus = "uploading";
        TemplateService.uploading = false;

        var Template = this;
        image.hide = true;
        var formData = new FormData();
        formData.append('file', image.file, image.name);
        $http.post(uploadurl, formData, {
          headers: {
            'Content-Type': undefined
          },
          transformRequest: angular.identity
        }).success(function (data) {
          TemplateService.uploadLoader = false;
          $scope.uploadStatus = "uploaded";
          if ($scope.isMultiple) {
            if ($scope.inObject) {
              $scope.model.push({
                "image": data.data[0]
              });
            } else {
              if (!$scope.model) {
                $scope.clearOld();
              }
              $scope.model.push(data.data[0]);
            }
          } else {
            if (_.endsWith(data.data, ".pdf")) {
              $scope.type = "pdf";
            } else {
              $scope.type = "img";
            }
            $scope.model = data.data[0];

          }
          $scope.callback({
            'data': data.data[0],
            'length': $scope.length
          });
          // $timeout(function () {
          //    $scope.callback({'data':$scope.model});
          // }, 100);
        }).error(function (data) {
          console.log(data);
        });
      };
    }
  };
});

firstapp.filter('uploadpath', function () {
  return function (input, width, height, style) {
    var other = "";
    if (width && width !== "") {
      other += "&width=" + width;
    }
    if (height && height !== "") {
      other += "&height=" + height;
    }
    if (style && style !== "") {
      other += "&style=" + style;
    }
    if (input) {
      if (input.indexOf('https://') == -1) {
        return imgpath + "?file=" + input + other;
      } else {
        return input;
      }
    }
  };
});

firstapp.filter('stringForm', function () {
  return function (input) {
    if (input && input.length > 0) {
      var arr = "";
      _.each(input, function (each) {
        arr = arr + ", " + each;
      });
      arr = arr.substring(1);
      return arr;
    }
  };
});

firstapp.directive('onlyDigits', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attr, ctrl) {
      var digits;

      function inputValue(val) {
        if (val) {
          if (attr.type == "text") {
            digits = varal.replace(/[^0-9]/g, '');
          } else {
            digits = val.replace(/[^0-9]/g, '');
          }


          if (digits !== val) {
            ctrl.$setViewValue(digits);
            ctrl.$render();
          }
          return parseInt(digits, 10);
        }
        return undefined;
      }
      ctrl.$parsers.push(inputValue);
    }
  };
});

firstapp.directive('checkText', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attr, ctrl) {

      function inputValue(val) {
        if (val) {
          val = val.replace(/[^a-z0-9-\d\s]+/ig, "");
          return val;
        }
        return undefined;
      }
      ctrl.$parsers.push(inputValue);
    }
  };
});

firstapp.filter('downloadLink', function () {
  return function (filename, type, id, postname) {
    if (id) {
      var accessToken = $.jStorage.get("accessToken");
      if (accessToken === null) {
        accessToken = "";
      }
      return adminURL + "/download/" + filename + "/" + type + "/" + id + "/" + accessToken + "/" + postname + ".pdf";
    }
  };
});

firstapp.filter('capitalize', function () {
  return function (input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
});

firstapp.filter('kindOfJourney', function () {
  return function (input, color) {
    if (input) {
      var input = input.toLowerCase();
    }
    var returnVal = "";
    switch (input) {
      case "friends":
        returnVal = "img/kindofjourney/" + color + "-friends.png";
        break;
      case "backpacking":
        returnVal = "img/kindofjourney/" + color + "-backpacking.png";
        break;
      case "business":
        returnVal = "img/kindofjourney/" + color + "-business.png";
        break;
      case "religious":
        returnVal = "img/kindofjourney/" + color + "-religious.png";
        break;
      case "romance":
        returnVal = "img/kindofjourney/" + color + "-romance.png";
        break;
      case "budget":
        returnVal = "img/kindofjourney/" + color + "-budget.png";
        break;
      case "luxury":
        returnVal = "img/kindofjourney/" + color + "-luxury.png";
        break;
      case "family":
        returnVal = "img/kindofjourney/" + color + "-family.png";
        break;
      case "solo":
        returnVal = "img/kindofjourney/" + color + "-solo.png";
        break;
      case "betterhalf":
        returnVal = "img/kindofjourney/" + color + "-betterhalf.png";
        break;
      case "colleague":
        returnVal = "img/kindofjourney/" + color + "-colleague.png";
        break;
      case "festival":
        returnVal = "img/kindofjourney/" + color + "-festival.png";
        break;
      case "adventure":
        returnVal = "img/kindofjourney/" + color + "-adventure.png";
        break;
    }
    return returnVal;
  };
});

firstapp.filter('kindOfCheckIn', function () {
  return function (input) {
    var returnVal = "";
    switch (input) {
      case "Cinema & Theatre":
        returnVal = "img/icons/smallcinema.png";
        break;
      case "Restaurants & Bars":
        returnVal = "img/icons/small-resto.png";
        break;
      case "Shopping":
        returnVal = "img/icons/smallshopping.png";
        break;
      case "Transportation":
        returnVal = "img/icons/smallairport.png";
        break;
      case "Nature and Parks":
        returnVal = "img/icons/smallnature.png";
        break;
      case "Sights and Landmarks":
        returnVal = "img/icons/smallsight.png";
        break;
      case "Museums and Galleries":
        returnVal = "img/icons/smallmuseums.png";
        break;
      case "Zoo and Aquariums":
        returnVal = "img/icons/smallzoos.png";
        break;
      case "Religious":
        returnVal = "img/icons/smallreligious.png";
        break;
      case "Hotels & Accomodations":
        returnVal = "img/icons/smallhotels.png";
        break;
      case "Others":
        returnVal = "img/icons/smallothers.png";
        break;
      case "Other":
        returnVal = "img/smallothers.png";
        break;
      case "City":
        returnVal = "img/icons/cityfull.png";
        break;
      default:
        returnVal = "img/icons/smallothers.png";
    }
    console.log(input, returnVal);
    return returnVal;
  };
});

firstapp.filter('kindOfReviewCheckIn', function () {
  return function (input) {
    var returnVal = "";
    switch (input) {
      case "Cinema & Theatre":
        returnVal = "img/kindOfReviewCheckIn/grey-cinema.png";
        break;
      case "Restaurants & Bars":
        returnVal = "img/kindOfReviewCheckIn/grey-restaraunt.png";
        break;
      case "Shopping":
        returnVal = "img/kindOfReviewCheckIn/grey-shopping.png";
        break;
      case "Transportation":
        returnVal = "img/kindOfReviewCheckIn/grey-airport.png";
        break;
      case "Nature and Parks":
        returnVal = "img/kindOfReviewCheckIn/grey-nature.png";
        break;
      case "Sights and Landmarks":
        returnVal = "img/kindOfReviewCheckIn/grey-sights.png";
        break;
      case "Museums and Galleries":
        returnVal = "img/kindOfReviewCheckIn/grey-museums.png";
        break;
      case "Zoo and Aquariums":
        returnVal = "img/kindOfReviewCheckIn/grey-zoo.png";
        break;
      case "Religious":
        returnVal = "img/kindOfReviewCheckIn/grey-religious.png";
        break;
      case "Hotels & Accomodations":
        returnVal = "img/kindOfReviewCheckIn/grey-hotels.png";
        break;
      case "Others":
        returnVal = "img/kindOfReviewCheckIn/grey-others.png";
        break;
      case "Other":
        returnVal = "img/kindOfReviewCheckIn/grey-others.png";
        break;
      case "City":
        returnVal = "img/kindOfReviewCheckIn/grey-city.png";
        break;
      default:
        returnVal = "img/kindOfReviewCheckIn/grey-others.png";
    }
    console.log(input, returnVal);
    return returnVal;
  };
});

firstapp.filter('typeOfPost', function () {
  return function (post, type) {
    var returnVal = "";
    var color;
    if (type == 'travel-life') {
      color = 'otg-';
    } else if (type == 'local-life') {
      color = "local-";
    }
    // else if (type == 'local-post') {
    //   color = "red_";
    // } else if (type == 'otg-post') {
    //   color = 'cyan_';
    // }
    if (post && post.checkIn && post.checkIn.location) {
      return "img/typeOfPost/" + color + "location.png";
    } else if (post && post.photos && post.photos.length != 0) {
      return "img/typeOfPost/" + color + "camera.png";
    } else if (post && post.videos && post.videos.length != 0) {
      return "img/typeOfPost/" + color + "video.png";
    } else if (post && post.thoughts) {
      return "img/typeOfPost/" + color + "thought.png";
    }
  }
});

firstapp.filter('truncate', function () {
  return function (value, limit) {
    if (value) {
      if (value.length < limit) {
        return value;
      } else {
        return value.slice(0, limit) + "...";
      }
    }
  }
});

firstapp.filter('itineraryType', function () {
  return function (input) {
    if (input) {
      var input = input.toLowerCase();
    }
    var returnVal = "";

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // var itineraryBg = input.length;
    // console.log(input, itineraryBg);
    // var itineraryGet = getRandomInt(0, itineraryBg - 1);
    // var backImg = input[itineraryGet];
    // console.log(backImg);
    var random = getRandomInt(1, 2);
    switch (input) {
      case "adventure":
        returnVal = "img/banner-itinerary/adventure" + random + ".jpg";
        break;
      case "business":
        returnVal = "img/banner-itinerary/business" + random + ".jpg";
        break;
      case "family":
        returnVal = "img/banner-itinerary/family" + random + ".jpg";
        break;
      case "romance":
        returnVal = "img/banner-itinerary/romance" + random + ".jpg";
        break;
      case "backpacking":
        returnVal = "img/banner-itinerary/backpacking" + random + ".jpg";
        break;
      case "religious":
        returnVal = "img/banner-itinerary/religious" + random + ".jpg";
        break;
      case "budget":
        returnVal = "img/banner-itinerary/budget" + random + ".jpg";
        break;
      case "luxury":
        returnVal = "img/banner-itinerary/luxury" + random + ".jpg";
        break;
      case "solo":
        returnVal = "img/banner-itinerary/sole" + random + ".jpg";
        break;
      case "festival":
        returnVal = "img/banner-itinerary/all" + random + ".jpg";
        break;
      case "shopping":
        returnVal = "img/banner-itinerary/all" + random + ".jpg";
        break;
      case "friends":
        returnVal = "img/banner-itinerary/friends" + random + ".jpg";
        break;
      default:
        returnVal = "img/banner-itinerary/all1.jpg";
        break;
    }
    console.log(returnVal, 'return wla kya hai');
    return returnVal;
  };
});

firstapp.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    scope: {
      fileModel: '=fileModel',
    },
    link: function (scope, element, attrs) {
      element.bind('change', function () {
        scope.fileModel = element[0].files;
        scope.$apply();
      });
    }
  };
}]);

firstapp.directive('functionmap', ['$parse', function ($parse) {
  return {
    restrict: 'C',
    link: function (scope, element, attrs) {
      setTimeout(function () {
        var check = $(".hasLatLng").length;
        var flag;
        //perform tasks on window scroll starts
        $(window).scroll(function () {
          var currentScroll = $(window).scrollTop() + $(window).height();
          var divPositions = _.map($(".hasLatLng"), function (n) {
            return $(n).offset().top;
          });
          //getting divHeights for scrolling based on percentage of div's height displayed on screen starts
          var divHeights = _.map($(".hasLatLng"), function (n) {
            return $(n).height();
          });
          //getting divHeights for scrolling based on percentage of div displayed on screen ends

          var ith = 1;
          var percentage = 0;
          //manipulating map based on divPositions starts
          // console.log(divPositions);
          _.each(divPositions, function (n, index) {
            if (n <= currentScroll && divPositions[index + 1] > currentScroll) { //would work for  1st checkIn till second last checkin coz divPositions[index + 1] would return false
              ith = index;
              if (n > 0) {
                percentage = ((currentScroll - n) / divHeights[index]) * 100; //percentage based on size of div
                if (ith > 0) {
                  if (percentage <= 100) {
                    flag = true; //flag is only sent when percent >100
                    pointsForLine(ith, percentage, true);
                  } else {
                    //else is given coz polyline should not exceed beyond 100%
                    pointsForLine(ith, 100, true, flag);
                    flag = false;
                  }
                } else if (!_.isEmpty(line[1])) {
                  line[1].setMap(null);
                  line[1] = {};
                }
              }
              return false;
            } else if ((n <= currentScroll) && (index == (divPositions.length - 1))) { //for last checkIn
              ith = index;
              percentage = ((currentScroll - n) / divHeights[index]) * 100; //percentage based on size of div
              if (percentage <= 100) {
                flag = true;
                pointsForLine(ith, percentage, true, true);
              } else {
                //else is given coz polyline should not exceed beyond 100%
                pointsForLine(ith, 100, true);
                flag = false;
              }
            } else if (n > currentScroll) { //clearing 1st polyLine if none of the checkin is diplayed on the initial window page
              if (!_.isEmpty(line[1])) {
                line[1].setMap(null);
                line[1] = {};
              }
            }
          });
          //manipulating map based on divPositions ends
        });
        //perform tasks on window scroll ends
      }, 1);
    }
  };
}]);

firstapp.filter('postString', function () {
  return function (checkIn, tripSummary) {
    var location = {};
    if (tripSummary) {
      location = checkIn;
    } else {
      location = checkIn.checkIn;
    }
    // var location = checkIn.checkIn;
    var postString = "";
    var buddiesString = "";
    var buddiesCount = checkIn.buddies.length;
    if (buddiesCount == 1) {
      buddiesString = "<a href='/users/" + checkIn.buddies[0].urlSlug + "'>" + checkIn.buddies[0].name.bold() + "</a>";
    } else if (buddiesCount == 2) {
      buddiesString = "<a href='/users/" + checkIn.buddies[0].urlSlug + "'>" + checkIn.buddies[0].name.bold() + "</a>" + " and " + "<a href='/users/" + checkIn.buddies[1].urlSlug + "'>" + checkIn.buddies[1].name.bold() + "</a>";
    } else if (buddiesCount >= 2) {
      buddiesString = "<a href='/users/" + checkIn.buddies[0].urlSlug + "'>" + checkIn.buddies[0].name.bold() + "</a>" + " and " + (buddiesCount - 1) + " others ";
    }
    var postString = "";
    if (buddiesString != "") {
      if (checkIn.thoughts && location.location) {
        postString = checkIn.thoughts + " with " + buddiesString + " at " + location.location.bold();
      } else if (checkIn.thoughts) {
        postString = checkIn.thoughts + " with " + buddiesString;
      } else if (checkIn && location.location) {
        postString = "<a href='/users/" + checkIn.postCreator.urlSlug + "'>" + checkIn.postCreator.name.bold() + "</a>" + " with " + buddiesString + " at " + location.location.bold();
      } else {
        postString = "<a href='/users/" + checkIn.postCreator.urlSlug + "'>" + checkIn.postCreator.name.bold() + "</a>" + " with " + buddiesString;
      }
    } else {
      if (checkIn.thoughts && location.location) {
        postString = checkIn.thoughts + " at " + location.location.bold();
      } else if (checkIn.thoughts) {
        postString = checkIn.thoughts;
      } else if (checkIn && location.location) {
        postString = "<a href='/users/" + checkIn.postCreator.urlSlug + "'>" + checkIn.postCreator.name.bold() + "</a>" + " at " + location.location.bold();
      } else {
        postString = "";
      }
    }
    return postString;
  }
});

firstapp.filter('filterDate', function () {
  return function (duration) {
    return "inside";
  };
});

firstapp.filter('fromCalculation', function () {
  return function (country, countryIndex, cityIndex) {
    var sum = 0;
    if (countryIndex == 0) { //when only 1 country is selected
      if (cityIndex == 0) {
        return 1;
      } else {
        cityIndex = cityIndex - 1;
        while (cityIndex >= 0) {
          sum = sum + country[countryIndex].cityVisited[cityIndex].duration;
          cityIndex--;
        };
        return sum;
      }
    } else { //when more than 1 countries selected
      if (cityIndex >= 0) {
        cityIndex = cityIndex - 1;
        while (countryIndex >= 0) {
          while (cityIndex >= 0) {
            sum = sum + country[countryIndex].cityVisited[cityIndex].duration;
            cityIndex--;
          };
          countryIndex--;
          if (countryIndex == -1) {
            break;
          }
          cityIndex = country[countryIndex].cityVisited.length - 1;
        }
      }
      return sum;
    }
  };
});
// firstapp.filter('trusted',function () {
//   return function (url) {
//     console.log(url,'url');
//     url = url.split("storage.googleapis.com").join("travelibro.com");
//     console.log(url,'libro');
//     return url;
//   };
// });

// for trusted url
firstapp.filter('trusted', ['$sce', function ($sce) {
  return function (url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);
// for trusted url end

firstapp.filter('toCalculation', function () {
  return function (country, countryIndex, cityIndex) {
    var sum = 0;
    if (countryIndex == 0) {
      if (cityIndex >= 0) {
        while (cityIndex >= 0) {
          sum = sum + country[countryIndex].cityVisited[cityIndex].duration;
          cityIndex--;
        };
      }
      return sum;
    } else {
      if (cityIndex >= 0) {
        while (countryIndex >= 0) {
          while (cityIndex >= 0) {
            sum = sum + country[countryIndex].cityVisited[cityIndex].duration;
            cityIndex--;
          };
          countryIndex--;
          if (countryIndex == -1) {
            break;
          }
          cityIndex = country[countryIndex].cityVisited.length - 1;
        }
      }
      return sum;
    }
  };
});

// firstapp.directive('fileDropzone', function () {
//   return {
//     restrict: 'A',
//     scope: {
//       file: '=',
//       fileName: '='
//     },
//     link: function (scope, element, attrs) {
//       var checkSize,
//         isTypeValid,
//         processDragOverOrEnter,
//         validMimeTypes;

//       // processDragOverOrEnter = function (event) {
//       //   if (event != null) {
//       //     event.preventDefault();
//       //   }
//       //   event.dataTransfer.effectAllowed = 'copy';
//       //   return false;
//       // };

//       processDragOverOrEnter = function (event) {
//         if (event != null) {
//           event.preventDefault();
//         }
//         (event.originalEvent || event).dataTransfer.effectAllowed = 'copy';
//         return false;
//       };


//       validMimeTypes = attrs.fileDropzone;

//       checkSize = function (size) {
//         var _ref;
//         if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
//           return true;
//         } else {
//           alert("File must be smaller than " + attrs.maxFileSize + " MB");
//           return false;
//         }
//       };

//       isTypeValid = function (type) {
//         if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
//           return true;
//         } else {
//           alert("Invalid file type.  File must be one of following types " + validMimeTypes);
//           return false;
//         }
//       };

//       element.bind('dragover', processDragOverOrEnter);
//       element.bind('dragenter', processDragOverOrEnter);

//       return element.bind('drop', function (event) {
//         console.log(event);
//         var file, name, reader, size, type;
//         if (event != null) {
//           event.preventDefault();
//         }
//         reader = new FileReader();
//         reader.onload = function (evt) {
//           if (checkSize(size) && isTypeValid(type)) {
//             return scope.$apply(function () {
//               scope.file = evt.target.result;
//               if (angular.isString(scope.fileName)) {
//                 return scope.fileName = name;
//               }
//             });
//           }
//           console.log(evt.target.files);
//         };
//         file = event.originalEvent.dataTransfer.files[0];
//         name = file.name;
//         type = file.type;
//         size = file.size;
//         reader.readAsDataURL(file);
//         return false;
//       });
//     }
//   };
// })

// date difference
firstapp.filter('dateDifference', function () {
  return function (current, previous) {
    if (current == "current" || current == "" || current == null || current == undefined) {
      current = Date();
    }

    var a = moment(current).format('DD/MM/YYYY'); //will remove time from date
    var b = moment(previous).format('DD/MM/YYYY'); //will remove time from date

    current = moment(a, 'DD/MM/YYYY'); //will convert date to a "moment format" for applying moments "diff" function
    previous = moment(b, 'DD/MM/YYYY'); //will convert date to a "moment format" for applying moments "diff" function

    var days = current.diff(previous, 'days') + 1;
    // var returnVal = moment(current).diff(moment(previous), 'days')+1;
    // alert(days);
    return days;
  };
});
// date difference end

firstapp.directive("fileread", [function () {
  return {
    scope: {
      fileread: "="
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.fileread = loadEvent.target.result;
            // console.log(scope.fileread);
          });
        }
        console.log(changeEvent.target.files);
        reader.readAsDataURL(changeEvent.target.files[0]);
      });
    }
  }
}]);

firstapp.directive('hideOnScroll', function ($document) {
  return {
    restrict: 'EA',
    replace: false,
    link: function (scope, element, attr) {
      var $element = $(element);
      var lastScrollTop = 0;
      $(window).scroll(function (event) {
        var st = $(this).scrollTop();
        if (st > lastScrollTop) {
          $(element).addClass('nav-up');
        } else {
          $(element).removeClass('nav-up');
        }
        lastScrollTop = st;
      });
    }
  };
});

// firstapp.directive('fullPage', function ($document) {
//   return {
//     restrict: 'EA',
//     replace: false,
//     link: function (scope, element, attr) {
//       var $element = $(element);
//        $element.fullpage();
//     }
//   };
// });

firstapp.directive('uiSrefIf', function ($compile) {
  return {
    scope: {
      val: '@uiSrefVal',
      if: '=uiSrefIf'
    },
    link: function ($scope, $element, $attrs) {
      $element.removeAttr('ui-sref-if');
      // $compile($element)($scope);

      $scope.$watch('if', function (bool) {
        console.log(bool);
        if (bool) {
          $element.attr('ui-sref', $scope.val);
        } else {
          $element.removeAttr('ui-sref');
          $element.removeAttr('href');
        }
        $compile($element)($scope);
      });
    }
  };
});

firstapp.directive('videoend', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      $elem = $(elem);
      var aud = $elem.get(0);
      aud.onended = function () {
        $(".videoplays").addClass('playbutton');
      };
      aud.onplay = function () {
        $(".videoplays").removeClass('playbutton');
      };
    }
  };
}]);

firstapp.filter('trafficType', function () {
  return function (input) {
    input = input.trim();
    console.log(input, 'trafficType');
    var returnVal = "";
    switch (input) {
      case "Off Season":
        returnVal = "img/destination/off-season.png";
        break;
      case "Shoulder Season":
        returnVal = "img/destination/shoulder-season.png";
        break;
      case "Peak Season":
        returnVal = "img/destination/peak-season.png";
        break;
      default:
    };
    return returnVal;
  }
});
// get attribute in html
firstapp.filter('safe', function ($sce) {
  return function (input) {
    // console.log(input,'input');
    return $sce.trustAsHtml(input);
  }
})
// get attribute in html end
firstapp.filter('seasonType', function () {
  return function (input) {
    input = input.trim();
    console.log(input, 'seasonType');
    var returnVal = "";
    switch (input) {
      case "Spring":
        returnVal = "img/destination/spring.png";
        break;
      case "Summer":
        returnVal = "img/destination/summer.png";
        break;
      case "Winter":
        returnVal = "img/destination/winter.png";
        break;
      case "Autumn":
        returnVal = "img/destination/autumn.png";
        break;
      case "Monsoon":
        returnVal = "img/destination/monsoon.png";
        break;
      case "Wet Season":
        returnVal = "img/destination/wet-season.png";
        break;
      default:
    };
    return returnVal;
  }
});
// $(document).ready(function () {
//   $(".element").typed({
//     strings: ["Capture | Inspire | Relive...", "Travel Life | Local Life...", "Loading...", "Almost There..."],
//     startDelay: 20,
//     typeSpeed: 100,
//     loop: true
//   });
// });
