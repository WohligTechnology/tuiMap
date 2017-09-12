var commontask = angular.module('commontask', [])

.factory('LikesAndComments', function (TravelibroService, $filter, $uibModal, $timeout, $state) {

    var returnVal = {
        getHashTags: function (commentString, callback) {
            if (_.trim(commentString) != "") {
                var len = commentString.length;
                var counter = 0;
                var startIndex = null;
                var endIndex = null;
                var i;
                var tag;
                var hashTag = [];
                while (counter != len - 1) {
                    if (commentString[counter] == "#") {
                        startIndex = counter;
                        i = startIndex + 1;
                        while (i <= len) {
                            if (commentString[i] == " " || commentString[i] == "#" || commentString[i] == "@") {
                                endIndex = i - 1;
                                console.log(startIndex, endIndex);
                                tag = commentString.substring(startIndex, endIndex + 1);
                                hashTag.push(tag);
                                console.log(tag);
                                break;
                            } else if (i == commentString.length - 1) {
                                endIndex = i;
                                console.log(startIndex, endIndex);
                                tag = commentString.substring(startIndex, endIndex + 1);
                                hashTag.push(tag);
                                console.log(tag);
                                break;
                            }
                            i++;
                        }
                        // console.log(hashTag);
                    }
                    counter++;
                }
                hashTag = _.remove(hashTag, function (n) {
                    return !(n == "#" || n == "@");
                });
                callback(hashTag);
            } else {
                callback([]);
            }
        },
        postComment: function (type, uniqueId, type_Id, comment, hashTag, additionalId, callback) { //type_id=postId,journeyId,ItineraryId
            console.log("inside LikesAndComments");
            // alert(type);
            if (!($.jStorage.get("isLoggedIn"))) {
                $state.go('login');
            }
            console.log(type, uniqueId, type_Id, comment, hashTag, additionalId, callback);
            var getCommentId = "";
            hashtag = [];
            console.log(comment);
            returnVal.getHashTags(comment, function (data) {
                hashTag = data;
            });
            // console.log(hashTag);
            var obj = {
                "uniqueId": uniqueId,
                "text": comment,
                "hashtag": hashTag
            };
            switch (type) {
                case "travel-life":
                case "local-life":
                    obj.type = "post";
                    obj.post = type_Id;
                    getCommentId = type_Id;
                    break;
                case "on-the-go-journey":
                case "ended-journey":
                    obj.type = "journey";
                    obj.journey = type_Id;
                    getCommentId = type_Id;
                    break;
                case "quick-itinerary":
                case "detail-itinerary":
                    obj.type = "itinerary";
                    obj.itinerary = type_Id;
                    getCommentId = type_Id;
                    break;
                case "photo":
                    obj.type = "photo";
                    obj.post = type_Id;
                    obj.photo = additionalId; //this var is initialized only when commenting for photo,video or itinerary
                    getCommentId = additionalId;
                    break;
                case "video":
                    obj.type = "video";
                    obj.video = additionalId;
                    getCommentId = "";
                    break;
                case "agentStatus":
                    obj.type = "agentStatus",
                        obj.agentStatus = type_Id;
                    getCommentId = type_Id;
                    break;
            }
            if (type == "agentStatus") {
                delete obj.uniqueId;
                // obj.remove(uniqueId);
                console.log(obj, "Status omment");
                TravelibroService.http({
                    url: adminURL + "/comment/addCommentWeb",
                    method: "POST",
                    data: obj
                }).success(function (data) {
                    returnVal.getComments(type, getCommentId, 1, callback);
                }).error(function (data) {
                    console.log(data);
                });
            } else {
                TravelibroService.http({
                    url: adminURL + "/comment/addCommentWeb",
                    method: "POST",
                    data: obj
                }).success(function (data) {
                    returnVal.getComments(type, getCommentId, 1, callback);
                }).error(function (data) {
                    console.log(data);
                });
            }
        },
        getComments: function (type, _id, pagenumber, callback) {
            if (!($.jStorage.get("isLoggedIn"))) {
                $state.go('login');
            } else {
                console.log(type, _id);
                var obj = {
                    "_id": _id,
                    "pagenumber": pagenumber
                };
                var url;
                switch (type) {
                    case "travel-life":
                    case "local-life":
                        url = "/post/getPostCommentWeb";
                        break;
                    case "on-the-go-journey":
                    case "ended-journey":
                        url = "/journey/getJourneyCommentWeb";
                        break;
                    case "quick-itinerary":
                    case "detail-itinerary":
                        url = "/itinerary/getItineraryCommentWeb";
                        break;
                    case "photo":
                        url = "/postphotos/getOneWeb";
                        break;
                    case "video":
                        url = "/postvideos/getPostCommentWeb";
                        break;
                    case "agentStatus":
                        url = "/agentStatus/getAgentStatusCommentWeb";

                        break;
                }
                TravelibroService.http({
                    url: adminURL + url,
                    method: "POST",
                    data: obj
                }, true).success(function (data) {
                    callback(data);
                }).error(function (data) {
                    console.log(data);
                });
            }
        },
        likeUnlike: function (type, task, uniqueId, type_id, additionalId) {
            console.log(type, task, uniqueId, type_id, additionalId);
            if (!($.jStorage.get("isLoggedIn"))) {
                $state.go('login');
            }
            var obj = {
                "uniqueId": uniqueId
            };
            switch (type) {
                case "travel-life":
                case "local-life":
                    obj.post = type_id;
                    url = "/post/updateLikePostWeb";
                    break;
                case "on-the-go-journey":
                case "ended-journey":
                    obj.journey = type_id;
                    url = "/journey/likeJourneyWeb";
                    break;
                case "quick-itinerary":
                case "detail-itinerary":
                    obj.itinerary = type_id;
                    url = "/itinerary/updateLikeItineraryWeb";
                    break;
                case "photo":
                    obj.photoId = additionalId;
                    url = "/postphotos/updateLikePostWeb";
                    break;
                case "video":
                    obj.videoId = additionalId;
                    url = "/postvideos/updateLikePostWeb";
                    break;
                case "agentStatus":
                    obj.agentStatus = type_id;
                    url = "/agentstatus/updateLikeStatusWeb";
                    break;
            }
            if (task == "unlike") {
                obj.unlike = true;
            }
            TravelibroService.http({
                url: adminURL + url,
                method: "POST",
                data: obj
            }, true).success(function (data) {
                console.log(data);
            }).error(function (data) {
                console.log(data);
            });
        },
        getLikes: function (type, _id, pagenumber, callback) {
            if (!($.jStorage.get("isLoggedIn"))) {
                $state.go('login');
            }
            console.log(type, _id);
            var obj = {
                "_id": _id,
                "pagenumber": pagenumber
            };
            switch (type) {
                case "travel-life":
                case "local-life":
                    url = "/post/getPostLikesWeb";
                    break;
                case "on-the-go-journey":
                case "ended-journey":
                    url = "/journey/getJourneyLikesWeb";
                    break;
                case "quick-itinerary":
                case "detail-itinerary":
                    url = "/itinerary/getItineraryLikesWeb";
                    break;
                case "photo":
                    url = "/postphotos/getPostLikesWeb";
                    break;
                case "video":
                    url = "/postvideos/getPostLikesWeb";
                    break;
                case "agentStatus":
                    url = "/agentStatus/getAgentStatusLikesWeb";
                    break;
            }

            TravelibroService.http({
                url: adminURL + url,
                method: "POST",
                data: obj
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
        },
        getReviews: function (id, type, callback) {
            switch (type) {
                case 'hotel':
                    url = "/hotel/getReview"
                    break;
                case 'restaurant':
                    url = "/restaurant/getReview"
                    break;
                default:
            }
            var formData = {
                "_id": id
            }
            TravelibroService.http({
                url: adminURL + url,
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
        },
        getPhotoBannerDetails: function (_id, pagenumber, successCallback, errorCallback) {
            console.log(_id, pagenumber);
            var obj = {
                "_id": _id,
                "pagenumber": pagenumber
            };
            TravelibroService.http({
                url: adminURL + "/postPhotos/getOneWeb",
                data: obj,
                method: "POST"
            }).success(successCallback).error(errorCallback);
        },
        openPhotoPopup: function (_id, scope) {
            scope.listOfComments = {
                "scrollBusy": false,
                "stopCallingApi": true
            }
            var callback = function (data) {
                scope.listOfComments = data.data;
                scope.listOfComments.pageNo = 1;
                scope.listOfComments.scrollBusy = false;
                scope.listOfComments.stopCallingApi = false;
                if (data.data && data.data.comment.length === 0) {
                    scope.listOfComments.stopCallingApi = true;
                }
            };
            returnVal.getPhotoBannerDetails(_id, 1, callback, function (data) {
                console.log(data);
            });
        },
        searchTags: function (tag, callback) {
            TravelibroService.http({
                url: adminURL + "/hashtag/findHash",
                method: "POST",
                data: {
                    "hashtag": tag
                }
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
        },
        searchBuddies: function (buddy, callback) {
            TravelibroService.http({
                url: adminURL + "/user/searchBuddyWeb",
                method: "POST",
                data: {
                    fromTag: true,
                    search: buddy
                }
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
        },
        followUnFollow: function (obj, callback) {
            if (!($.jStorage.get("isLoggedIn"))) {
                $state.go('login');
            }
            console.log(obj);
            var formData = {
                "_id": obj._id,
            };
            if (obj.following === 0) {
                console.log("requested to follow");
                TravelibroService.http({
                    url: adminURL + "/user/followUserWeb",
                    method: "POST",
                    data: formData
                }, true).success(callback);
            } else if (obj.following == 1) {
                console.log("requested to unfollow");
                TravelibroService.http({
                    url: adminURL + "/user/unFollowUserWeb",
                    method: "POST",
                    data: formData
                }, true).success(callback);
            }
        },
        commentDelete: function (commentId, commentType, callback) {
            console.log(callback, 'callback');
            console.log(commentId, 'comment ka id');
            TravelibroService.http({
                url: adminURL + "/comment/deletePostComment",
                method: "POST",
                data: {
                    _id: commentId,
                    type: commentType
                }
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
        },
        commentEdit: function (commentId, commentText, commentType, callback) {
            TravelibroService.http({
                url: adminURL + "/comment/editCommentWeb",
                method: "POST",
                data: {
                    _id: commentId,
                    text: commentText,
                    type: commentType,
                    addHashtag: [],
                    removeHashtag: []
                }
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
        },
        getOnePost: function (id, callback) {
            TravelibroService.http({
                url: adminURL + "/post/getoneweb",
                data: {
                    "_id": id
                },
                method: "POST"
            }).success(callback);
        },
        onClickDropDown: function (model, scope, class1, class2) {
            console.log("clicked");
            $timeout(function () {
                if (model.backgroundClick == null || model.backgroundClick == undefined) {
                    model.backgroundClick = true;
                }
                model.outerClass = class1;
                model.innerClass = class2;
                backgroundClick.object = model;
            }, 0);
            backgroundClick.scope = scope;
        }
    };
    return returnVal;
})

.factory('DataUriToBlob', function () {
    return {
        dataURItoBlob: function (dataURI, type) {
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
            var bb = new Blob([ab], {
                type: type
            });
            return bb;
        }
    };
});

commontask.directive('findTags', function (LikesAndComments) {
    return {
        restrict: 'E',
        scope: {
            ngModel: "=",
            elementId: "@",
            enable: "@"
        },
        templateUrl: "views/modal/hashtag.html",
        link: function ($scope, element, attrs) {
            $scope.$watch('ngModel', function (newVal, oldVal) {
                // alert($scope.ngModel);
                var text = $scope.ngModel;
                var comment = {
                    'text': newVal
                };
                var ctl = document.getElementById($scope.elementId);
                $scope.startTagIndex = null;
                $scope.endTagIndex = null;
                $scope.hashTag;
                currentPosition = ctl.selectionStart - 1;
                // console.log(currentPosition);
                var counter = currentPosition;

                //for finding hashtags
                if (currentPosition != -1 && currentPosition !== undefined) {
                    if (text[currentPosition] != " " || text[currentPosition] != "#" || text[currentPosition] != "@") {
                        $scope.hashTags = [];
                        while (text[counter] != " " && text[counter] != "#" && text[counter] != "@" && counter >= 0) {
                            counter--;
                        }
                        if ((text[counter] == "#" || text[counter] == "@") && text[counter + 1] != "#" && text[counter + 1] != "@") {
                            $scope.startTagIndex = counter;
                        } else if (text[counter + 1] == "#" || text[counter + 1] == "@") {
                            $scope.startTagIndex = counter + 1;
                        }
                        counter = counter + 1;
                        while ((counter <= text.length) && ($scope.startTagIndex != null)) {
                            if (text[counter] == " " || text[counter] == "#" || text[counter] == "@") {
                                $scope.endTagIndex = counter - 1;
                                break;
                            } else if (counter == text.length - 1) {
                                $scope.endTagIndex = counter;
                                break;
                            }
                            counter++;
                        }
                        if ($scope.startTagIndex != null && $scope.endTagIndex != null) {
                            // console.log("testing", $scope.startTagIndex, $scope.endTagIndex);
                            $scope.flag = text[$scope.startTagIndex];
                            $scope.showTags = false;
                            $scope.showBuddies = false;
                            // $scope.hashTag = text.substring($scope.startTagIndex, $scope.endTagIndex + 1);
                            var tagCallback = function (data) {
                                $scope.hashTags = data.data;
                                console.log($scope.hashTags);
                                $scope.showTags = true;
                                $scope.showBuddies = false;
                            };
                            var buddiesCallback = function (data) {
                                $scope.buddies = data.data;
                                console.log($scope.buddies);
                                $scope.showTags = false;
                                $scope.showBuddies = true;
                            }
                            if ($scope.flag == "#" && ($scope.enable == 'hashTag' || $scope.enable == 'bothTagging')) {
                                $scope.hashTag = text.substring($scope.startTagIndex, $scope.endTagIndex + 1);
                                LikesAndComments.searchTags($scope.hashTag, tagCallback);
                            } else if ($scope.flag == "@" && ($scope.enable == 'tagFriends' || $scope.enable == 'bothTagging')) {
                                $scope.hashTag = text.substring($scope.startTagIndex + 1, $scope.endTagIndex + 1);
                                LikesAndComments.searchBuddies($scope.hashTag, buddiesCallback);
                            }
                            console.log($scope.hashTag);
                        }
                    }
                } else {
                    // console.log("invalid currentPosition");
                }
            });

            String.prototype.replaceBetween = function (start, end, len, what) {
                console.log(start, end, len, what);
                return this.substring(0, start) + what + this.substring(end + 1, len);
            };

            $scope.appendComment = function (flag, comment, replaceWith, tag, startTagIndex, endTagIndex) {
                $scope.showTags = false;
                $scope.showBuddies = false;
                console.log(comment, replaceWith, tag, startTagIndex, endTagIndex);
                var counter = "";
                var len = comment.length;
                counter = startTagIndex + 1;
                while ((counter <= comment.length) && ($scope.startTagIndex != null)) {
                    if (comment[counter] == " " || comment[counter] == "#" || comment[counter] == "@") {
                        $scope.endTagIndex = counter - 1;
                        break;
                    } else if (counter == comment.length - 1) {
                        $scope.endTagIndex = counter;
                        break;
                    }
                    counter++;
                }
                if (flag == "#") {
                    var a = comment.replaceBetween(startTagIndex, $scope.endTagIndex, len, replaceWith);
                } else if (flag == "@") {
                    var a = comment.replaceBetween(startTagIndex + 1, $scope.endTagIndex, len, replaceWith);
                }
                console.log(a);
                $scope.ngModel = a;
                $scope.hashTags = [];
                // $scope.focus();
            };
        }
    }
});

commontask.directive('commentLikeSection', function (LikesAndComments, $timeout) {
    return {
        restrict: 'E',
        scope: {
            'userData': '=',
            'post': '=',
            'viewCardComment': '=',
            'viewCardLike': '=',
            'listOfComments': '=',
            'listOfLikes': '=',
            'getCard': '=',
            'showLikeShow': '=',
            'callReview': '=',
            'viewCardReview': '=',
            'listOfReviews': '=',
            'postScrollData': '='
        },
        controller: 'commentLikeSectionCtrl',
        templateUrl: "views/directive/commonLikesAndComments.html",
        link: function ($scope, element, attrs) {
            // console.log($scope.post, "bhai ander ghus gya");
            // console.log($scope.listOfLikes);
            // console.log("sk;mdsmkmksmdkm");
            $scope.$watch('viewCardComment', function (newVal, oldVal) {
                if (newVal == false) {
                    // $scope.listOfComments = [];
                } else {
                    // console.log($scope.listOfComments);
                }
            })

        }
    }
});

commontask.directive('likeSound', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var audio = document.getElementById('like-play');
                audio.play();
            });
        }
    };
});

commontask.directive('linkProfile', function ($compile, $parse, $state) {
    return {
        restrict: 'EA',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);
            $scope.redirectToProfile = function (obj) {
                if (obj.urlSlug && obj.type) {
                    if (obj.type == "user") {
                        $state.go("mylife", {
                            "name": 'journey',
                            "urlSlug": obj.urlSlug
                        });
                    } else if (obj.type == "agent") {
                        $state.go("agent-home-without", {
                            "urlSlug": obj.urlSlug
                        });
                    }
                }
            };
        }
    };
});

commontask.filter("followFollowingStatus", function () {
    return function (input) {
        console.log(input, "---");
        if (input === 1) {
            return "Following";
        } else if (input === 0) {
            return "Follow";
        } else if (input === 2) {
            return "Requested";
        } else if (input === null || input === undefined) {
            return "Follow";
        }
    }
});

commontask.filter("singularPlural", function () {
    return function (input, flag) {
        switch (flag) {
            case "Likes":
                if (input == 1) {
                    return "Like";
                } else {
                    return "Likes";
                }
                break;
            case "Comments":
                if (input == 1) {
                    return "Comment";
                } else {
                    return "Comments";
                }
                break;
            case "Days":
                if (input == 1) {
                    return 'Day';
                } else {
                    return 'Days';
                }
                break;
            case "Countries Visited":
                if (input == 1) {
                    return 'Country Visited';
                } else {
                    return 'Countries Visited';
                }
                break;
            case "Reviews":
                if (input == 1) {
                    return 'Review';
                } else {
                    return 'Reviews';
                }
                break;
        }
    };
});

commontask.filter("getArrayOfSize", function () {
    return function (input, flag) {
        // console.log(input, flag);
        if (flag == "marked") {
            input = parseInt(input);
            return new Array(input);
        } else if (flag == "unmarked") {
            input = parseInt(input);
            var remainCount = 5 - input;
            return new Array(remainCount);
        }
    };
});
