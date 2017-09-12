var bl = [];
var mylife = angular.module('mylife', [])

  .factory('MyLife', function (TravelibroService) {
    return {
      getAllCountries: function (callback, errCallback) {
        TravelibroService.http({
          url: adminURL + "/country/getAll",
          method: "POST"
        }).success(function (data) {
          TravelibroService.post(adminURL + "/user/getBucketListWeb", {
            "urlSlug": $.jStorage.get("activeUrlSlug")
          }).success(function (data2) {
            TravelibroService.post(adminURL + "/user/getCountryVisitedListWeb", {
              "urlSlug": $.jStorage.get("activeUrlSlug")
            }).success(function (data3) {
              var countries = data.data;
              var bucketList = data2.data.bucketList;
              var countryVisited = data3.data.countriesVisited;
              _.each(bucketList, function (n) {
                var index = _.findIndex(countries, function (country) {
                  return country._id == n._id;
                });
                countries[index].bucketList = true;
              });
              _.each(countryVisited, function (n) {
                var index = _.findIndex(countries, function (country) {
                  return country._id == n.countryId._id;
                });
                countries[index].countryVisited = true;
              });
              callback(countries);
            }).error(errCallback);
          }).error(errCallback);
        }).error(errCallback);
      },
      updateBucketList: function (country, callback, errCallback) {
        console.log(country);
        var obj = {
          bucketList: country._id
        };
        if (country.bucketList === false) {
          obj.delete = true;
        }
        TravelibroService.post(adminURL + "/user/updateBucketListWeb", obj, true).success(callback).error(errCallback);
      },
      updateCountriesVisited: function (obj, callback, errCallback) {
        TravelibroService.post(adminURL + "/user/updateCountriesVisitedWeb", obj, true).success(callback).error(errCallback);
      },
      removeCountryList: function (obj, callback, errCallback) {
        TravelibroService.post(adminURL + "/user/removeCountriesVisitedWeb", obj).success(callback).error(errCallback);
      },
      getCountryVisitedListWeb: function (callback) {
        TravelibroService.http({
          url: adminURL + "/user/getCountryVisitedListWeb",
          method: "POST"
        }).success(function (data) {
          // callback(data.data.countriesVisited);
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      getCountryVisitedListExpanded: function (urlSlug, callback) {
        TravelibroService.http({
          url: adminURL + "/user/getCountryVisitedListExpanded",
          method: "POST",
          data: {
            "urlSlug": urlSlug
          }
        }).success(function (data) {
          if(data.value==true){
            callback(data.data);
          }
        }).error(function (data) {
          console.log(data);
        });
      },
      getOneBucketList: function (urlSlug, callback) {
        TravelibroService.http({
          url: adminURL + "/user/getBucketListWeb", ///////////////////use getOneBucketList
          method: "POST",
          data: {
            "urlSlug": urlSlug
          }
        }).success(function (data) {
          callback(data.data.bucketList);
        }).error(function (data) {
          console.log(data);
        });
      },
      updateBucketListWeb: function (countryId, callback) {
        var obj = {
          "bucketList": countryId,
          "delete": true
        };
        TravelibroService.http({
          url: adminURL + "/user/updateBucketListWeb",
          method: "POST",
          data: obj
        }, true).success(function () {
          callback(countryId);
        }).error(function (data) {
          console.log(data);
        });
      },
      getFollowingWeb: function (urlSlug, callback) {
        TravelibroService.http({
          url: adminURL + "/user/getFollowingWeb",
          method: "POST",
          data: {
            "urlSlug": urlSlug
          }
        },'allLoader').success(callback).error(function (data) {
          console.log(data);
        });
      },
      getFollowersWeb: function (urlSlug, callback) {
        TravelibroService.http({
          url: adminURL + "/user/getFollowersWeb",
          method: "POST",
          data: {
            "urlSlug": urlSlug
          }
        },'allLoader').success(callback).error(function (data) {
          console.log(data);
        });
      },
      followUser: function (userId, name, callback) {
        var obj = {
          "_id": userId,
          "toName": name
        }
        TravelibroService.http({
          url: adminURL + "/user/followUserWeb",
          method: "POST",
          data: obj
        }).success(function (data) {
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      unFollowUser: function (userId, callback) {
        var obj = {
          "_id": userId,
        }
        TravelibroService.http({
          url: adminURL + "/user/unFollowUserWeb",
          method: "POST",
          data: obj
        }).success(function (data) {
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      searchAllUser: function (searchUser, counter, callback) {
        var obj = {
          search: searchUser
        };
        TravelibroService.http({
          url: adminURL + "/user/getFollowingWeb",
          method: "POST",
          data: obj
        },'searchLoad').success(function (data) {
          data.data.counter = counter;
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      getAllJourney: function (callback, pageNo, errorCallback) {
        TravelibroService.http({
          url: adminURL + "/journey/myLifeJourneyWeb",
          method: "POST",
          data: {
            "type": "travel-life",
            "urlSlug": $.jStorage.get("activeUrlSlug"),
            "pagenumber": pageNo
          }
        },'paginationLoad').success(function (data) {
          var hasJourney = "";
          if (_.isEmpty(data.data)) {
            hasJourney = false;
          } else {
            hasJourney = true;
            var journeys = data.data;
            _.each(journeys, function (n, index) {
              journeys[index].start_Time = {};
              if (n.onGoing === true || n.onGoing === false) {
                journeys[index].onJourney = false;
              }
              switch (journeys.type) {
                case "travel-life":
                  activity.likeUnlikeFlag = "post";
                  break;
                case "on-the-go-journey":
                case "ended-journey":
                  activity.likeUnlikeFlag = "journey";
                  break;
                case "quick-itinerary":
                case "detail-itinerary":
                  activity.likeUnlikeFlag = "itinerary";
                  break;
              }
            });
            callback(journeys);
          }
        }).error(function (data) {
          console.log(data);
        });
      },
      getAllMoments: function (token, limit, type, times, successCallback, errorCallback) { //for all and locallife
        var obj = {
          "token": token,
          "limit": limit,
          "type": type,
          "times": times,
          "urlSlug": $.jStorage.get("activeUrlSlug")
        };
        TravelibroService.http({
          url: adminURL + "/journey/myLifeMomentWeb",
          data: obj,
          method: "POST"
        },'paginationLoad').success(successCallback).error(errorCallback);
      },
      getTravelLifeMoments: function (type, pageNo, successCallback, errorCallback) { //for travel-life
        var obj = {
          "type": type,
          "pagenumber": pageNo,
          "urlSlug": $.jStorage.get("activeUrlSlug")
        };
        TravelibroService.http({
          url: adminURL + "/journey/myLifeMomentWeb",
          data: obj,
          method: "POST"
        },'paginationLoad').success(successCallback).error(errorCallback);
      },
      getPerMonthMoments: function (token, pageNo, limit, flag, successCallback, errorCallback) {
        console.log();
        var obj = {
          "token": token,
          "pagenumber": pageNo,
          "limit": limit,
          "urlSlug": $.jStorage.get("activeUrlSlug")
        };
        if (flag == 'local') {
          obj.type = true;
        } else if (flag == 'all') {

        }
        console.log(obj);
        TravelibroService.http({
          url: adminURL + "/journey/getTokenMomentWeb",
          data: obj,
          method: "POST"
        },'paginationLoad').success(successCallback).error(errorCallback);
      },
      getJournItiMoments: function (_id, pagenumber, limit, flag, successCallback, errorCallback) {
        var url = "";
        var obj = {
          "_id": _id,
          "pagenumber": pagenumber,
          "limit": limit,
          "urlSlug": $.jStorage.get("activeUrlSlug")
        };
        if (flag == 'itinerary') {
          url = "/itinerary/getMedia";
        } else if (flag == 'journey') {
          url = "/journey/getMediaWeb";
        }
        TravelibroService.http({
          url: adminURL + url,
          data: obj,
          method: "POST"
        },'paginationLoad').success(successCallback).error(errorCallback);
      },
      getAllReviews: function (type, pageNo, successCallback, errorCallback) {
        var obj = {
          "type": type,
          "pagenumber": pageNo,
          "urlSlug": $.jStorage.get("activeUrlSlug")
        };
        TravelibroService.http({
          url: adminURL + "/journey/myLifeReviewWeb",
          data: obj,
          method: "POST"
        },'paginationLoad').success(successCallback).error(errorCallback);
      },
      getCities: function (countryId, callback) {
        TravelibroService.http({
          url: adminURL + "/post/getReviewByLocWeb",
          data: {
            'country': countryId,
            "urlSlug": $.jStorage.get("activeUrlSlug")
          },
          method: "POST"
        },'allLoader').success(callback).error(function (data) {
          console.log(data);
        });
      },
      getReviewsByCities: function (countryId, cityId, pageNo, successCallback, errorCallback) {
        var obj = {
          "country": countryId,
          "city": cityId,
          "pagenumber": pageNo,
          "urlSlug": $.jStorage.get("activeUrlSlug")
        };
        TravelibroService.http({
          url: adminURL + "/post/getReviewsWeb",
          data: obj,
          method: "POST"
        },'paginationLoad').success(successCallback).error(errorCallback);
      },
      getCategories: function (cityId, callback) {
        TravelibroService.http({
          url: adminURL + "/post/getReviewByLocWeb",
          data: {
            'city': cityId,
            "urlSlug": $.jStorage.get("activeUrlSlug")
          },
          method: "POST"
        },'allLoader').success(callback).error(function (data) {
          console.log(data);
        });
      },
      getReviewsByCategories: function (cityId, category, pageNo, successCallback, errorCallback) {
        var obj = {
          "city": cityId,
          "category": category,
          "pagenumber": pageNo,
          "urlSlug": $.jStorage.get("activeUrlSlug")
        };
        TravelibroService.http({
          url: adminURL + "/post/getReviewsWeb",
          data: obj,
          method: "POST"
        },'paginationLoad').success(successCallback).error(errorCallback);
      },
      savePostReview: function (obj, callback) {
        TravelibroService.http({
          url: adminURL + "/review/saveWeb",
          method: "POST",
          data: obj
        }).success(callback).error(function (data) {
          console.log(data);
        }).error(function (data) {
          console.log(data);
        });
      }
    };
  });

mylife.filter('momentsDate', function () {
  return function (input) {
    if (input !== undefined) {
      console.log(input);
      var string = moment(input, "MM-YYYY").format('MMMM') + ", " + moment(input, "MM-YYYY").format('YYYY');
      return string;
    } else {
      return;
    }
  };
});
