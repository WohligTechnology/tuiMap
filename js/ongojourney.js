var ongojourney = angular.module('ongojourney', [])

  .factory('OnGoJourney', function (TravelibroService, $filter) {
    return {
      getOneJourney: function (formData, callback, errorCallback) {
        TravelibroService.http({
          url: adminURL + "/journey/getOneWeb",
          // url: "/demo.json",
          method: "POST",
          // method: "GET",
          data: formData
        }, 'allLoader').success(function (data) {
          var journey = data.data;
          journey.kindOfJourneyIconsAddr = [];
          journey.buddiesCount = journey.buddies.length;
          journey.buddiesString = "";
          if (journey.buddiesCount == 1) {
            journey.buddiesString = " and " + "<a href='/users/" + journey.buddies[0].urlSlug + "'>" + journey.buddies[0].name.bold() + "</a>";
          } else if (journey.buddiesCount == 2) {
            journey.buddiesString = ", " + "<a href='/users/" + journey.buddies[0].urlSlug + "'>" + journey.buddies[0].name.bold() + "</a>" + " and " + "<a href='/users/" + journey.buddies[1].urlSlug + "'>" + journey.buddies[1].name.bold() + "</a>" + ".";
          } else if (journey.buddiesCount >= 2) {
            var i = 0;
            journey.buddiesString = ", ";
            while (i <= journey.buddiesCount - 1) {
              if (i < journey.buddiesCount - 1) {
                journey.buddiesString = journey.buddiesString + "<a href='/users/" + journey.buddies[i].urlSlug + "'>" + journey.buddies[i].name.bold() + "</a>" + ", ";
              } else if (i == journey.buddiesCount - 1) {
                journey.buddiesString = journey.buddiesString + " and " + "<a href='/users/" + journey.buddies[i].urlSlug + "'>" + journey.buddies[i].name.bold() + "</a>" + ".";
              }
              i++;
            }
          }
          if (journey.buddiesString != undefined) {
            journey.startJourneyString = "Trip Travellers - " + "<a href='/users/" + journey.user.urlSlug + "'>" + journey.user.name.bold() + "</a>" + journey.buddiesString;
          } else {
            journey.startJourneyString = "Trip Traveller - " + "<a href='/users/" + journey.user.urlSlug + "'>" + journey.user.name.bold() + "</a>";
          }
          callback(journey);
        }).error(function (data) {
          console.log(data);
        });
      },
      editJourneyName: function (formData, callback) {
        TravelibroService.http({
          url: adminURL + "/journey/editData",
          method: "POST",
          data: formData
        }).success(function (data) {
          callback(formData.name)
        }).error(function (data) {
          console.log(data);
        });
      },
      rateThisCountry: function (formData, callback) {
        TravelibroService.http({
          url: adminURL + "/review/saveWeb",
          method: "POST",
          data: formData
        }).success(callback).error(function (data) {
          console.log(data);
        });
      },
      getTripSummary: function (formData, callback) {
        TravelibroService.http({
          url: adminURL + "/journey/getCountData",
          method: "POST",
          data: formData
        }).success(function (data) {
          callback(data.data);
        }).error(function (data) {
          console.log(data);
        });
      },
      getJourneyCoverPhoto: function (formData, callback) {
        TravelibroService.http({
          url: adminURL + "/journey/getCountDataWeb",
          method: "POST",
          data: formData
        }).success(function (data) {
          callback(data.data);
        }).error(function (data) {
          console.log(data);
        });
      },
      setJourneyCoverPhoto: function (formData, callback) {
        TravelibroService.http({
          url: adminURL + "/journey/editData",
          method: "POST",
          data: formData
        }).success(function (data) {
          console.log(data);
          callback();
        }).error(function (data) {
          console.log(data);
        });
      },
      updateBannerDateTime: function (formData, callback) {
        TravelibroService.http({
          url: adminURL + "/journey/editData/",
          method: "POST",
          data: formData
        }).success(function (data) {
          callback();
        }).error(function (data) {
          console.log(data);
        });
      },
      endDateJourney: function (formData, callback) {
        TravelibroService.http({
          url: adminURL + "/journey/editData/",
          method: "POST",
          data: formData
        }).success(function (data) {
          callback();
        }).error(function (data) {
          console.log(data);
        });
      },
      getPostsComment: function (id, callback) {
        var formData = {
          "_id": id
        };
        TravelibroService.http({
          url: adminURL + "/post/getPostCommentWeb",
          method: "POST",
          data: formData
        }).success(function (data) {
          callback(data);
        }).error(function (data) {
          console.log(data);
        });
      },
      postComment: function (uniqueId, comment, type, postId, callback) {
        var formData = {
          "uniqueId": uniqueId,
          "text": comment,
          "type": type,
          "post": postId
        };
        TravelibroService.http({
          url: adminURL + "/comment/addCommentWeb",
          method: "POST",
          data: formData
        }).success(function (data) {
          formData = {
            "_id": postId
          }
          TravelibroService.http({
            url: adminURL + "/post/getPostCommentWeb",
            method: "POST",
            data: formData
          }).success(function (data) {
            callback(data);
          }).error(function (data) {
            console.log(data);
          });
        }).error(function (data) {
          console.log(data);
        });

      }
    };
  });

