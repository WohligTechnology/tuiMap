var itinerary = angular.module('itinerary', [])

  .factory('Itinerary', function (TravelibroService, $filter, $state) {

    return {
      getOneItinerary: function (slug, callback) { //get Quick/detail itinerary
        TravelibroService.http({
          url: adminURL + "/itinerary/getOneWeb",
          method: "POST",
          data: {
            "urlSlug": slug
          }
        }, 'allLoader').success(function (data) {
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      getViewItinerary: function (slug, callback) { //get Quick/detail itinerary
        TravelibroService.http({
          url: adminURL + "/itinerary/getViewChangedItitnerary",
          method: "POST",
          data: {
            "urlSlug": slug
          }
        }, 'allLoader').success(function (data) {
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      postItineraryComment: function (_id, uniqueId, text, callback) {
        var obj = {
          "itinerary": _id,
          "uniqueId": uniqueId,
          "text": text,
          "type": "itinerary",
          "hashtag": []
        };
        TravelibroService.http({
          url: adminURL + "/comment/addCommentWeb",
          method: "POST",
          data: obj
        }).success(function (data) {
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      updateLikeItinerary: function (flag, _id, uniqueId, callback) {
        if (!($.jStorage.get("isLoggedIn"))) {
          $state.go('login');
        }
        var callback;
        var result;
        var obj = {
          "itinerary": _id,
          "uniqueId": uniqueId
        }
        if (flag) {
          obj.unlike = true;
          result = null;
        } else {
          result = true;
        }
        console.log(obj);
        TravelibroService.http({
          url: adminURL + "/itinerary/updateLikeItineraryWeb",
          method: "POST",
          data: obj
        }).success(function (data) {
          if (data.value) {
            callback(result);
          }
        }).error(function (data) {
          console.log(data);
        });
      },
      getGooglePlaceDetail: function (obj, callback) {
        TravelibroService.http({
          url: adminURL + "/itinerary/getGooglePlaceDetail",
          method: "POST",
          data: obj
        }).success(function (data) {
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      searchFollowers: function (searchText, callback) {
        TravelibroService.http({
          url: adminURL + "/user/searchBuddyWeb",
          method: "POST",
          data: {
            "search": searchText
          }
        }).success(function (data) {
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      uploadQuickItinerary: function (obj, flag, callback) {
        if (flag == 'new') {
          var url = "/itinerary/saveQuickItineraryWeb";
          // var url = "/itinerary/getViewChangedItinerary";
          
        } else if (flag == 'edit') {
          var url = "/itinerary/editQuickItineraryWeb"
        }
        TravelibroService.http({
          url: adminURL + url,
          method: "POST",
          data: obj
        }).success(function (data) {
          if (data.value) {
            console.log("Qitinerary saved successfully");
          }
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      uploadDetailedItinerary: function (obj, flag, callback) {
        console.log(obj, flag);
        if (flag == 'new') {
          var url = "/itinerary/save";
        } else if (flag == 'edit') {
          var url = "/itinerary/editData"
        }
        TravelibroService.http({
          url: adminURL + url,
          method: "POST",
          data: obj
        }).success(function (data) {
          if (data.value) {
            console.log("Qitinerary saved successfully");
          }
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      publishQuickItinerary: function (_id, oldStatus, status, callback) {
        var obj = {
          "_id": _id,
          "oldStatus": oldStatus,
          "status": status
        };
        TravelibroService.http({
          url: adminURL + "/itinerary/changeItineraryStatusWeb",
          data: obj,
          method: "POST"
        }).success(callback)
      }

    };
  });

itinerary.filter('whoIsThis', function () {
  return function (name, commentedUserId, profileId) {
    console.log(name, commentedUserId, profileId);
    if (commentedUserId == profileId) {
      return "You";
    } else {
      return name;
    }
  };
});