ongojourney.directive('journeyPost', ['$http', '$filter', '$window', '$state', '$timeout', '$uibModal', 'OnGoJourney', 'LikesAndComments', 'TravelibroService', '$sce', function ($http, $filter, $window, $state, $timeout, $uibModal, OnGoJourney, LikesAndComments, TravelibroService, $sce) {
  return {
    restrict: 'E',
    scope: {
      ongo: "=post",
      json: "=json",
      isMine: "=",
      isLoggedIn: "=",
      getCommentsData: '&',
      getLikesData: '&',
      closeBackDrop: '&',
      template: "="
    },
    // controller: 'OnGoJourneyCtrl',
    templateUrl: 'views/directive/journey-post.html',
    link: function ($scope, element, attrs) {
      // var counter = 0
      $scope.userData = $.jStorage.get("profile");
      $scope.ongoCard = true;
      $scope.flexShow = true;
      $scope.videoFlex = true;
      $scope.indexPhotoCaption = -1;
      $scope.indexVideoCaption = -1;
      $scope.indexEditPhotoCap = -1;
      $scope.indexEditVideoCap = -1;
      $scope.index = 0;
      $scope.listOfComments = {};
      $scope.listOfComments.scrollBusy = false;
      $scope.listOfComments.stopCallingApi = false;
      $scope.changeImage = function (index, flag) {
        $scope.index = index;
        $scope.ongo.onDisplay = flag;
        console.log($scope.index, $scope.ongo.onDisplay);
      };
      var getLocation = {};
      $scope.otgPhoto = [];
      $scope.otgPhotoArray = [];
      $scope.otgVideo = [];
      $scope.editedPhotosArr = [];
      $scope.checkInData = {};
      $scope.newBuddies = [];
      $scope.selectedTagFriend = [];
      $scope.buddyName = [];
      var hashTag = [];
      $scope.removedHashTag = [];
      $scope.ongo.getSearchedList = "";
      $scope.ongo.buddiesCount = 0;
      if ($scope.ongo.checkIn && $scope.ongo.checkIn.location) {
        $scope.checkInData = _.cloneDeep($scope.ongo.checkIn);
      }
      var y = 1;
      var makePostString = function () {
        if ($scope.ongo.buddies) {
          $scope.ongo.buddiesCount = $scope.ongo.buddies.length;
        }
        $scope.ongo.buddiesString = "";
        if ($scope.ongo.buddiesCount == undefined) {

        } else if ($scope.ongo.buddiesCount == 1) {
          $scope.ongo.buddiesString = "<a href='/users/" + $scope.ongo.buddies[0].urlSlug + "'>" + $scope.ongo.buddies[0].name.bold() + "</a>";
        } else if ($scope.ongo.buddiesCount == 2) {
          $scope.ongo.buddiesString = "<a href='/users/" + $scope.ongo.buddies[0].urlSlug + "'>" + $scope.ongo.buddies[0].name.bold() + "</a>" + " and " + "<a href='/users/" + $scope.ongo.buddies[1].urlSlug + "'>" + $scope.ongo.buddies[1].name.bold() + "</a>";
        } else if ($scope.ongo.buddiesCount >= 2) {
          $scope.ongo.buddiesString = "<a href='/users/" + $scope.ongo.buddies[0].urlSlug + "'>" + $scope.ongo.buddies[0].name.bold() + "</a>" + " and " + "<b>" + ($scope.ongo.buddiesCount - 1) + " others." + "</b>";
        }
        var postString = "";

        // $filter('category')($scope.ongo.checkIn.category) +
        if ($scope.ongo.buddiesString != "") {
          if ($scope.ongo.thoughts && $scope.ongo.checkIn.location) {
            $scope.ongo.postString = $scope.ongo.thoughts + " with " + $scope.ongo.buddiesString + " at " + $scope.ongo.checkIn.location.bold();
          } else if ($scope.ongo.thoughts) {
            $scope.ongo.postString = $scope.ongo.thoughts + " with " + $scope.ongo.buddiesString;
          } else if ($scope.ongo.checkIn && $scope.ongo.checkIn.location) {
            $scope.ongo.postString = "<a href='/users/" + $scope.ongo.user.urlSlug + "'>" + $scope.ongo.user.name.bold() + "</a>" + " with " + $scope.ongo.buddiesString + " at " + $scope.ongo.checkIn.location.bold();
          } else {
            $scope.ongo.postString = "<a href='/users/" + $scope.ongo.user.urlSlug + "'>" + $scope.ongo.user.name.bold() + "</a>" + " with " + $scope.ongo.buddiesString;
          }
        } else {
          if ($scope.ongo.thoughts && $scope.ongo.checkIn.location) {
            $scope.ongo.postString = $scope.ongo.thoughts + " at " + $scope.ongo.checkIn.location.bold();
          } else if ($scope.ongo.thoughts) {
            $scope.ongo.postString = $scope.ongo.thoughts;
          } else if ($scope.ongo.checkIn && $scope.ongo.checkIn.location) {
            $scope.ongo.postString = "<a href='/users/" + $scope.ongo.user.urlSlug + "'>" + $scope.ongo.user.name.bold() + "</a>" + " at " + $scope.ongo.checkIn.location.bold();
          } else {
            $scope.ongo.postString = "";
          }
        }
      };

      $scope.getTimes = function (n, type) {
        if (type == "marked") {
          n = parseInt(n);
          return new Array(n);
        } else if (type == "unmarked") {
          n = parseInt(n);
          var remainCount = 5 - n;
          return new Array(remainCount);
        }
      };

      if ($scope.ongo && $scope.ongo.photos && $scope.ongo.videos) {
        $scope.ongo.photosVideos = $scope.ongo.videos.concat($scope.ongo.photos);
        if ($scope.ongo && $scope.ongo.photosVideos[0] && $scope.ongo.photosVideos[0].thumbnail) {
          $scope.ongo.onDisplay = "videos";
        } else {
          $scope.ongo.onDisplay = "photos";
        }
      }
      makePostString();

      $scope.likePost = function (ongo) {
        console.log(ongo, "this call is from journey-post.html");
        ongo.likeDone = !ongo.likeDone;
        if (ongo.likeDone) {
          if (ongo.likeCount == undefined) {
            ongo.likeCount = 1;
          } else {
            ongo.likeCount = ongo.likeCount + 1;
          }
          LikesAndComments.likeUnlike(ongo.type, "like", ongo.uniqueId, ongo._id, null)
        } else {
          ongo.likeCount = ongo.likeCount - 1;
          LikesAndComments.likeUnlike(ongo.type, "unlike", ongo.uniqueId, ongo._id, null)
        }
      };

      $scope.playAudio = function () {
        var audio = document.getElementById('like-play');
        audio.play();
      }

      $scope.likePhoto = function (uniqueId, _id, additionalId) {
        console.log(uniqueId, _id, additionalId);
        $scope.listOfComments.likeDone = !$scope.listOfComments.likeDone;
        if ($scope.listOfComments.likeDone) {
          if ($scope.listOfComments.likeCount == undefined) {
            $scope.listOfComments.likeCount = 1;
          } else {
            $scope.listOfComments.likeCount = $scope.listOfComments.likeCount + 1;
          }
          LikesAndComments.likeUnlike("photo", "like", uniqueId, _id, additionalId)
        } else {
          $scope.listOfComments.likeCount = $scope.listOfComments.likeCount - 1;
          LikesAndComments.likeUnlike("photo", "unlike", uniqueId, _id, additionalId)
        }
      };

      //post comments starts

      //post comments ends
      // geo location
      $scope.showLocation = false;
      $scope.viewLocation = function () {
        TravelibroService.http({
          url: adminURL + "/post/placeSearch",
          method: "POST",
          data: {
            lat: getLocation.latitude,
            long: getLocation.longitude
          }
        }).success(function (location) {
          console.log("geolocationdtata", location);
          _.each(location.data, function (o) {
            o.name = o.name + ", " + o.vicinity;
          });
          $scope.nearByLocation = location.data;
        }).error(function (data) {
          console.log(data);
        });
      };
      $scope.getLocation = function () {
        if ($scope.ongo.checkIn.location !== "") {
          $scope.showLocation = true;
          TravelibroService.http({
            url: adminURL + "/post/checkInPlaceSearch",
            method: "POST",
            data: {
              lat: getLocation.latitude,
              long: getLocation.longitude,
              search: $scope.ongo.checkIn.location
            }
          }).success(function (location) {
            _.each(location.data, function (o) {
              o.name = o.description;
            });
            $scope.nearByLocation = location.data;
          }).error(function (data) {
            console.log(data);
          });
        } else {
          $scope.ongo.checkIn.category = "";
          $scope.viewLocation();
        }

      };
      $scope.locationId = function (id) {
        console.log(id);
        TravelibroService.http({
          url: adminURL + "/post/getGooglePlaceDetail",
          method: "POST",
          data: {
            placeId: id.place_id
          }
        }).success(function (locationData) {
          $scope.ongo.checkIn = {
            location: id.name,
            lat: locationData.lat,
            long: locationData.long,
            country: locationData.country,
            city: locationData.city,
            category: locationData.data
          };
          $scope.showLocation = false;
        }).error(function (data) {
          console.log(data);
        });
      }
      // geo location end
      $scope.categoryList = ['Beaches', 'Airport', 'Hotels', 'Restaurants', 'Nature & parks', 'Sights & Landmarks', 'Museums & Galleries', 'Religious', 'Shopping', 'Adventure & Excursion', 'Zoos & Aqua', 'Cinema & Theatre'];

      $scope.showCategory = false;
      $scope.viewCategory = function () {
        if ($scope.showCategory == false && $scope.ongo.checkIn.location !== "") {
          $scope.showCategory = true;
        } else {
          $scope.showCategory = false;
        }
      }

      // add photo videos otg
      $scope.addPhotosVideo = function () {
        modal = $uibModal.open({
          animation: true,
          templateUrl: "views/modal/add-photo-video.html",
          backdropClass: "review-backdrop",
          size: "lg",
          scope: $scope,
          backdrop: 'static'
        });
        console.log($scope.ongo, "add wala");
        modal.closed.then(function () {
          $scope.otgPhotoArray = [];
          $scope.photoSec = false;
          $scope.otgPhoto = [];
        });
      };
      // add photo videos otg end
      // edit otg

      // $scope.otgPhoto = _.chunk([$scope.otgPhoto],2);
      // add photos start
      $scope.photoSec = false;
      $scope.addOtgPhotos = function (detail, length) {
        console.log(detail);
        $scope.otgPhoto.push({
          name: detail,
          caption: ""
        });
        // if (y === length) {
        console.log($scope.otgPhoto, "otg photo");
        $scope.flexShow = false;
        $scope.otgPhotoArray = $scope.otgPhoto;
        $scope.otgPhotoArray = _.chunk($scope.otgPhotoArray, 4);
        for (var i = 0; i < $scope.otgPhotoArray.length; i++) {
          $scope.otgPhotoArray[i] = _.chunk($scope.otgPhotoArray[i], 2);
        }
        y = 1;
        // $('#flexslider').removeData("flexslider");
        console.log($scope.otgPhotoArray, "otg photo array");
        if ($scope.otgPhotoArray.length > 0) {
          $scope.photoSec = true;
        } else {
          $scope.photoSec = false;
        }
        $timeout(function () {
          $scope.flexShow = true;
        }, 200)
        // } else {
        //   y++;
        // }
      }
      // add photos end
      // add video start
      $scope.addOtgVideo = function (video) {
        console.log(video, 'video mai kya aaya');
        $scope.otgVideo.push({
          name: video.name,
          thumbnail: video.thumbnail,
          caption: ""
        });
        console.log($scope.otgVideo, 'otg Video');
        $timeout(function () {
          $scope.videoFlex = true;
          if ($scope.otgVideo.length > 0) {
            $scope.videoSec = true;
            $(".flexslider").flexslider({
              directionNav: true
            });
          } else {
            $scope.videoSec = false;
            $(".flexslider").flexslider({
              directionNav: false
            });
          }
        }, 100)
      };
      $scope.addVideoCaption = function (id) {
        if ($scope.indexVideoCaption == id) {
          $scope.indexVideoCaption = -1;
        } else {
          $scope.indexVideoCaption = id;
        }
      }
      // add video end
      // delete added videos
      $scope.deleteVideo = function(videoName){
        $scope.videoFlex = false;
        console.log(videoName);
        _.remove($scope.otgVideo, function(videoObj){
          return videoObj.name === videoName;
        })
        console.log($scope.otgVideo, 'new video');
        $timeout(function () {
          $scope.videoFlex = true;
          if ($scope.otgVideo.length > 0) {
            $scope.videoSec = true;
            $(".flexslider").flexslider({
              directionNav: true
            });
          } else {
            $scope.videoSec = false;
            $(".flexslider").flexslider({
              directionNav: false
            });
          }
        }, 100);
      }
      // delete added videos end
      // delete added photos
      $scope.deletePhotos = function (name) {
        $scope.flexShow = false;
        _.remove($scope.otgPhoto, function (n) {
          return n.name === name;
        })
        $scope.otgPhotoArray = $scope.otgPhoto;
        $scope.otgPhotoArray = _.chunk($scope.otgPhotoArray, 4);
        for (var i = 0; i < $scope.otgPhotoArray.length; i++) {
          $scope.otgPhotoArray[i] = _.chunk($scope.otgPhotoArray[i], 2);
        }
        $timeout(function () {
          $scope.flexShow = true;
        }, 100);
        if ($scope.otgPhotoArray.length > 0) {
          $scope.photoSec = true;
        } else {
          $scope.photoSec = false;
        }
        // console.log();

        console.log($scope.otgPhoto);
        console.log($scope.otgPhotoArray);
      }
      // delete added photos end
      // tag selected buddy
      _.each($scope.ongo.buddies, function (o) {
        o.selected = true;
      });
      $scope.selectBuddy = function (buddy) {
        if (buddy.selected == true) {
          buddy.selected = false;
        } else {
          buddy.selected = true;
        }
      };
      // tag selected buddy end
      $scope.savePhotosVideos = function () {
        _.filter($scope.ongo.buddies, ['selected', true]);
        // console.log(photos,uniqueId);
        var formData = {
          type: "addPhotosVideos",
          photosArr: $scope.otgPhoto,
          videosArr: $scope.otgVideo,
          uniqueId: $scope.ongo.uniqueId,
          buddies: $scope.ongo.buddies
        }
        TravelibroService.http({
          url: adminURL + "/post/editDataWeb",
          method: "POST",
          data: formData
        }).success(function (data) {
          console.log(data);
          if (data.value === true) {
            setTimeout(function () {
              $window.location.reload();
            }, 100);
          }
          // $scope.otgPhoto = [];
          // $scope.otgPhotoArray = [];
        }).error(function (data) {
          console.log(data);
        });
      }
      // edit otg start
      // tag friend list
      $scope.viewListFriend = false;
      $scope.listTagfriend = function () {
        if ($scope.ongo.getSearchedList.length > 3) {
          $scope.viewListFriend = true;
          TravelibroService.http({
            url: adminURL + "/user/searchBuddyWeb",
            method: "POST",
            data: {
              "search": $scope.ongo.getSearchedList
            }
          }).success(function (data) {
            console.log(data.data);
            $scope.tagFriends = data.data;
            _.each($scope.tagFriends, function (n) {
              var buddyIndex = _.findIndex($scope.ongo.buddies, function (m) {
                return m._id === n._id;
              });
              if (buddyIndex !== -1) {
                n.checked = true;
                // n.noEdit = "un-tag";
                // $("#" + n._id).prop('disabled', true);
              } else {
                n.checked = false;
              }
              var checkedIndex = _.findIndex($scope.ongo.buddies, function (z) {
                return z.taggedFriend === true;
              });
              if (checkedIndex !== -1) {
                // $("#" + n._id).prop('disabled', false);
                // n.noEdit = "";
              }
            });
          }).error(function (data) {
            console.log(data);
          });
        } else {
          console.log($scope.ongo.buddies, 'total-array');
          $scope.viewListFriend = false;
        }
      }
      // tag friend list end

      $scope.editTagFriends = function (list) {
        var getBuddy = _.findIndex($scope.ongo.buddies, function (id) {
          return id._id === list._id;
        });
        console.log(getBuddy);
        if (getBuddy === -1) {
          $scope.ongo.buddies.push({
            _id: list._id,
            name: list.name,
            email: list.email,
            profilePicture: list.profilePicture,
            taggedFriend: true,
          });
          console.log($scope.ongo.buddies, "buddies ka list");
          // $scope.newBuddies.push({
          //   _id: list._id,
          //   name: list.name,
          //   email: list.email
          // })
          $scope.ongo.buddiesCount = $scope.ongo.buddiesCount + 1;
          console.log($scope.newBuddies, "new buddies");
        } else {
          // _.remove($scope.newBuddies, function (newId) {
          //   return newId._id === list._id;
          // });
          _.remove($scope.ongo.buddies, function (newId) {
            return newId._id === list._id;
          })
          $scope.ongo.buddiesCount = $scope.ongo.buddiesCount - 1;
        }
        $scope.viewListFriend = false;
        list.checked = "";
        $scope.ongo.getSearchedList = "";
      }

      // photos array edit
      $scope.addMoreCaption = function (index) {
        if ($scope.indexPhotoCaption === index) {
          $scope.indexPhotoCaption = -1;
        } else {
          $scope.indexPhotoCaption = index;
        }
      }
      // photos array edit end
      // show direction nav arrow
      $scope.otgPhoto = [];
      setTimeout(function () {
        if ($scope.otgPhoto.length > 1) {
          $(".flexslider").flexslider({
            directionNav: false
          });
        } else {
          $(".flexslider").flexslider({
            directionNav: true
          });
        }
      }, 1000);
      // show direction nav arrow end

      // photos array edit end
      // video array
      setTimeout(function () {
        $scope.removeVideoButton = "";
        $scope.playVideo = function (id, index) {
          videoId = id + "_" + index;
          var vid = document.getElementById(videoId);
          if ($scope.removeVideoButton === "") {
            $scope.removeVideoButton = "remove-playbtn";
            vid.play();
          } else {
            $scope.removeVideoButton = "";
            vid.pause();
          }
        }
      }, 100)

      $scope.addEditVideoCaption = function (index) {
        if ($scope.indexEditVideoCap === index) {
          $scope.indexEditVideoCap = -1;
        } else {
          $scope.indexEditVideoCap = index;
        }
      }

      $scope.removeEditVid = function (videoId) {
        $scope.videoFlex = false;
        _.remove($scope.ongo.videos, function (remove) {
          return remove._id == videoId;
        })
        $scope.ongo.videos = $scope.ongo.videos;
        $timeout(function () {
          console.log('timeout chala kya');
          $scope.videoFlex = true;
        }, 100);
      }
      // edit video caption
      $scope.editVideoCap = function (videoCap) {
        var videoCaption = _.findIndex($scope.ongo.videos, function (n) {
          return n._id == videoCap._id;
        })
        $scope.ongo.videos[videoCaption].caption = videoCap.caption;
      }
      // edit video caption end
      // video array end
      // edit otg end
      // checkin
      var modal = "";
      // edit otg checkin
      $scope.editCheckIn = function () {
        $scope.oldBuddies = _.cloneDeep($scope.ongo.buddies);
        console.log();
        $scope.alreadyTagFrnd = true;
        modal = $uibModal.open({
          animation: true,
          templateUrl: "views/modal/edit-otg.html",
          size: "lg",
          scope: $scope,
          backdrop: 'static',
          backdropClass: "review-backdrop"
        });
        modal.close();
        console.log("abc", $scope.ongo);

        // geo location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (geoLocation) {
            getLocation = geoLocation.coords;
          });
        } else {
          console.log("navigator.geolocation not supported");
        }
        // geo location end
      }

      // edit more caption
      $scope.editMoreCaption = function (index) {
        console.log(index, 'photo ka index');
        if ($scope.indexEditPhotoCap === index) {
          $scope.indexEditPhotoCap = -1;
        } else {
          $scope.indexEditPhotoCap = index;
        }
      };
      // edit more caption end
      $scope.photosArray = _.cloneDeep($scope.ongo.photos);
      $scope.photosArray = _.chunk($scope.photosArray, 4);
      for (var i = 0; i < $scope.photosArray.length; i++) {
        $scope.photosArray[i] = _.chunk($scope.photosArray[i], 2);
        // console.log($scope.photosArray[i + 'row'] = _.chunk($scope.photosArray[i + 'col'], 2));
      }

      $scope.removeEditPic = function (id) {
        $scope.flexShow = false;
        _.remove($scope.ongo.photos, function (editPic) {
          return editPic._id === id;
        });
        $scope.photosArray = $scope.ongo.photos;
        $scope.photosArray = _.chunk($scope.photosArray, 4);
        for (var i = 0; i < $scope.photosArray.length; i++) {
          $scope.photosArray[i] = _.chunk($scope.photosArray[i], 2);
          // console.log($scope.photosArray[i + 'row'] = _.chunk($scope.photosArray[i + 'col'], 2));
        }
        $timeout(function () {
          $scope.flexShow = true;
        }, 100);
        console.log($scope.photosArray, "new array");
      }

      // caption edit
      $scope.editCaption = function (columndata) {
        var editIndex = _.findIndex($scope.ongo.photos, function (j) {
          return j._id === columndata._id;
        });
        $scope.ongo.photos[editIndex].caption = columndata.caption;
      }
      // caption edit end

      // edit save data
      $scope.saveEditOtg = function () {
        console.log($scope.oldBuddies, 'old buddies');
        // get photos id
        $scope.photosId = _.map($scope.ongo.photos, "_id");
        // get photos id end

        LikesAndComments.getHashTags($scope.ongo.thoughts, function (data) {
          hashTag = data;
          // removedHashTag
          var removeTag = _.difference($scope.ongo.hashTag, hashTag);
          $scope.removedHashTag = removeTag;
          // removeHashtag end
        });
        console.log(hashTag);

        // hashtag end

        var editedData = {
          thoughts: $scope.ongo.thoughts,
          checkIn: $scope.ongo.checkIn,
          checkInChange: true,
          journeyUniqueId: $scope.json.uniqueId,
          "uniqueId": $scope.ongo.uniqueId,
          "_id": $scope.ongo._id,
          oldBuddies: $scope.oldBuddies,
          newBuddies: $scope.ongo.buddies,
          hashtag: hashTag,
          addHashtag: hashTag,
          removeHashtag: $scope.removedHashTag,
          photosArr: $scope.ongo.photos,
          videosArr: $scope.ongo.videos,
          type: "editPost"
        }
        if ($scope.ongo.checkIn && $scope.ongo.checkIn.lat && $scope.ongo.checkIn.long && $scope.ongo.checkIn.category && $scope.ongo.checkIn.location) {
          if ($scope.checkInData.lat && $scope.checkInData.long) {
            if ($scope.ongo.checkIn.lat === $scope.checkInData.lat && $scope.ongo.checkIn.long === $scope.checkInData.long) {
              editedData.checkInChange = false;
            } else {
              editedData.checkInChange = true;
            }
          } else {
            editedData.checkInChange = true;
          }
        } else {
          editedData.checkIn = {
            location: "",
            lat: "",
            long: "",
            country: "",
            city: "",
            category: ""
          };
          editedData.checkInChange = false;
        }
        console.log(editedData, "dataEdited hai");
        TravelibroService.http({
          url: adminURL + "/post/editDataWeb",
          method: "POST",
          data: editedData,
        }).success(function (data) {
          if (data.value === true) {
            $window.location.reload();
            // setTimeout(function(){
            //   console.log('ave');
            // },200);
            // $scope.ongo.photosVideos = $scope.ongo.videos.concat($scope.ongo.photos);
            // console.log($scope.ongo.photosVideos,'photo video kya hai');
            // $scope.ongo.photos = $scope.photosArray;
            // $scope.ongo.buddies = $scope.newBuddies;
            // $scope.ongo.thoughts = editedData.thoughts;
          }
          // $scope.editedData = {};
        }).error(function (data) {
          console.log(data);
        });
        console.log($scope.ongo, "journey ka arrray");
      }
      // edit save data end
      // edit otg checkin end

      //////////////////////////////////
      $scope.uploadImage = true;
      $scope.viewUploadedImg = false;
      $scope.previewFile = function (val) {
        var interval = $interval(function () {
          var preview = document.getElementById('img' + (val));
          console.log('img' + (val)); 
          var file   = document.getElementById('upload' + (val)).files[0];
          console.log(preview);
          console.log(file);
          var reader  = new FileReader();
          reader.addEventListener("load", function () {  
            preview.src = reader.result; 
          }, false);
          if (file) { 
            $scope.uploadImage = false;
            $scope.viewUploadedImg = true;
            reader.readAsDataURL(file);
            $interval.cancel(interval);
          }
        }, 1000);
      };
      $scope.returnUpload = function () {
        $scope.viewUploadedImg = false;
        $scope.uploadImage = true;
      };
      $scope.checkinUpload = [{}, {}, {}];
      ////////////////////////////
      $scope.editOption = function (model) {
        $timeout(function () {
          model.backgroundClick = true;
          backgroundClick.object = model;
        }, 200);
        backgroundClick.scope = $scope;
      };

      $scope.time = {};
      $scope.datetime = {};

      $scope.changePostsDate = function () {
        console.log("Posts Date");
        $scope.isPostDate = true;
        $scope.isBannerDate = false;
        console.log($scope.isPostDate, $scope.isBannerDate);
        date = $scope.ongo.UTCModified;
        var d = new Date(date);
        var hh = d.getHours();
        if (hh > 12) {
          hh = hh - 12;
          $scope.time.am_pm = "PM";
        } else {
          $scope.time.am_pm = "AM";
        }
        $scope.time.hour = hh;
        $scope.time.min = d.getMinutes();
        $scope.datetime.dt = d;
        $scope.options = {
          minDate: $scope.json.startTime,
          maxDate: $scope.json.post[$scope.json.post.length - 1].UTCModified,
          showWeeks: false
        };
        $uibModal.open({
          animation: true,
          templateUrl: "views/modal/date-time.html",
          scope: $scope,
          backdropClass: "review-backdrop",
        })
      };

      $scope.updateDateTime = function (id, formData, dt) {
        console.log(dt);
        console.log(formData, dt);
        var date = $filter('formatDateCalender')(dt);
        var time = $filter('formatTimeCalender')(formData);
        var result = {};
        console.log(date);
        console.log(time);
        result.type = "changeDateTime";
        result.date = new Date(date + " " + time);
        result.uniqueId = id;
        TravelibroService.http({
          url: adminURL + "/post/editDataWeb/",
          method: "POST",
          data: result
        }).success(function (data) {
          var formData = {
            "urlSlug": $scope.json.urlSlug
          }
          OnGoJourney.getOneJourney(formData, function (journeys) {
            $scope.json.post = journeys.post;
          }, function (err) {
            console.log(err);
          });
        }).error(function (data) {
          console.log(data);
        });
      };

      $scope.hours = _.range(1, 13, 1);
      $scope.mins = _.range(1, 60, 1);
      $scope.change = function (id, val) {
        if (id == 'hour') {
          $scope.time.hour = val;
        } else if (id == 'min') {
          $scope.time.min = val;
        } else {
          $scope.time.am_pm = val;
        }
      }
      $scope.confirmDelete = function () {
        modal = $uibModal.open({
          animation: true,
          windowClass: "delete-visited-country",
          templateUrl: 'views/modal/delete-post.html',
          scope: $scope
        })
      }
      $scope.deletePost = function (postId, journeyId) {
        console.log(postId, journeyId);
        var formData = {
          type: "deletePost",
          _id: postId,
          uniqueId: journeyId
        };
        console.log(formData);
        TravelibroService.http({
          url: adminURL + "/post/editDataWeb/",
          method: "POST",
          data: formData
        }).success(function () {
          console.log("deleted successfully");
          document.getElementById(postId).remove();
        }).error(function () {
          console.log("failed to delete");
        })
      }

      // review post visited pop up
      $scope.giveReview = function (checkin) {
        console.log(checkin, "location");
        $scope.checkIn = checkin;
        $scope.checkIn.type = 'travel-life';
        modal = $uibModal.open({
          animation: true,
          templateUrl: "views/modal/review-post.html",
          scope: $scope,
          backdropClass: "review-backdrop"
        });
      };

      $scope.savePostReview = function (values) {
        var formData = {
          "post": $scope.ongo._id,
          "review": values.review,
          "rating": values.rating
        };
        TravelibroService.http({
          url: adminURL + "/review/saveWeb",
          method: "POST",
          data: formData
        }).success(function (data) {
          console.log(data);
          OnGoJourney.getOneJourney({
            "urlSlug": $scope.json.urlSlug
          }, function (journeys) {
            var post = _.find(journeys.post, ['_id', $scope.ongo._id]);
            $scope.ongo.review = post.review;
          }, function (err) {
            console.log(err);
          });
          modal.close();
        }).error(function (data) {
          console.log(data);
        });
      };

      $scope.showRating = 1;
      $scope.fillColor = "";
      $scope.postReview = {};
      $scope.postReview.rating = 1;
      $scope.starRating = function (val) {
        $scope.postReview.rating = val;
        if (val == 1) {
          $scope.showRating = 1;
          $scope.fillColor2 = "";
          $scope.fillColor3 = "";
          $scope.fillColor4 = "";
          $scope.fillColor5 = "";
        } else if (val == 2) {
          $scope.showRating = 2;
          $scope.fillColor2 = "fa-star";
          $scope.fillColor3 = "";
          $scope.fillColor4 = "";
          $scope.fillColor5 = "";
        } else if (val == 3) {
          $scope.showRating = 3;
          $scope.fillColor2 = "fa-star";
          $scope.fillColor3 = "fa-star";
          $scope.fillColor4 = "";
          $scope.fillColor5 = "";
        } else if (val == 4) {
          $scope.showRating = 4;
          $scope.fillColor2 = "fa-star";
          $scope.fillColor3 = "fa-star";
          $scope.fillColor4 = "fa-star";
          $scope.fillColor5 = "";
        } else if (val == 5) {
          $scope.showRating = 5;
          $scope.fillColor2 = "fa-star";
          $scope.fillColor3 = "fa-star";
          $scope.fillColor4 = "fa-star";
          $scope.fillColor5 = "fa-star";
        } else {
          $scope.showRating = 1;
        }
      };

      $scope.allPhotos = {};
      $scope.allPhotos.photoSliderIndex = "";
      $scope.allPhotos.photoSliderLength = "";
      $scope.allPhotos.newArray = [];
      //Photo comment popup
      $scope.getPhotosCommentData = function (photoId, index, length, array) {
        console.log('abhi log huwa kya');
        if (!($.jStorage.get("isLoggedIn"))) {
          $state.go('login');
        } else {
          console.log(index);
          console.log(length);
          console.log(array);
          console.log(photoId, "click function called");
          $scope.allPhotos.photoSliderIndex = index;
          $scope.allPhotos.photoSliderLength = length;
          $scope.allPhotos.newArray = array;
          modal = $uibModal.open({
            templateUrl: "views/modal/notify.html",
            animation: true,
            controller: "photoCommentModalCtrl",
            scope: $scope,
            windowClass: "notify-popup"
          });
          modal.closed.then(function () {
            $scope.listOfComments = {};
          });
          var callback = function (data) {
            $scope.uniqueArr = [];
            $scope.listOfComments = data.data;
            console.log($scope.listOfComments);
            $scope.uniqueArr = _.uniqBy($scope.listOfComments.comment, 'user._id');
          };
          LikesAndComments.getComments("photo", photoId, 1, callback);
        }
      };

      $scope.postPhotosComment = function (uniqueId, comment, postId, photoId) {
        console.log(uniqueId, comment, postId, photoId);
        var type = "photo";
        var hashTag = [];
        var callback = function (data) {
          $scope.listOfComments = data.data;
          document.getElementById('enterComment').value = "";
        }
        LikesAndComments.postComment(type, uniqueId, postId, comment, hashTag, photoId, callback);
      };

      // routing to profile
      $scope.linkToProfile = function (obj) {
        console.log(obj, 'what is obj');
      }
      // routing to profile end
    }
  };
}]);

ongojourney.filter('formatDateCalender', function () {
  return function (date) {

    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
  };
});


ongojourney.filter('formatTimeCalender', function () {
  return function (formData) {

    var hour = formData.hour,
      mins = formData.min,
      sec = 00;
    if (formData.am_pm == "AM") {
      if (hour == 12) {
        hour = 0;
      }
    } else if (formData.am_pm == "PM") {
      if (hour == 12) {
        hour = 12;
      } else {
        hour = parseInt(hour) + 12;
      }
    }
    return [hour, mins, sec].join(':');
  };
});


ongojourney.filter('formatDate', function () {
  return function (input, type) {

    if (type == 'date') {
      var returnVal = moment(input).format('D MMM, YYYY');
    } else if (type == 'time') {
      var returnVal = moment(input).format('hh:mm a');
    } else if (type == 'year') {
      var returnVal = moment(input).format('YYYY');
    }
    return returnVal;
  };
});

ongojourney.filter('dateDifference', function () {
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
    return days;
  };
});

ongojourney.filter('small', function () {
  return function (str) {
    if (str != undefined) {
      var n = str.indexOf("/");
      if (n != -1) {
        str = str.split("size=600x400").join("size=800x600");
        return str;
      } else {
        return str;
      }
    }
  }
});

ongojourney.filter('category', function () {
  return function (input) {
    var returnVal = "";
    switch (input) {
      case "Restaurants & Bars":
        returnVal = "img/icons/resto.png";
        break;
      case "Nature & Parks":
        returnVal = "img/icons/smallnature.png";
        break;
      case "Sights & Landmarks":
        returnVal = "img/icons/smallsight.png";
        break;
      case "Museums & Galleries":
        returnVal = "img/icons/smallmuseums.png";
        break;
      case "Adventure & Excursions":
        returnVal = "img/icons/smalladventure.png";
        break;
      case "Zoo & Aquariums":
        returnVal = "img/icons/smallzoos.png";
        break;
      case "Events & Festivals":
        returnVal = "img/icons/smallevents.png";
        break;
      case "Shopping":
        returnVal = "img/icons/smallshopping.png";
        break;
      case "Beaches":
        returnVal = "img/icons/beach.png";
        break;
      case "Religious":
        returnVal = "img/icons/smallreligious.png";
        break;
      case "Cinema & Theatres":
        returnVal = "img/icons/smallcinema.png";
        break;
      case "Hotels & Accomodations":
        returnVal = "img/icons/smallhotels.png";
        break;
      case "Transportation":
        returnVal = "img/icons/smallairport.png";
        break;
      case "Others":
        returnVal = "img/icons/smallothers.png";
        break;
      case "Other":
        returnVal = "img/icons/smallothers.png";
        break;
      default:
        returnVal = "img/icons/smallothers.png";
        break;
    }
  };
});
//remove it once its of no use
ongojourney.filter('singularOrPlural', function () {
  return function (count, flag) {
    if (flag == 'like') {
      if (count == 1) {
        return "Like";
      } else {
        return "Likes";
      }
    } else if (flag == 'comment') {
      if (count == 1) {
        return "Comment";
      } else {
        return "Comments";
      }
    }
  }
});

ongojourney.filter('filterCount', function () {
  return function (count) {
    if (count == undefined) {
      return 0;
    } else {
      return count;
    }
  }
});
