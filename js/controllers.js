var globalGetProfile = function (data, status) {
    if (data.data._id) {
        $.jStorage.set("isLoggedIn", true);
        $.jStorage.set("profile", data.data);
        // console.log($.jStorage.get('profile'));
        console.log("Profile successfully set on jStorage");
    } else {
        $.jStorage.flush();
    }
};
var abc = {};

var pointsForLine = function () {};
var line = [];
var markers = [];
var travelPath;
var initMap = function () {};
var setMarker = function () {};
var map;
var center = {};
var centers = [];
markers[0] = {};
angular.module('phonecatControllers', ['templateservicemod', 'mylife', 'ongojourney', 'locallife', 'itinerary', 'agent', 'commontask', 'anchorSmoothScroll', 'activity', 'infinite-scroll', 'navigationservice', 'travelibroservice', 'cfp.loadingBar', 'ui.bootstrap', 'ui.select', 'ngAnimate', 'ngSanitize', 'angular-flexslider', 'angularFileUpload', 'ngImgCrop', 'mappy', 'wu.masonry', 'ngScrollbar', 'ksSwiper', 'ui.tinymce', 'ngFadeImgLoading', 'internationalPhoneNumber', 'ngIntlTelInput'])
    .run(['$anchorScroll', function ($anchorScroll) {
        $anchorScroll.yOffset = 50; // always scroll by 50 extra pixels
    }])

.controller('OnGoJourneyCtrl', function ($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $uibModal, $interval, OnGoJourney, LikesAndComments, $state, $stateParams, $filter, $http) {
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var journeyInfoStrip = $('.journey-info-strip').outerHeight();


    function calcWidth() {
        var width = $(window).width();
        var percent = 40;
        var newPadding = width * percent / 100;
        var newCarHolderWidth = (newPadding - 30);
        var newZoomCarHolder = newCarHolderWidth / 550;

        $scope.mapJourneyCss = {
            "padding-left": newPadding
        };
        $scope.cardHolderCss = {
            zoom: newZoomCarHolder
        }
        console.log(newPadding, width);
    };

    // $(window).resize(function(){

    // });
    if ($(window).width() > 991) {
        calcWidth();
    }
    $scope.ongoCard = true;

    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();
        if (Math.abs(lastScrollTop - st) <= delta)
            return;
        if (st > lastScrollTop && st > journeyInfoStrip) {
            // Scroll Down
            $('.journey-info-strip').addClass('remove-otgstrip').removeClass('get-otgstrip');
        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $('.journey-info-strip').addClass('get-otgstrip').removeClass('remove-otgstrip');
            }
        }
        lastScrollTop = st;
    }

    // set height on comment box
    // $(window).resize(function () {
    //   $('.listing-comment').height($(window).height() - 226);
    // })
    // set height on comment box end
    //Used to name the .html file
    var slug = $stateParams.id;
    var checkinCount = "";
    $scope.userData = $.jStorage.get("profile");

    var getOneJourneyCallback = function (journeys) {
        $scope.journey = journeys;
        TemplateService.title = $scope.journey.name + " - Travel Life | TraveLibro";
        var postsWithLatLng = [];
        postsWithLatLng = _.filter($scope.journey.post, 'latlong');
        _.each(postsWithLatLng, function (n, $index) {
            if (n && n.latlong && n.latlong.lat && n.latlong.long) {
                centers[$index] = {
                    "lat": parseFloat(n.latlong.lat),
                    "lng": parseFloat(n.latlong.long)
                };
            } else {}
        });
        if (journeys && journeys.location && journeys.location.lat) {
            var obj = {
                "lat": parseFloat(journeys.location.lat),
                "lng": parseFloat(journeys.location.long)
            }
            centers.unshift(obj);
        } else {}
        console.log(centers);
        initMap();

    };

    OnGoJourney.getOneJourney({
        "urlSlug": slug,
    }, getOneJourneyCallback, function (err) {
        console.log(err);
    });

    //change banner date and time starts
    $scope.time = {};
    $scope.datetime = {};
    $scope.changeBannerDate = function () {
        console.log("Banner Date");
        $scope.isPostDate = false;
        $scope.isBannerDate = true;
        date = $scope.journey.startTime;
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

        console.log($scope.journey.post[$scope.journey.post.length - 1].UTCModified);
        $scope.options = {
            minDate: new Date(1 / 1 / 1970),
            maxDate: new Date($scope.journey.post[$scope.journey.post.length - 1].UTCModified),
            showWeeks: false
        };
        modal = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/date-time.html",
            scope: $scope,
            backdropClass: "review-backdrop",
        })
    };

    $scope.updateBannerDateTime = function (id, formData, dt) {
        console.log(dt);
        var date = $filter('formatDateCalender')(dt);
        var time = $filter('formatTimeCalender')(formData);
        var result = {};
        var callback = function (data) {
            var formData = {
                "urlSlug": $scope.journey.urlSlug
            }
            OnGoJourney.getOneJourney(formData, function (journeys) {
                $scope.journey.startTime = journeys.startTime;
                modal.close();
                console.log(journeys);
            }, function (err) {
                console.log(err);
            });
        }
        result._id = id;
        result.startTime = new Date(date + " " + time);
        OnGoJourney.updateBannerDateTime(result, callback);
    };
    //change banner date and time ends
    // change ended journey date
    $scope.time = {};
    $scope.datetime = {};
    $scope.changeEndDate = function () {
        console.log("end journey Date");
        $scope.isPostDate = false;
        $scope.isBanner = false;
        $scope.isEndDate = true;
        date = $scope.journey.endTime;
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

        console.log($scope.journey.post[$scope.journey.post.length - 1].UTCModified);
        $scope.options = {
            minDate: new Date($scope.journey.post[$scope.journey.post.length - 1].UTCModified),
            maxDate: new Date(date),
            showWeeks: false
        };
        modal = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/date-time.html",
            scope: $scope,
            backdropClass: "review-backdrop",
        })
    };
    $scope.endJourneyDate = function (id, formData, dt) {
        console.log(dt);
        var date = $filter('formatDateCalender')(dt);
        var time = $filter('formatTimeCalender')(formData);
        var result = {};
        var callback = function (data) {
            var formData = {
                "urlSlug": $scope.journey.urlSlug
            }
            OnGoJourney.getOneJourney(formData, function (journeys) {
                $scope.journey.endTime = journeys.endTime;
                modal.close();
                console.log(journeys);
            }, function (err) {
                console.log(err);
            });
        }
        result._id = id;
        result.endTime = new Date(date + " " + time);
        OnGoJourney.endDateJourney(result, callback);
    };
    // change ended journey date end
    //maps integration starts here
    var mapStyle = [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#3e606f"
        }, {
            "weight": 2
        }, {
            "gamma": 0.84
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
            "weight": 0.6
        }, {
            "color": "#1a3541"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2c5a71"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#406d80"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2c5a71"
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#29768a"
        }, {
            "lightness": -37
        }]
    }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#406d80"
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2c3757"
        }]
    }]

    //latlongs format
    // var center = {
    //   lat: 19.089560,
    //   lng: 72.865614
    // };

    // var centers = [{
    //   lat: 19.089560,
    //   lng: 72.865614
    // }, {
    //   lat: 51.470022,
    //   lng: -0.454295
    // }, {
    //   lat: 29.276052,
    //   lng: -81.034910
    // }, {
    //   lat: 51.512072,
    //   lng: -0.144223
    // }, {
    //   lat: 52.923608,
    //   lng: -1.482560
    // }, {
    //   lat: 51.899603,
    //   lng: -1.153590
    // }, {
    //   lat: 51.470022,
    //   lng: -0.454295
    // }, {
    //   lat: 25.253175,
    //   lng: 55.365673
    // }];

    line = _.map(centers, function () {
        return {};
    });
    _.map(centers, function () {
        markers.push({});
    });


    initMap = function () {
        var $map = $('#map');
        var mapDim = {
            height: $map.height(),
            width: $map.width()
        }
        center = new google.maps.LatLng(centers[0].lat, centers[0].lng);
        if (typeof google === 'object' && typeof google.maps === 'object') {
            var bounds = new google.maps.LatLngBounds();

            setMarker = function (status, current, previous, i) {
                var currentPosition = new google.maps.LatLng(current.lat, current.lng);
                if (previous != null) {
                    console.log("previous should set now");
                    var previousPosition = new google.maps.LatLng(previous.lat, previous.lng);
                    // markers[i-1].setMap(null);
                    var previousObj = {
                            position: previousPosition,
                            map: map,
                            icon: "img/maps/red-marker.png"
                        }
                        // marker = new google.maps.Marker(previousObj);
                        // markers[i-1] = marker;
                }
                var currentObj = {
                    position: currentPosition,
                    map: map,
                    // icon: "img/maps/small-marker.png"
                };
                if (status == "small-marker") {
                    currentObj.icon = "img/maps/small-marker.png";
                } else if (status == "red-marker") {
                    currentObj.icon = "img/maps/red-marker.png";
                } else if (status == "green-marker") {
                    currentObj.icon = "img/maps/green-marker.png";
                } else if (status == null) {
                    currentObj.map = null;
                    currentObj.zIndex = i;
                }
                marker = new google.maps.Marker(currentObj);
                markers[i] = marker;
            };

            map = new google.maps.Map(document.getElementById('map'), {
                draggable: true,
                animation: google.maps.Animation.DROP,
                center: center,
                zoom: 4,
                styles: mapStyle,
                disableDefaultUI: true
            });

            var step = 0;
            var numSteps = 100; //Change this to set animation resolution
            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 0,
                scale: 3
            };
            // Grey static dotted - polylines starts here
            travelPath = new google.maps.Polyline({
                path: centers,
                geodesic: true,
                strokeColor: '#D3D3D3',
                strokeOpacity: 0,
                strokeWeight: -3,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
            });
            travelPath.setMap(map);
            // Grey static polylines ends here

            var myVar = setInterval(myTimer, 1000);

            function myTimer() {
                if (centers.length != 0) {
                    _.each(centers, function (n, index) {
                        setMarker(null, n, null, index + 1);
                    });
                    if ($scope.journey && $scope.journey.location && $scope.journey.location.lat) {
                        setMarker("green-marker", centers[0], null, 1);
                        markers[1].setMap(map);
                        markers[1].setIcon("img/maps/green-marker.png");
                    }
                    clearInterval(myVar);
                } else {
                    console.log("didnt got center");
                }
            };

            function getBoundsZoomLevel(bounds, mapDim) {
                var WORLD_DIM = {
                    height: 256,
                    width: 256
                };
                var ZOOM_MAX = 21;

                function latRad(lat) {
                    var sin = Math.sin(lat * Math.PI / 180);
                    var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
                    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
                }

                function zoom(mapPx, worldPx, fraction) {
                    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
                }

                var ne = bounds.getNorthEast();
                var sw = bounds.getSouthWest();

                var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

                var lngDiff = ne.lng() - sw.lng();
                var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

                var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
                var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

                return Math.min(latZoom, lngZoom, ZOOM_MAX);
            }

            function redLineDraw(i, departure, arrival, percentComplete, value, flag) {
                var xdiff = (centers[i].lat - centers[i - 1].lat);
                var ydiff = (centers[i].lng - centers[i - 1].lng);
                var currentZoom = currentZoom = map.getZoom();
                var commingZoom;
                if (value) {
                    var markerBounds = new google.maps.LatLngBounds();
                    markerBounds.extend(departure);
                    markerBounds.extend(arrival);
                    commingZoom = getBoundsZoomLevel(markerBounds, mapDim);
                    map.fitBounds(markerBounds);
                }
                var frac1 = xdiff / 100;
                var frac2 = ydiff / 100;
                var iniLat = centers[i - 1].lat;
                var iniLng = centers[i - 1].lng;
                var timePerStep = frac1; //Change this to alter animation speed
                var lineSymbol = {
                    path: 'M 0,-1 0,1',
                    // path: google.maps.SymbolPath.map - icon - airport,
                    strokeOpacity: 1,
                    scale: 3
                };
                if (percentComplete == 100 && flag) {
                    if (markers[i + 1].map == null) {
                        markers[i + 1].setMap(map);
                    }
                    markers[i + 1].setIcon("img/maps/green-marker.png");
                    markers[i].setIcon("img/maps/red-marker.png");
                } else if ((percentComplete > 98 && percentComplete < 100 && i == centers.length - 1)) {
                    if (markers[i + 1].map == null) {
                        markers[i + 1].setMap(map);
                    }
                    markers[i + 1].setIcon("img/maps/green-marker.png");
                    markers[i].setIcon("img/maps/red-marker.png");
                }

                if (_.isEmpty(line[i])) {
                    line[i] = new google.maps.Polyline({
                        path: [departure, departure],
                        // strokeColor: "#f2675b", //orange
                        // strokeColor: "#263757", //navy-blue
                        strokeColor: "#11d3cb", //navy-blue
                        // strokeOpacity: 1, --for continuous line
                        //   strokeWeight: 3,
                        strokeOpacity: 0, //for dotted lines
                        strokeWeight: 3,
                        icons: [{
                            icon: lineSymbol,
                            offset: '0', //set +ve val for moving trails
                            repeat: '20px'
                        }],
                        geodesic: true, //set to false if you want straight line instead of arc
                        map: map,
                    });
                }
                var drawLine = function (departure, arrival, percent, i, value) {
                    percentFrac = percent / 100;
                    var are_we_there_yet = google.maps.geometry.spherical.interpolate(departure, arrival, percentFrac);
                    line[i].setPath([departure, are_we_there_yet]);
                    // static center =center of departure and arrival starts
                    if (value) {
                        center = {
                            "lat": iniLat + (centers[i].lat - centers[i - 1].lat) / 2,
                            "lng": iniLng + (centers[i].lng - centers[i - 1].lng) / 2
                        }
                        center = new google.maps.LatLng(center.lat, center.lng);
                    }
                    // static center =center of departure and arrival ends
                    map.setCenter(center);
                };
                drawLine(departure, arrival, percentComplete, i, value);
            }
            pointsForLine = function (i, percentComplete, value, flag) {
                // i=currennt card comming from bottom / arrival card
                //value=true for identifyng current departure and arrival
                //flag=true only when percentComplete reaches 100
                console.log(i);
                var departure = new google.maps.LatLng(centers[i - 1].lat, centers[i - 1].lng); //Set to whatever lat/lng you need for your departure location
                var arrival = new google.maps.LatLng(centers[i].lat, centers[i].lng); //Set to whatever lat/lng you need for your arrival locationlat:
                step = 0;
                var linesCount = line.length - 1;
                for (markerCount = markers.length - 1; markerCount > 0; markerCount--) {
                    if ((value == true) && (percentComplete < 100)) {
                        if (markerCount == i) {
                            markers[markerCount].setIcon("");
                            if (markers[markerCount].map == null) {
                                markers[markerCount].setMap(map);
                            };
                            markers[markerCount].setIcon("img/maps/green-marker.png");
                        } else if (markerCount >= i) {
                            markers[markerCount].setMap(null);
                        } else if ((markerCount <= i)) {
                            if (markers[markerCount].map == null) {
                                markers[markerCount].setMap(map);
                            };
                            markers[markerCount].setIcon("img/maps/small-marker.png");
                        }
                    } else {
                        break;
                    }
                }
                redLineDraw(i, departure, arrival, percentComplete, value, flag);

                //clearPolyLines starts
                while ((linesCount >= (i + 1)) && (value)) {
                    if (!_.isEmpty(line[linesCount])) {
                        line[linesCount].setMap(null);
                        markers[linesCount].setMap(null);
                        line[linesCount] = {};
                    };
                    linesCount--;
                };
                //clearPolyLines ends

                //draw succeeding polyLines starts
                if (i > 1) {
                    pointsForLine(i - 1, 100);
                    count = centers.length;
                };
                //draw succeeding polyLines end
            };
        }
    };
    setTimeout(function () {
        initMap();
    }, 1000);
    //maps integration ends here

    $scope.template = TemplateService.changecontent("ongojourney");
    $scope.menutitle = NavigationService.makeactive("OnGoJourney");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    // EDIT KIND OF JOURNEY POPUP
    $scope.editKindOf = function () {
        $uibModal.open({
            animation: true,
            templateUrl: "views/modal/edit-kind-of-journey.html",
            scope: $scope,
            backdropClass: "review-backdrop",
        });
    };

    $scope.journeyType = [{
        img: "img/itinerary/adventure.png",
        caption: "Adventure",
        width: "25"
    }, {
        img: "img/itinerary/business.png",
        caption: "Business",
        width: "24"
    }, {
        img: "img/itinerary/family.png",
        caption: "Family",
        width: "30"
    }, {
        img: "img/itinerary/romance.png",
        caption: "Romance",
        width: "26"
    }, {
        img: "img/itinerary/budget.png",
        caption: "Budget",
        width: "22"
    }, {
        img: "img/itinerary/luxury.png",
        caption: "Luxury",
        width: "21"
    }, {
        img: "img/itinerary/religious.png",
        caption: "Religious",
        width: "26"
    }, {
        img: "img/itinerary/friend.png",
        caption: "Friends",
        width: "24"
    }, {
        img: "img/itinerary/shopping-white.png",
        caption: "Shopping",
        width: "24"
    }, {
        img: "img/itinerary/cap-white.png",
        caption: "Solo",
        width: "35"
    }, {
        img: "img/itinerary/speaker-white.png",
        caption: "Festival",
        width: "29"
    }, {
        img: "img/itinerary/backpacking.png",
        caption: "Backpacking",
        width: "23"
    }];
    // EDIT KIND OF JOURNEY POPUP END

    $scope.selectItinerary = function (val) {
        console.log(val);
        if ($scope.journeyType[val].activeClass == "active-itinerary") {
            console.log("inside if");
            $scope.journeyType[val].activeClass = "";
        } else {
            console.log("inside else");
            $scope.journeyType[val].activeClass = "active-itinerary";
        }
        console.log($scope.journeyType[val]);
    };

    $scope.viewCardComment = false;
    $scope.getCard = "";
    $scope.comment = {
        'text': ""
    };
    $scope.postScrollData = {};
    $scope.postScrollData.likePageNumber = 1;
    $scope.postScrollData.busy = false;
    $scope.postScrollData.stopCallingApi = false;
    $scope.postScrollData.viewList = false;
    $scope.getCommentsData = function (ongo) {
        console.log(ongo, 'ongo');
        $scope.post = ongo;
        $scope.previousId;
        $scope.viewCardLike = false;
        $scope.postScrollData.type = ongo.type;
        $scope.postScrollData._id = ongo._id;
        var callback = function (data) {
            $scope.uniqueArr = [];
            $scope.listOfComments = data.data;
            $scope.postScrollData.viewList = true;
            $scope.uniqueArr = _.uniqBy($scope.listOfComments.comment, 'user._id');
        }
        if ($scope.previousId != $scope.post._id) {
            // $scope.focus('enterComment');
            $scope.listOfComments = [];
            $scope.viewCardComment = true;
            $scope.journey.journeyHighLight = ongo._id;
            $scope.getCard = "view-whole-card";
            LikesAndComments.getComments(ongo.type, $scope.post._id, $scope.postScrollData.likePageNumber, callback);
        } else {
            if ($scope.viewCardComment) {
                $scope.viewCardComment = false;
                $scope.journey.journeyHighLight = "";
                $scope.getCard = "";
                $scope.comment.text = "";
            } else {
                $scope.listOfComments = [];
                $scope.viewCardComment = true;
                // $scope.focus('enterComment');
                $scope.journey.journeyHighLight = ongo._id;
                $scope.getCard = "view-whole-card";
                LikesAndComments.getComments(ongo.type, $scope.post._id, $scope.postScrollData.likePageNumber, callback);
            }
        }
        $scope.previousId = $scope.post._id;
    };
    $scope.getLikesData = function (ongo) {
        console.log('post ka click');
        $scope.postScrollData.type = ongo.type;
        $scope.postScrollData._id = ongo._id;
        $scope.viewCardComment = false;
        var callback = function (data) {
            $scope.postScrollData.viewList = true;
            $scope.listOfLikes = data.data;
            console.log($scope.listOfLikes);
        };
        console.log($scope.post);
        if ($scope.previousLikeId != ongo._id) {
            // $scope.focus('enterComment');
            $scope.listOfLikes = [];
            $scope.viewCardLike = true;
            $scope.journey.journeyHighLight = ongo._id;
            $scope.showLikeShow = "show-like-side-sec";
            LikesAndComments.getLikes(ongo.type, ongo._id, $scope.postScrollData.likePageNumber, callback);
        } else {
            if ($scope.viewCardLike) {
                $scope.viewCardLike = false;
                $scope.journey.journeyHighLight = "";
                $scope.getCard = "";
                $scope.showLikeShow = "";
            } else {
                $scope.listOfComments = [];
                $scope.viewCardLike = true;
                // $scope.focus('enterComment');
                $scope.journey.journeyHighLight = ongo._id;
                $scope.showLikeShow = "show-like-side-sec";
                LikesAndComments.getLikes(ongo.type, ongo._id, $scope.postScrollData.likePageNumber, callback);
            }
        }
        $scope.previousLikeId = ongo._id;
    };

    $scope.closeBackDrop = function () {
        $scope.viewCardComment = false;
        $scope.viewCardLike = false;
        $scope.journey.journeyHighLight = "";
        $scope.getCard = "";
        $scope.comment.text = "";
        $scope.showLikeShow = "";
        $scope.listOfLikes = [];
        $scope.listOfComments = [];
        $scope.postScrollData.likePageNumber = 1;
        $scope.postScrollData.busy = false;
        $scope.postScrollData.stopCallingApi = false;
        console.log($scope.postScrollData, 'post scroll data');
        $timeout(function () {
            $scope.postScrollData.likePageNumber = 1;
            $scope.listOfLikes = [];
            $scope.listOfComments = [];
            $scope.postScrollData.busy = false;
            $scope.postScrollData.stopCallingApi = false;
            $scope.postScrollData.viewList = false;
            console.log($scope.postScrollData, 'console wla post scroll data');
        }, 100);

    };
    $scope.focus = function (id) {
        console.log(id, "focus called");
        document.getElementById(id).focus();
        document.getElementById(id).select();
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

    $scope.tagButton = [{
        img: "img/profile.jpg",
        name: "Yash Chadasama (Me)"
    }, {
        img: "img/profile.jpg",
        name: "Amit Verma"
    }, ];
    // checkin end

    $scope.editOption = function (model) {
        $timeout(function () {
            model.backgroundClick = true;
            backgroundClick.object = model;
        }, 200);
        backgroundClick.scope = $scope;
    };

    // share whole trip social
    $scope.viewSocialShare = false;
    // $scope. = function () {
    //   if (!($.jStorage.get("isLoggedIn"))) {
    //     $state.go('login');
    //   } else {
    //     if ($scope.viewSocialShare == false) {
    //       $scope.viewSocialShare = true;
    //     } else {
    //       $scope.viewSocialShare = false;
    //     }
    //   }
    // };
    $scope.shareSocial = function () {
        if ($scope.viewSocialShare == false) {
            $scope.viewSocialShare = true;
        } else {
            $scope.viewSocialShare = false;
        }
    };
    // share whole trip social end

    // share single trip / card
    $scope.viewSingleTrip = -1;
    $scope.shareTrip = function (index) {
        console.log($scope.viewSingleTrip);
        if ($scope.viewSingleTrip == index) {
            $scope.viewSingleTrip = -1;
        } else {
            $scope.viewSingleTrip = index;
        }
    };
    // share single trip / card  end


    $scope.format = "yyyy/MM/dd";

    // edit journey name starts
    $scope.editName = {};
    $scope.nameJourney = function (name) {
        console.log(name);
        $scope.editName.name = name;
        modal = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/journey-name.html",
            scope: $scope,
            backdropClass: "review-backdrop"
        });
    };
    $scope.editJourneyName = function (id, obj) {
        var formData = {
            "_id": id,
            "name": obj.name
        };
        var callback = function (name) {
            $scope.journey.name = name;
            modal.close();
        };
        OnGoJourney.editJourneyName(formData, callback);
    };
    // edit journey name end

    //edit journey cover photo
    $scope.coverPhoto = function (id) {
        modal = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/journey-cover.html",
            scope: $scope,
            backdropClass: "review-backdrop",
            windowClass: "cover-modal"
        });

        var formData = {
            "_id": id,
            "type": "photos"
        };
        var callback = function (photos) {
            $scope.journeyCoverPhotos = photos;
        };
        OnGoJourney.getJourneyCoverPhoto(formData, callback);
    };

    $scope.setJourneyCoverPhoto = function (id, coverPhoto) {
            var formData = {
                "_id": id,
                "coverPhoto": coverPhoto
            };
            var callback = function () {
                modal.close();
            }
            OnGoJourney.setJourneyCoverPhoto(formData, callback);
        }
        // cover photo end
    $scope.cropCover = function (imgCrop) {
        $scope.showCover = imgCrop;
        $scope.cropImage = true;
    };
    $scope.viewPrev = function () {
        $scope.cropImage = false;
    };

    // edit date and time
    // $scope.changeDate = function () {
    //   //alert();
    //   $scope.options = {
    //     minDate:new Date(1/1/1970),
    //     showWeeks: false
    //   };
    //   $uibModal.open({
    //     animation: true,
    //     templateUrl: "views/modal/date-time.html",
    //     scope: $scope,
    //     backdropClass: "review-backdrop",
    //   });
    // };
    // edit date and time end

    setTimeout(function () {
        $('.flexslider').flexslider({
            itemMargin: 5,
            itemWidth: 99,
            animation: "slide",
            controlNav: false,
        });
    }, 100);

    // country modal
    var modal = "";

    $scope.review = {};

    $scope.countryReview = function () {
        $scope.reviewCountryCount = 0;
        console.log($scope.journey);
        var len = $scope.journey.countryVisited.length;
        console.log(len);
        if (len !== 0 && ($scope.reviewCountryCount < len)) {
            $scope.review.fillMeIn = $scope.journey.review[$scope.reviewCountryCount].review;
            $scope.review.rate = $scope.journey.review[$scope.reviewCountryCount].rating;
        }
        modal = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/review-country.html",
            scope: $scope,
            backdropClass: "review-backdrop",
        });
        modal.closed.then(function () {

        })
    };

    // country modal ends

    $scope.rateThisCountry = function (journeyId, countryId, formData, currentIndex) {
        console.log(currentIndex);
        var result = {
            journey: journeyId,
            country: countryId,
            review: formData.fillMeIn,
            rating: formData.rate.toString()
        };
        var callback = function () {
            $scope.journey.review[currentIndex].review = result.review;
            $scope.journey.review[currentIndex].rating = result.rating;
        };
        OnGoJourney.rateThisCountry(result, callback);
        $scope.reviewCountryCount = $scope.reviewCountryCount + 1;
        var len = $scope.journey.countryVisited.length;
        if ($scope.reviewCountryCount < len) {
            if (($scope.journey.review.length > $scope.reviewCountryCount)) {
                $scope.review.fillMeIn = $scope.journey.review[$scope.reviewCountryCount].review;
                $scope.review.rate = $scope.journey.review[$scope.reviewCountryCount].rating;
            } else {
                $scope.review.fillMeIn = "";
                $scope.review.rate = 1;
            }
        } else {
            console.log(modal);
            modal.close();
        }
        //  test=$scope.journey.review[$scope.reviewCountryCount].review
        // $scope.review.fillM=test;
        // console.log($scope.review.fil);
        // $scope.review.fillMeIn=$scope.journey.review[$scope.reviewCountryCount].review;
    };
    // Rating country ends
    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
    };
    $scope.ratingStates = [{
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }];
    $scope.getslide = "travel-out";
    $scope.openTravelTrip = function () {
        if ($scope.getslide == "travel-in") {
            $scope.getslide = "travel-out";
        } else {
            $scope.getslide = "travel-in";
        }
    };
    // $scope.followFollowing = function (user) {
    //   if (user.following) {
    //     LikesAndComments.unFollowUser(user._id, function (data) {
    //       if (data.value) {
    //         user.following = false;
    //       } else {
    //         console.log(data.data);
    //       }
    //     })
    //   } else {
    //     LikesAndComments.followUser(user._id, user.name, function (data) {
    //       console.log(data);
    //       if (data.value) {
    //         user.following = true;
    //       } else {
    //         console.log(data.data);
    //       }
    //     });
    //   }
    // }

    // $scope.followFollowing = function (user) {
    //   console.log("from ongojourney");
    //   LikesAndComments.followUnFollow(user, function (data) {
    //     if (data.value) {
    //       user.following = data.data.responseValue;
    //     } else {
    //       console.log("error updating data");
    //     }
    //   });
    // }


})

.controller('MylifeCtrl', function ($scope, $state, $stateParams, TemplateService, NavigationService, cfpLoadingBar, TravelibroService, $timeout, $uibModal, $location, $filter, MyLife, OnGoJourney, localLife, LikesAndComments, $anchorScroll, anchorSmoothScroll, $location) {
    //Used to name the .html file
    $scope.template = TemplateService.changecontent("mylife");
    $scope.menutitle = NavigationService.makeactive("Mylife");
    $scope.navigation = NavigationService.getnav();

    $scope.localView = {};
    $scope.localView.view = true;
    $scope.showTravellife = false;
    $scope.visited = [];
    var allMyLife = [
        "views/content/myLife/journey.html",
        "views/content/myLife/moments.html",
        "views/content/myLife/reviews.html",
        "views/content/myLife/holidayplanner.html"
    ];
    $scope.myLife = {
        profileMain: "views/content/myLife/profile.html",
        innerView: allMyLife[0]
    };
    $scope.viewTab = 1;
    $scope.isMine = $.jStorage.get("isMine");
    var pageNo = 0;
    $scope.scroll = {
        busy: false
    };
    $scope.travelLife = [];
    var allowAccess = false;
    $scope.allowAccess = allowAccess;
    $scope.isLoggedIn = $.jStorage.get("isLoggedIn");
    $scope.isopen = false;
    var modal = "";
    var arr = [];
    $scope.obj = {};
    $scope.level = "";
    $scope.viewMonth = false;
    $scope.momentView = 1;
    $scope.album = {};
    $scope.allPhotos = {};
    $scope.allPhotos.photoSliderIndex = "";
    $scope.allPhotos.photoSliderLength = "";
    $scope.allPhotos.newArray = [];
    $scope.oneAtATime = true;
    var wholePost = {};
    $scope.reviewView = 1;
    $scope.mapPathData = window._mapPathData;
    $scope.heatmapColors = ['#2c3757', '#ff6759'];


    $scope.reviewAll = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "all",
        "pageNo": 1
    };
    $scope.reviewTravelLife = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "travel-life",
        "pageNo": 1
    };
    $scope.reviewLocalLife = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "local-life",
        "pageNo": 1
    };
    $scope.data = {
        'bucketList': {
            metric: 0
        },
        'countryVisited': {
            metric: 1
        }
    };
    $scope.mystyle1 = {
        "width": "0",
        "background-color": "#ff6759",
    };
    $scope.mystyle2 = {
        "width": "0",
        "background-color": "#ff6759",
    };
    $scope.mystyle3 = {
        "width": "0",
        "background-color": "#ff6759",
    };
    $scope.mystyle4 = {
        "width": "0",
        "background-color": "#ff6759",
    };
    $scope.allMoments = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "all"
    };
    $scope.travelLifeMoments = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "travel-life",
        "pageNo": 1
    };
    $scope.localLifeMoments = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "local-life"
    };
    $scope.ratingStates = [{
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }];


    //LOCAL LIFE
    $scope.scroll2 = {};
    $scope.scroll2.busy = false;
    $scope.scroll2.stopCallingApi = false;
    $scope.localLifeJourney = [];
    $scope.localDate = [];
    $scope.localFilterPost = {};
    $scope.localFilterPost.checkInType = [];
    $scope.localFilterPost.type = "local-life";
    $scope.localFilterPost.pagenumber = 1;
    $scope.localFilterPost.month = 0;
    $scope.localFilterPost.year = 0;
    $scope.localFilterPost.rating = [];
    $scope.localFilterPost.photos = false;
    $scope.localFilterPost.videos = false;
    $scope.localFilterPost.thoughts = false;
    $scope.localStar = {};
    $scope.localStar.fiveStar = false;
    $scope.localStar.fourStar = false;
    $scope.localStar.threeStar = false;
    $scope.localStar.twoStar = false;
    $scope.localStar.oneStar = false;
    $scope.showTravellife = true;
    $scope.showLocalLife = true;
    $scope.localCategory = [];
    $scope.localPostCount = {};
    $scope.viewLocal = true;
    $scope.showLikeCommentCard = true;
    $scope.comment = {
        "text": ""
    };
    $scope.audioStatus = {
        on: false
    };
    //LOCAL LIFE END




    setInterval(function () {
        $scope.paginationLoader = TemplateService.paginationLoader;
    }, 300);

    $scope.likeUnlikeActivity = function (activity) {
        console.log(activity.likeUnlikeFlag, activity.uniqueId, activity._id);
        console.log(activity.likeDone + "this call is from journey.html");
        activity.likeDone = !activity.likeDone;
        console.log(activity.likeUnlikeFlag);
        if (activity.likeDone) {
            if (activity.likeCount == undefined) {
                activity.likeCount = 1;
            } else {
                activity.likeCount = activity.likeCount + 1;
            }
            LikesAndComments.likeUnlike(activity.type, "like", activity.uniqueId, activity._id, null)
        } else {
            activity.likeCount = activity.likeCount - 1;
            LikesAndComments.likeUnlike(activity.type, "unlike", activity.uniqueId, activity._id, null)
        }
    };

    function setMoreAboutMe() {
        // console.log("entered if");
        $scope.pronoun; //for he and she
        $scope.pronoun1; //for him and her
        $scope.userName = titleCase($scope.userData.firstName);
        $scope.kindOfHoliday = $scope.userData.travelConfig.kindOfHoliday[0];
        $scope.usuallyGo = $scope.userData.travelConfig.usuallyGo[0];
        $scope.flag = false;

        var blogIndex = $scope.userData.travelConfig.preferToTravel.indexOf("Blogger");
        var photoIndex = $scope.userData.travelConfig.preferToTravel.indexOf("Photographer");

        if (blogIndex != -1) {
            $scope.preferToTravel = $scope.userData.travelConfig.preferToTravel[blogIndex];
        } else if (photoIndex != -1) {
            $scope.preferToTravel = $scope.userData.travelConfig.preferToTravel[photoIndex];
        } else {
            $scope.preferToTravel = $scope.userData.travelConfig.preferToTravel[0];
        }

        $scope.idealHoliday = $scope.userData.travelConfig.holidayType[0];

        if ($scope.userData.gender == "male") {
            $scope.pronoun = "he";
            $scope.pronoun1 = "him";
        } else if ($scope.userData.gender == "female") {
            $scope.pronoun = "she";
            $scope.pronoun1 = "her";
        } else {
            $scope.pronoun = "They";
            $scope.pronoun1 = "Them";
        }

        if ($scope.usuallyGo == "By the map ") {
            $scope.usuallyGo = "by the map";
        } else if ($scope.usuallyGo == "Where the road takes you") {
            $scope.usuallyGo = "where the road takes " + $scope.pronoun1;
        } else if ($scope.usuallyGo == "A little bit of both") {
            $scope.flag = true;
            $scope.usuallyGo = "by the map or ";
            $scope.usuallyGo1 = "where the road takes " + $scope.pronoun1;
        }
        if (($scope.preferToTravel == "Blogger") || ($scope.preferToTravel == "Photographer")) {
            $scope.intermediate = "is a ";
        } else {
            if (($scope.preferToTravel == "Family") || ($scope.preferToTravel == "Friends")) {
                $scope.intermediate = "prefers to travel with "
            } else if ($scope.preferToTravel == "Business") {
                $scope.intermediate = "prefers to travel on ";
            } else if ($scope.preferToTravel == "Group Tour") {
                $scope.intermediate = "prefers to travel on a ";
            } else if ($scope.preferToTravel == "Partner/Spouse") {
                $scope.intermediate = "prefers to travel with their";
                $scope.preferToTravel = "Partner";
            } else if ($scope.preferToTravel == "Solo") {
                $scope.intermediate = "prefers to travel ";
            }
        }
    };
    // backgroundClick
    $scope.editOption = function (model) {
        $timeout(function () {
            model.backgroundClick = true;
            backgroundClick.object = model;
        }, 200);
        backgroundClick.scope = $scope;
    };
    //backgroundClick end
    function reloadCount() {
        NavigationService.getProfile($.jStorage.get("activeUrlSlug"), function (data, status) {
            $scope.userData = data.data;
            // console.log($scope.userData.countriesVisited_count);
            updateBadgeBar($scope.userData.countriesVisited_count);
        }, function (err) {
            console.log(err);
        });
    };


    $scope.data = {
        'bucketList': {
            metric: 0
        },
        'countryVisited': {
            metric: 1
        }
    };

    $scope.openMyLifeFilter = function () {
        $scope.isopen = !$scope.isopen;
    };

    $scope.getMap = function () {
        // console.log("GET MAP CALLED");
        var bucket = _.filter($scope.nationality, "bucketList");
        var otherData = {
            'bucketList': {
                metric: 0
            },
            'countryVisited': {
                metric: 1
            }
        };
        _.each(bucket, function (country) {
            _.each(window._mapPathData.paths, function (map, key) {
                if (country.name == map.name) {
                    otherData[key] = {
                        metric: 0
                    };
                    return;
                }
            });
        });
        var countryVisited = _.filter($scope.nationality, "countryVisited");
        _.each(countryVisited, function (country) {
            _.each(window._mapPathData.paths, function (map, key) {
                if (country.name == map.name) {
                    otherData[key] = {
                        metric: 1
                    };
                    return;
                }
            });

        });
        $timeout(function () {
            $scope.data = otherData;
        }, 100);
    };

    var getAllCountries = function (countries) {
        $scope.nationality = countries;
        $scope.getMap();
    };

    MyLife.getAllCountries(getAllCountries, function (err) {
        console.log(err);
    });
    $scope.updateBucketList = function (country) {
        MyLife.updateBucketList(country, function (data, status) {
            reloadCount();
        }, function () {});
        $scope.getMap();
    };

    //update countries visited starts
    var years = function (startYear) {
        var currentYear = new Date().getFullYear(),
            years = [];
        startYear = startYear || 1980;
        while (startYear <= currentYear) {
            years.push(currentYear--);
        }
        return years;
    };
    $scope.listOfYears = years(1950);

    $scope.checkIfSelected = function (list) {
        if (list.year) {
            list.times = 1;
            $scope.disableAll = false;
        } else {
            list.times = 0;
            $scope.disableAll = true;
        }
    };
    $scope.updateCountryVisited = function (country) {
        $scope.obj.countryId = country._id;
        if (country.countryVisited === true) {
            arr = [{}];
            modal = $uibModal.open({
                scope: $scope,
                animation: true,
                windowClass: "delete-visited-country",
                templateUrl: "views/modal/delete-visited-country.html"
            });
        } else {
            $scope.visited = [];
            arr = [];
            modal = $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: "views/modal/country-visited.html"
            });
        }

        //remove country visited and all its count starts
        $scope.removeCountryVisited = function () {
            var obj = {
                "countryId": country._id,
                "visited": []
            }
            MyLife.updateCountriesVisited(obj, function (data, status) {
                reloadCount();
                modal.close();
            }, function () {});
            arr = [];
            $scope.getMap();
        };
        //remove country visited and all its count ends

        $scope.getMap();
        modal.closed.then(function () {
            console.log(_.isEmpty(arr));
            if (_.isEmpty(arr)) {
                country.countryVisited = false;
            } else {
                country.countryVisited = true;
            }
        });
    };

    $scope.clearAllSelected = function (visited) {
        $scope.visited = [];
    };

    $scope.updateNumOfTimes = function (visited) {
        modal.close();
        //applying validations and filters starts
        arr = _.pull(visited, undefined);
        arr = _.reject(arr, {
            'year': false
        });
        arr = _.filter(arr, 'times');
        arr = _.reject(arr, {
            'times': 0
        });
        //applying validations and filters ends

        $scope.obj.visited = arr;
        if (!(_.isEmpty($scope.obj.visited))) {
            MyLife.updateCountriesVisited($scope.obj, function (data, status) {
                reloadCount();
            }, function () {});
            $scope.getMap();
        }
    };
    //update countries visited ends
    // Little more about me starts here
    function titleCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.obj.visited = arr;
    if (!(_.isEmpty($scope.obj.visited))) {
        MyLife.updateCountriesVisited($scope.obj, function (data, status) {
            reloadCount();
        }, function () {});
        $scope.getMap();
    }
    //update countries visited ends
    // Little more about me starts here
    function titleCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    // Little more about me ends here
    //userBadge starts here
    var updateBadge = function (len) {
        if (len < 4) {
            $scope.userBadgeName = "img/newbie.png";
        } else if ((len > 3) && (len < 8)) {
            $scope.userBadgeName = "img/Just-got-wings.png";
        } else if ((len > 8) && (len < 16)) {
            $scope.userBadgeName = "img/Globe-Trotter.png";
        } else if ((len > 16) && (len < 25)) {
            $scope.userBadgeName = "img/wayfarer.png";
        } else if (len >= 25) {
            $scope.userBadgeName = "img/nomad.png";
        }
    };
    //userBadge ends here


    $scope.level = "";
    $scope.mystyle1 = {
        "width": "0",
        "background-color": "#ff6759",
    };
    $scope.mystyle2 = {
        "width": "0",
        "background-color": "#ff6759",
    };
    $scope.mystyle3 = {
        "width": "0",
        "background-color": "#ff6759",
    };
    $scope.mystyle4 = {
        "width": "0",
        "background-color": "#ff6759",
    };
    //userBadge ends here

    var updateBadgeBar = function (len) {
            if (len < 4) {
                $scope.level = 1;
                $scope.userBadgeName = "img/newbie.png";
                $scope.mystyle1 = {
                    "width": (len / 3) * 100 + '%',
                    "background-color": "#ff6759",
                };
                $scope.mystyle2.width = "0";
                $scope.mystyle3.width = "0";
                $scope.mystyle4.width = "0";
            } else if (len < 8) {
                $scope.level = 2;
                $scope.userBadgeName = "img/Just-got-wings.png";
                $scope.mystyle1 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle2 = {
                    "width": ((len - 3) / 4) * 100 + '%',
                    "background-color": "#ff6759",
                };
                $scope.mystyle3.width = "0";
                $scope.mystyle4.width = "0";
            } else if (len < 16) {
                $scope.level = 3;
                $scope.userBadgeName = "img/Globe-Trotter.png";
                $scope.mystyle1 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle2 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle3 = {
                    "width": ((len - 7) / 8) * 100 + '%',
                    "background-color": "#ff6759",
                };
                $scope.mystyle4.width = "0";
            } else if (len < 25) {
                $scope.level = 4;
                $scope.userBadgeName = "img/wayfarer.png";
                $scope.mystyle1 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle2 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle3 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle4 = {
                    "width": ((len - 15) / 9) * 100 + '%',
                    "background-color": "#ff6759",
                };
            } else if (len > 24) {
                $scope.level = 5;
                $scope.userBadgeName = "img/nomad.png";
                $scope.mystyle1 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle2 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle3 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle4 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
                $scope.mystyle5 = {
                    "width": "100%",
                    "background-color": "#ff6759",
                };
            }
        }
        //badge-bar ends here
        // routing to on-the-go,detailed-iti,quick-iti
    $scope.routeTO = function (type, urlSlug, userSlug) {
        console.log(type, urlSlug, userSlug);
        if (type == "on-the-go-journey" || type == "ended-journey") {
            $state.go('ongojourney', {
                'id': urlSlug,
                'urlSlug': userSlug
            });
        } else if (type == "quick-itinerary") {
            $state.go('userquickitinerary', {
                'id': urlSlug,
                'urlSlug': userSlug
            });
        } else if (type == 'detail-itinerary') {
            $state.go('userdetailitinerary', {
                'id': urlSlug,
                'urlSlug': userSlug
            });
        }
    };
    // routing to on-the-go,detailed-iti,quick-iti ends here

    // followFollowing  Function
    $scope.followFollowing = function (user) {
            LikesAndComments.followUnFollow(user, function (data) {
                if (data.value) {
                    user.following = data.data.responseValue;
                } else {
                    console.log("error updating data");
                }
            });
        }
        // followFollowing  Function END

    //moment Integration starts here
    $scope.allMoments = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "all"

    };
    $scope.travelLifeMoments = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "travel-life",
        "pageNo": 1
    };
    $scope.localLifeMoments = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "local-life"
    };
    var getMoments = function () {
        $scope.allMoments.scrollBusy = true;
        $scope.travelLifeMoments.scrollBusy = true;
        $scope.localLifeMoments.scrollBusy = true;
        console.log("getAllMoments called");
        MyLife.getAllMoments("", 36, "all", 3, function (data) {
            $scope.allMoments = {
                "arr": data.data,
                "scrollBusy": false,
                "stopCallingApi": false,
                "type": "all"
            };
        }, function (data) {
            console.log(data);
        });
        MyLife.getTravelLifeMoments("travel-life", 1, function (data) {
            $scope.travelLifeMoments = {
                "arr": data.data,
                "scrollBusy": false,
                "stopCallingApi": false,
                "type": "travel-life",
                "pageNo": 1
            };
            // $scope.travelLifeMoments = data.data;
        }, function (data) {
            console.log(data);
        });
        MyLife.getAllMoments("", 5, "local-life", 3, function (data) {
            $scope.localLifeMoments = {
                "arr": data.data,
                "scrollBusy": false,
                "stopCallingApi": false,
                "type": "local-life"
            };
            // $scope.localLifeMoments = data.data;
        }, function (data) {
            console.log(data);
        })
    };
    $scope.getMoreMoments = function (moment) {
        if (moment.scrollBusy) {
            return;
        } else {
            if (moment.stopCallingApi) {
                return;
            } else {
                switch (moment.type) {
                    case 'all':
                    case 'local-life':
                        if (moment.arr.length == 0) {
                            return;
                        } else {
                            var lastToken = moment.arr[moment.arr.length - 1].token;
                            console.log(lastToken);
                            if (lastToken == -1) {
                                moment.stopCallingApi = true;
                                console.log("no data so calling api is closed");
                            } else {
                                moment.scrollBusy = true;
                                MyLife.getAllMoments(lastToken, 36, moment.type, 3, function (data) {
                                    moment.scrollBusy = false;
                                    _.each(data.data, function (n) {
                                        if (n.token == -1) {
                                            moment.stopCallingApi = true;
                                        } else {
                                            moment.arr.push(n);
                                        }
                                    });
                                }, function (data) {
                                    moment.scrollBusy = false;
                                    moment.stopCallingApi = false;
                                });
                            }
                        }
                        break;
                    case 'travel-life':
                        console.log("inside case 2");
                        moment.scrollBusy = true;
                        MyLife.getTravelLifeMoments("travel-life", ++moment.pageNo, function (data) {
                            moment.scrollBusy = false;
                            if (data.data.length == 0) {
                                moment.stopCallingApi = true;
                            } else {
                                _.each(data.data, function (n) {
                                    moment.arr.push(n);
                                });
                            }
                            console.log(data);
                        }, function (data) {
                            console.log(data);
                            moment.scrollBusy = false;
                            moment.stopCallingApi = false;
                            --moment.pageNo;
                        });
                        break;
                    default:
                        console.log("No Match Found");
                }
            }
        }
    };
    $scope.getMorePhotos = function (album) {
        console.log(album);
        if (album.scrollBusy) {
            return;
        } else {
            if (album.stopCallingApi) {
                return
            } else {
                album.pageNo++;
                album.scrollBusy = true;
                switch (album.type) {
                    case ('journey' || 'itinerary'):
                        console.log("getJournItiMoments called by scrolling");
                        MyLife.getJournItiMoments(album._id, album.pageNo, 24, album.type, function (data) {
                            album.scrollBusy = false;
                            if (data.data.length !== 0) {
                                _.each(data.data, function (n) {
                                    album.perMonthMoments.push(n);
                                });
                            } else {
                                album.stopCallingApi = true;
                            }
                        }, function (data) {
                            console.log(data);
                            album.scrollBusy = false;
                            album.stopCallingApi = false;
                            --album.pageNo;
                        });
                        break;
                    case 'all':
                    case 'local':
                        console.log("getPerMonthMoments called by scrolling");
                        MyLife.getPerMonthMoments(album.token, album.pageNo, 24, album.type, function (data) {
                            album.scrollBusy = false;
                            if (data.data.length !== 0) {
                                _.each(data.data, function (n) {
                                    album.perMonthMoments.push(n);
                                });
                            } else {
                                album.stopCallingApi = true;
                            }
                        }, function (data) {
                            console.log(data);
                            album.scrollBusy = false;
                            album.stopCallingApi = false;
                            --album.PageNo;
                        });
                        break;
                }
            }
        }
    };
    $scope.changeMomentTypeView = function (num) {
        $scope.viewMonth = false;
        $scope.momentView = num;
    };
    $scope.showMonthView = function () {
        console.log("showMonthView called", $scope.viewMonth);
        if ($scope.viewMonth == false) {
            $scope.viewMonth = true;
        } else {
            $scope.viewMonth = false;
        }
    };

    var viewMonthDataCallback = function (data) {
        // $scope.perMonthMoments = data.data;
        $scope.album.perMonthMoments = data.data;
        $scope.album.scrollBusy = false;
        console.log($scope.album.perMonthMoments);
    };
    $scope.getPerMonthMoments = function (obj, type) {
        console.log("getPerMonthMoments called by ng-click");
        $scope.token = obj.token;
        $scope.count = obj.count;
        $scope.album = {
            "token": obj.token,
            "pageNo": 1,
            "scrollBusy": true,
            "type": type,
            "stopCallingApi": false,
            "perMonthMoments": []
        };
        // $scope.perMonthMoments = [];
        MyLife.getPerMonthMoments($scope.album.token, 1, 24, $scope.album.type, viewMonthDataCallback, function (data) {
            console.log(data);
        });
        $scope.showMonthView();
    };

    //Photo comment popup
    $scope.getPhotosCommentData = function (photoId, index, length, array) {
        // $scope.userProfilePic = $.jStorage.get("profile").profilePicture;
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
            controller: 'photoCommentModalCtrl',
            scope: $scope,
            windowClass: "notify-popup"
        });
        modal.closed.then(function () {
            $scope.listOfComments = {};
        });
        LikesAndComments.openPhotoPopup(photoId, $scope);
    };
    //Photo comment popup end

    $scope.getJournItiMoments = function (obj) {
        // $scope.perMonthMoments = [];
        console.log("getJournItiMoments called by ng-click");
        $scope.token = obj.name;
        $scope.count = obj.mediaCount;
        $scope.album = {
            "_id": obj._id,
            "pageNo": 1,
            "scrollBusy": true,
            "stopCallingApi": false,
            "perMonthMoments": []
        };
        $scope.type = obj.type;
        var flag = obj.type && obj.type != ''
        if (flag) {
            $scope.album.type = 'itinerary';
        } else {
            $scope.album.type = 'journey';
        }
        // $scope.albumPageNo = 1;
        MyLife.getJournItiMoments(obj._id, 1, 24, $scope.album.type, viewMonthDataCallback, function (data) {
            console.log(data);
        });
        $scope.showMonthView();
    };
    //moment Integration ends here

    // reviews json
    var flushReviewsData = function () {
        $scope.postReview = {};
        $scope.showRating = 1;
        $scope.postReview.rating = 1;
        $scope.fillColor2 = "";
        $scope.fillColor3 = "";
        $scope.fillColor4 = "";
        $scope.fillColor5 = "";
    }
    var wholePost = {};
    $scope.getReview = function (post) {
        console.log(post);
        wholePost = post; //this is to set post_id in savePostReview() function
        console.log(wholePost);
        $scope.postReview = {};
        $scope.checkIn = post.checkIn; // this is to diplay checkin location inside uib modal
        $scope.checkIn.type = post.type;
        if (post.review.length !== 0) {
            console.log("Edit Rating");
            $scope.postReview = _.cloneDeep(post.review[0]);
            if ($scope.postReview.rating != undefined) {
                $scope.starRating(parseInt($scope.postReview.rating));
            } else {

            }
        } else {
            console.log("Rate Us");
            flushReviewsData();
        }
        modal = $uibModal.open({
            animation: true,
            templateUrl: "views/modal/review-post.html",
            scope: $scope,
            backdropClass: "review-backdrop"
        })
    };

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


    //reviews integration starts here
    $scope.changeReviewTypeView = function (num, type) {
        $scope.reviewView = num;
        $scope[type] = false;
    };

    $scope.reviewAll = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "all",
        "pageNo": 1
    };
    $scope.reviewTravelLife = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "travel-life",
        "pageNo": 1
    };
    $scope.reviewLocalLife = {
        "arr": [],
        "scrollBusy": false,
        "stopCallingApi": false,
        "type": "local-life",
        "pageNo": 1
    };
    var getReviews = function () {
        console.log("getAllReviews called after loading");
        $scope.reviewAll.scrollBusy = true;
        MyLife.getAllReviews("all", 1, function (data) {
            $scope.reviewAll = {
                "arr": data.data,
                "scrollBusy": false,
                "stopCallingApi": false,
                "type": "all",
                "pageNo": 1

            };
            console.log($scope.allMoments);
        }, function (data) {
            console.log(data);
        });
        MyLife.getAllReviews("travel-life", 1, function (data) {
            console.log(data);
            $scope.reviewTravelLife = {
                "arr": data.data,
                "scrollBusy": false,
                "stopCallingApi": false,
                "type": "travel-life",
                "pageNo": 1
            };
            // $scope.travelLifeMoments = data.data;
            console.log($scope.travelLifeMoments);
        }, function (data) {
            console.log(data);
        });
        MyLife.getAllReviews("local-life", 1, function (data) {
            console.log(data);
            $scope.reviewLocalLife = {
                "arr": data.data,
                "scrollBusy": false,
                "stopCallingApi": false,
                "type": "local-life",
                "pageNo": 1
            };
            // $scope.localLifeMoments = data.data;
        }, function (data) {
            console.log(data);
        })
    };

    $scope.getAllReviews = function (review) {
        if (review.scrollBusy) {
            return;
        } else {
            if (review.stopCallingApi) {
                return;
            } else {
                console.log("passed 2 if");
                review.scrollBusy = true;
                MyLife.getAllReviews(review.type, ++review.pageNo, function (data) {
                    review.scrollBusy = false;
                    if (data.data.length == 0) {
                        console.log("reviews is empty");
                        review.stopCallingApi = true;
                        review.pageNo--;
                    } else {
                        _.each(data.data, function (n) {
                            review.arr.push(n);
                        });
                    }
                }, function (data) {
                    console.log(data);
                    review.scrollBusy = false;
                    review.stopCallingApi = false;
                    --review.pageNo;
                });
            }
        }
    };

    $scope.getMoreReviews = function (object, flag) {
        console.log("getReviews called from getMoreReviews");
        if (object.country && object._id && object.pageNo) {
            if (object.scrollBusy) {
                return;
            } else {
                if (object.stopCallingApi) {
                    return
                } else {
                    object.scrollBusy = true;
                    switch (flag) {
                        case 'travel-life':
                            MyLife.getReviewsByCities(object.country, object._id, ++object.pageNo, function (data) {
                                if (data.value) {
                                    object.scrollBusy = false;
                                    if (data.data.length == 0) {
                                        object.stopCallingApi = true;
                                    } else {
                                        _.each(data.data, function (n) {
                                            object.accordReview.push(n);
                                        })
                                    }
                                } else {}
                            }, function (data) {
                                console.log(data);
                                object.scrollBusy = false;
                                object.stopCallingApi = false;
                                --object.pageNo;
                            });
                            break;
                        case 'local-life':
                            MyLife.getReviewsByCategories(object.city, object._id, object.pageNo, function (data) {
                                if (data.value) {
                                    object.scrollBusy = false;
                                    if (data.data.length == 0) {
                                        object.stopCallingApi = true;
                                    } else {
                                        _.each(data.data, function (n) {
                                            object.accordReview.push(n);
                                        })
                                    }
                                } else {}
                            }, function (data) {
                                console.log(data);
                                object.scrollBusy = false;
                                object.stopCallingApi = false;
                                --object.pageNo;
                            });
                            break;
                    }

                }
            }
        } else {
            console.log("insufficient parameters");
        }
    }

    $scope.goToAccordian = function (review, showType) {
        $scope[showType] = true;
        switch (showType) {
            case 'viewTravelCountry':
                $scope.citiesTravelled = {
                    "countryName": review.name,
                };
                MyLife.getCities(review._id, function (data) {
                    // review.cities = data.data;
                    $scope.citiesTravelled.cities = data.data;
                });
                break;
            case 'viewLocalCountry':
                $scope.categoryList = {
                    "cityName": review.name,
                };
                MyLife.getCategories(review._id, function (data) {
                    // review.categories = data.data;
                    $scope.categoryList.categories = data.data;
                });
                console.log($scope.categoryList);
                break;
        }


    };

    // $scope.openAccordian = function (object, openAccordian, flag) {
    //   object.pageNo = 1;
    //   object.scrollBusy = false;
    //   object.stopCallingApi = false;
    //   console.log(object, openAccordian, flag);
    //   if (openAccordian) {
    //     switch (flag) {
    //       case 'travel-life':
    //         MyLife.getReviewsByCities(object.country, object._id, object.pageNo, function (data) {
    //           object.accordReview = data.data;
    //         });
    //         break;
    //       case 'local-life':
    //         MyLife.getReviewsByCategories(object.city, object._id, object.pageNo, function (data) {
    //           object.accordReview = data.data;
    //         });
    //         break;
    //     }
    //   } else {
    //   }
    // };
    $scope.openAccordian = function (object, openAccordian, flag) {
        console.log("getReviewsWeb called from openAccordian");
        object.pageNo = 1;
        object.scrollBusy = false;
        object.stopCallingApi = false;
        console.log(object, openAccordian, flag);
        if (openAccordian) {
            switch (flag) {
                case 'travel-life':
                    MyLife.getReviewsByCities(object.country, object._id, object.pageNo, function (data) {
                        object.accordReview = data.data;
                    });
                    break;
                case 'local-life':
                    MyLife.getReviewsByCategories(object.city, object._id, object.pageNo, function (data) {
                        object.accordReview = data.data;
                    });
                    break;
            }
        } else {}
    };
    $scope.savePostReview = function (values) {
        console.log(values, wholePost);
        var obj = {
            "post": wholePost._id,
            "rating": values.rating.toString(),
            "review": values.review
        }
        console.log(obj);
        console.log(wholePost);
        MyLife.savePostReview(obj, function (data) {
            if (data.value) {
                if (wholePost.review.length == 0) {
                    wholePost.review[0] = {};
                }
                wholePost.review[0].post = obj.post;
                wholePost.review[0].rating = obj.rating;
                wholePost.review[0].review = obj.review;
                console.log(wholePost);
                modal.close();
            } else {}
        })
    };

    //reviews integration ends here

    var smoothScroll = function (url) {
        setTimeout(function () {
            $location.hash(url);
            anchorSmoothScroll.scrollTo(url);
        }, 3000);
    };

    var allMyLife = [
        "views/content/myLife/journey.html",
        "views/content/myLife/moments.html",
        "views/content/myLife/reviews.html",
        "views/content/myLife/holidayplanner.html"
    ];
    $scope.myLife = {
        profileMain: "views/content/myLife/profile.html",
        innerView: allMyLife[0]
    };
    // change url
    $scope.viewTab = 1;
    switch ($state.params.name) {
        case "journeys":
            console.log("scrolling to journeys");
            $scope.myLife.innerView = allMyLife[0];
            // $location.hash("journeys");
            // anchorSmoothScroll.scrollTo("journeys");
            smoothScroll($state.params.name);
            break;
        case "moments":
            getMoments();
            console.log("scrolling to moments");
            $scope.myLife.innerView = allMyLife[1];
            smoothScroll($state.params.name);
            // $location.hash("moments");
            // anchorSmoothScroll.scrollTo("moments");
            break;
        case "reviews":
            getReviews();
            console.log("scrolling to reviews");
            $scope.myLife.innerView = allMyLife[2];
            smoothScroll($state.params.name);
            // $location.hash("reviews");
            // anchorSmoothScroll.scrollTo("reviews");
            break;
        case "holidayplanner":
            $scope.myLife.innerView = allMyLife[3];
            break;
        default:
            $scope.myLife.innerView = allMyLife[0];
    }


    $scope.getTab = function (view) {
        //   alert(view);
        $scope.myLife.innerView = allMyLife[view];
        var url = "journeys";
        switch (view) {
            case 0:
                //   $stateParams.name = "journeys";
                url = "journeys";
                //   anchorSmoothScroll.scrollTo(url);
                break;
            case 1:
                //   $stateParams.name = "moments";
                url = "moments";
                getMoments();
                //   anchorSmoothScroll.scrollTo(url);
                break;
            case 2:
                console.log("reviews m hu bhai");
                //   $stateParams.name = "reviews";
                url = "reviews";
                getReviews();
                //   anchorSmoothScroll.scrollTo(url);
                break;
        }
        $state.go("mylife1", {
            urlSlug: $.jStorage.get("activeUrlSlug"),
            name: url
        }, {
            reload: true,
            notify: false
        }).then(function () {
            $location.hash(url);
            anchorSmoothScroll.scrollTo(url);
        });
    }

    $scope.mapPathData = window._mapPathData; // defined in _mapdata.js
    $scope.mapDataHumanizeFn = function (val) {
        return val + " units";
    };

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
    };
    $scope.ratingStates = [{
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }, {
        stateOn: 'fa fa-star-o',
        stateOff: 'fa fa-star'
    }];
    // journey json
    $scope.buildNow = function () {
        $scope.$broadcast('rebuild:me');
    }
    $scope.$on('scrollbar.hide', function () {
        // console.log('Scrollbar hide');
    });
    $scope.$on('scrollbar.show', function () {
        // console.log('Scrollbar show');
    });
    $scope.openLocalimg = function (getVal) {
        // $scope.showimgData = $scope.localLife[getVal];
        $scope.showimgData = getVal;
        // console.log(getVal);
        $uibModal.open({
            animation: true,
            templateUrl: "views/modal/local-imgview.html",
            scope: $scope,
            windowTopClass: "notify-popup"
        })
    };
    var pageNo = 0;
    $scope.scroll = {
        busy: false
    };
    var getAllJourney = function (journeys) {
        _.each(journeys, function (obj) {
            $scope.travelLife.push(obj);
            setTimeout(function () {
                $scope.scroll.busy = false;
            }, 500);
        });
        // console.log($scope.travelLife);
        if ($scope.travelLife.length == 0) {
            $scope.hasJourney = false;
        } else {
            $scope.hasJourney = true;
        }
        // $scope.hasJourney = flag;
    };
    // MyLife.getAllJourney(getAllJourney, pageNo, function (err) {
    //   console.log(err);
    // });
    $scope.getMore = function () {
        if ($scope.scroll.busy) {
            return;
        } else {
            pageNo++;
            $scope.scroll.busy = true;
            MyLife.getAllJourney(getAllJourney, pageNo, function (err) {
                console.log(err);
            });
        }
    }
    $scope.redirectTo = function (id) {
        console.log(id);
        $.jStorage.set('travelId', id);
        $state.go('ongojourney');
    }

    // local life
    var viewLocalLife = function (dataLocal) {
        $scope.localLifeJourney = dataLocal.data;
        $scope.localDate = dataLocal.datesArr;
        $scope.localPostCount = dataLocal.count;
        $scope.localCategory = dataLocal.categories;
        $scope.localRating = dataLocal.rating;
        $scope.scroll2.busy = false;
        if ($scope.localLifeJourney.length == 0) {
            $scope.showLocalLife = true;
        } else {
            $scope.showLocalLife = false;
        }
        $timeout(function () {
            $scope.viewLocal = true;
        }, 100);
    };

    $scope.getlocalLife = function () {
        $scope.showTravellife = false;
        console.log($scope.showTravellife);
        $scope.scroll2.busy = true;
        localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
            console.log(err);
        })
    };
    $scope.viewTravelLife = function () {
        $scope.showTravellife = true;
    };
    // pagination local life
    $scope.getMoreLocalPost = function () {
            console.log($scope.showTravellife, 'value');
            if ($scope.scroll2.stopCallingApi == false && $scope.showTravellife == false) {
                $scope.localFilterPost.pagenumber++;
                console.log($scope.localFilterPost.pagenumber++, 'pagenumber');
                $scope.scroll2.busy = true;
                localLife.getLocalJourney(function (data) {
                    $scope.scroll2.busy = false;
                    if (data.data.length === 0) {
                        $scope.scroll2.stopCallingApi = true;
                    } else {
                        _.each(data.data, function (newData) {
                            $scope.localLifeJourney.push(newData);
                        });
                    }
                }, $scope.localFilterPost, function (err) {
                    console.log(err);
                });
            }
        }
        // pagination local life end

    // get by Filter
    $scope.getByFilter = function (filterdData, filterType) {
        console.log(filterdData, 'what data is coming');
        switch (filterType) {
            case 'date':
                $scope.localFilterPost.month = parseInt(moment(filterdData.split(",")[0], "MMMM").format('M'));
                $scope.localFilterPost.year = parseInt(filterdData.split(",")[1]);
                console.log($scope.localFilterPost.month, 'what is month', $scope.localFilterPost.year, 'what is year');
                $scope.localFilterPost.pagenumber = 1;
                localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                    console.log(err);
                });
                $scope.viewLocal = false;
                break;
            case 'checkIn':
                console.log(filterdData, "--------");
                var getCheckInIndex = _.findIndex($scope.localFilterPost.checkInType, function (newData) {
                    return newData == filterdData;
                });
                $scope.localFilterPost.pagenumber = 1;
                if (getCheckInIndex === -1) {
                    $scope.localFilterPost.checkInType.push(filterdData);
                    console.log($scope.localFilterPost.checkInType, 'array');
                } else {
                    _.remove($scope.localFilterPost.checkInType, function (newArr) {
                        return newArr == filterdData;
                    })
                    console.log($scope.localFilterPost.checkInType, 'removed data');
                }
                localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                    console.log(err);
                });
                $scope.viewLocal = false;
                break;
            case 'rating':
                var getRatingIndex = _.findIndex($scope.localFilterPost.rating, function (rating) {
                    return rating == filterdData;
                });
                $scope.localFilterPost.pagenumber = 1;
                if (getRatingIndex === -1) {
                    $scope.localFilterPost.rating.push(filterdData);
                    console.log($scope.localFilterPost.rating, 'rating ka array');
                } else {
                    _.remove($scope.localFilterPost.rating, function (remove) {
                        return remove == filterdData;
                    });
                    console.log($scope.localFilterPost.rating, 'removed ');
                }
                localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                    console.log(err);
                });
                $scope.viewLocal = false;
                break;
            case 'photos':
                $scope.localFilterPost.pagenumber = 1;
                // if ($scope.localFilterPost.photos == false) {
                //   $scope.localFilterPost.photos = true;
                //   localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                //     console.log(err);
                //   });
                // } else {
                //   $scope.localFilterPost.photos = false;
                //   localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                //     console.log(err);
                //   });
                // }
                $scope.viewLocal = false;
                localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                    console.log(err);
                });
                break;
            case 'videos':
                $scope.localFilterPost.pagenumber = 1;
                // if ($scope.localFilterPost.videos == false) {
                //   $scope.localFilterPost.videos = true;
                //   localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                //     console.log(err);
                //   });
                // } else {
                //   $scope.localFilterPost.videos = false;
                //   localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                //     console.log(err);
                //   });
                // }
                localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                    console.log(err);
                });
                $scope.viewLocal = false;
                break;
            case 'thoughts':
                $scope.localFilterPost.pagenumber = 1;
                // if ($scope.localFilterPost.thoughts == false) {
                //   $scope.localFilterPost.thoughts = true;
                //   localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                //     console.log(err);
                //   });
                // } else {
                //   $scope.localFilterPost.thoughts = false;
                //   localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                //     console.log(err);
                //   });
                // }
                localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                    console.log(err);
                });
                $scope.viewLocal = false;
                break;
        }
    };
    // get by Filter end
    // clear all filter
    $scope.clearLocalFilter = function () {
            console.log($scope.localFilterPost, 'what is local filter post');
            $scope.localFilterPost.checkInType = [];
            $scope.localFilterPost.rating = [];
            $scope.localStar.fiveStar = false;
            $scope.localStar.fourStar = false;
            $scope.localStar.threeStar = false;
            $scope.localStar.twoStar = false;
            $scope.localStar.oneStar = false;
            $scope.localFilterPost.photos = false;
            $scope.localFilterPost.videos = false;
            $scope.localFilterPost.thoughts = false;
            _.each($scope.localCategory, function (value) {
                value.checked = false;
            });
            console.log($scope.localCategory);
            localLife.getLocalJourney(viewLocalLife, $scope.localFilterPost, function (err) {
                console.log(err);
            });
            $scope.viewLocal = false;
        }
        // clear all filter end
        // local post like and share
        // $scope.getLocalComments = function(localPost) {
        //   console.log(localPost,'bc ');
        //   $scope.post = ongo;
        //   $scope.previousId;
        //   var callback = function(data) {
        //     $scope.uniqueArr = [];
        //     $scope.listOfComments = data.data;
        //     $scope.uniqueArr = _.uniqBy($scope.listOfComments.comment, 'user._id');
        //   }
        //   if ($scope.previousId != $scope.post._id) {
        //     $scope.listOfComments = [];
        //     $scope.viewCardComment = true;
        //     $scope.journey.journeyHighLight = ongo._id;
        //     $scope.getCard = "view-whole-card";
        //     LikesAndComments.getComments("post", $scope.post._id, callback);
        //   } else {
        //     if ($scope.viewCardComment) {
        //       $scope.viewCardComment = false;
        //       $scope.journey.journeyHighLight = "";
        //       $scope.getCard = "";
        //       $scope.comment.text = "";
        //     } else {
        //       $scope.listOfComments = [];
        //       $scope.viewCardComment = true;
        //       $scope.journey.journeyHighLight = ongo._id;
        //       $scope.getCard = "view-whole-card";
        //       LikesAndComments.getComments("post", $scope.post._id, callback);
        //     }
        //   }
        //   $scope.previousId = $scope.post._id;
        // };
        //
        // $scope.getLocalLikes = function(localLike) {
        //   console.log(localLike,'localLike');
        //   var callback = function(data) {
        //     $scope.listOfLikes = data.data;
        //     console.log($scope.listOfLikes);
        //   };
        //   console.log($scope.post);
        //   if ($scope.previousLikeId != ongo._id) {
        //     $scope.listOfLikes = [];
        //     $scope.viewCardLike = true;
        //     $scope.journey.journeyHighLight = ongo._id;
        //     $scope.showLikeShow = "show-like-side-sec";
        //     LikesAndComments.getLikes("post", ongo._id, callback);
        //   } else {
        //     if ($scope.viewCardLike) {
        //       $scope.viewCardLike = false;
        //       $scope.journey.journeyHighLight = "";
        //       $scope.getCard = "";
        //     } else {
        //       $scope.listOfComments = [];
        //       $scope.viewCardLike = true;
        //       $scope.journey.journeyHighLight = ongo._id;
        //       $scope.showLikeShow = "show-like-side-sec";
        //       LikesAndComments.getLikes("post", ongo._id, callback);
        //     }
        //   }
        //   $scope.previousLikeId = ongo._id;
        // };

    // local post like and share end
    $scope.comment = {
        "text": ""
    }
    $scope.postScrollData = {};
    $scope.postScrollData.busy = false;
    $scope.postScrollData.stopCallingApi = false;
    $scope.postScrollData.likePageNumber = 1;
    $scope.postScrollData.viewList = false;
    $scope.showLikeCommentCard = true;
    $scope.openCommentSection = function (ongo) {
        if (!($.jStorage.get("isLoggedIn"))) {
            $state.go('login');
        }
        $scope.showLikeCommentCard = false;
        // var type = "";
        // if (ongo.type === 'on-the-go-journey' || ongo.type === 'ended-journey') {
        //   type = "journey";
        // } else if (ongo.type === 'quick-itinerary' || ongo.type === 'detail-itinerary') {
        //   type = "itinerary";
        // }
        $scope.listOfLikes = false;
        console.log(ongo, 'ongo');
        $scope.post = ongo; //for using it in comment section
        $scope.previousId;
        $scope.postScrollData.type = ongo.type;
        $scope.postScrollData._id = ongo._id;
        var callback = function (data) {
            $scope.uniqueArr = [];
            $scope.listOfComments = data.data;
            $scope.postScrollData.viewList = true;
            $scope.uniqueArr = _.uniqBy($scope.listOfComments.comment, 'user._id');
        }
        if ($scope.previousId != $scope.post._id) {
            // $scope.focus('enterComment');
            $scope.listOfComments = [];
            $scope.viewCardComment = true;
            $scope.getCard = "view-whole-card";
            LikesAndComments.getComments(ongo.type, $scope.post._id, $scope.postScrollData.likePageNumber, callback);
        } else {
            if ($scope.viewCardComment) {
                $scope.viewCardComment = false;
                // $scope.journey.journeyHighLight = "";
                $scope.getCard = "";
                $scope.comment.text = "";
            } else {
                $scope.listOfComments = [];
                $scope.viewCardComment = true;
                // $scope.focus('enterComment');
                $scope.getCard = "view-whole-card";
                LikesAndComments.getComments(ongo.type, $scope.post._id, $scope.postScrollData.likePageNumber, callback);
            }
        }
        $scope.previousId = $scope.post._id;
        $timeout(function () {
            $scope.showLikeCommentCard = true;
        }, 1000);
    };

    // $scope.postPostsComment = function (uniqueId, comment, postId) {
    //   console.log(uniqueId, comment, postId);
    //   console.log("controller se comment hua");
    //   var type = "post";
    //   var additionalId = null;
    //   var hashTag = [];
    //   var callback = function (data) {
    //     $scope.listOfComments = data.data;
    //     document.getElementById('enterComment').value = "";
    //   };
    //   LikesAndComments.postComment(type, uniqueId, postId, comment, hashTag, additionalId, callback);
    // };

    $scope.openLikeSection = function (ongo) {
        if (!($.jStorage.get("isLoggedIn"))) {
            $state.go('login');
        }
        console.log('local ya travel');
        $scope.listOfComments = false;
        $scope.viewCardComment = false;
        $scope.postScrollData.type = ongo.type;
        $scope.postScrollData._id = ongo._id;
        console.log(ongo);
        var callback = function (data) {
            $scope.postScrollData.viewList = true;
            $scope.listOfLikes = data.data;
            console.log($scope.listOfLikes);
        };
        // console.log($scope.post);
        if ($scope.previousLikeId != ongo._id) {
            // $scope.focus('enterComment');
            $scope.listOfLikes = [];
            $scope.viewCardLike = true;
            // $scope.journey.journeyHighLight = ongo._id;
            $scope.showLikeShow = "show-like-side-sec";
            LikesAndComments.getLikes(ongo.type, ongo._id, $scope.postScrollData.likePageNumber, callback);
        } else {
            if ($scope.viewCardLike) {
                $scope.viewCardLike = false;
                // $scope.journey.journeyHighLight = "";
                $scope.getCard = "";
                $scope.showLikeShow = "";
            } else {
                $scope.listOfComments = [];
                $scope.viewCardLike = true;
                // $scope.focus('enterComment');
                // $scope.journey.journeyHighLight = ongo._id;
                $scope.showLikeShow = "show-like-side-sec";
                LikesAndComments.getLikes(ongo.type, ongo._id, $scope.postScrollData.likePageNumber, callback);
            }
        }
        $scope.previousLikeId = ongo._id;
    };
    $scope.audioStatus = {
        on: false
    }
    $scope.muteVolume = function () {
        if ($("video").prop('muted')) {
            $scope.audioStatus = {
                on: true
            }
            $("video").prop('muted', false);
        } else {
            $scope.audioStatus = {}
            $("video").prop('muted', true);
        }
    }
    $scope.closeBackDrop = function () {
        $scope.viewCardComment = false;
        $scope.viewCardLike = false;
        $scope.getCard = "";
        $scope.listOfLikes = [];
        $scope.postScrollData.likePageNumber = 1;
        $scope.postScrollData.busy = false;
        $scope.postScrollData.stopCallingApi = false;
        console.log($scope.postScrollData, 'post scroll data');
        $timeout(function () {
            $scope.postScrollData.likePageNumber = 1;
            $scope.postScrollData.viewList = false;
            console.log($scope.postScrollData, 'console wla post scroll data');
        }, 100);
    };
    // PROFILE LIST REDIRECT
    $scope.profileListRedirect = function (pageStyle, activeUrlSlug) {
        console.log('bantas');
        if (TemplateService.isMine || ($scope.userData.following == 1 && $scope.userData.status == 'private') || $scope.userData.status == 'public') {
            console.log('santa mein hai');
            if (pageStyle == 'following') {
                console.log('pageStyle following');
                $state.go('ProfileList', {
                    'urlSlug': activeUrlSlug,
                    'active': 'following'
                });
            } else if (pageStyle == 'followers') {
                console.log('pageStyle followers');
                $state.go('ProfileList', {
                    'urlSlug': activeUrlSlug,
                    'active': 'followers'
                });
            } else if (pageStyle == 'countries-visited') {
                console.log('pageStyle countries');
                $state.go('ProfileList', {
                    'urlSlug': activeUrlSlug,
                    'active': 'countries-visited'
                });
            } else if (pageStyle == 'bucket-list') {
                console.log('pageStyle bucket');
                $state.go('ProfileList', {
                    'urlSlug': activeUrlSlug,
                    'active': 'bucket-list'
                });
            } else {
                $state.go('ProfileList', {
                    'urlSlug': activeUrlSlug,
                    'active': 'following'
                });
            }
        } else {
            $location.hash('journeys');
            anchorSmoothScroll.scrollTo('journeys');
            // console.log('karan arjun console mein aayenge');
        }
    };
    // PROFILE LIST REDIRECT END

    if ($.jStorage.get("isLoggedIn") && $.jStorage.get("profile") && ($.jStorage.get("profile").urlSlug == $stateParams.urlSlug)) {
        //its your own profile so no need to call profile again
        $scope.myProfileData = $.jStorage.get("profile");
        $scope.userData = $.jStorage.get("profile");
        if ($.jStorage.get("profile").type === "User") {
            TemplateService.title = $scope.userData.name + " | Travel & Local Life | TraveLibro";
            $.jStorage.set("activeUrlSlug", $.jStorage.get("profile").urlSlug);
            $scope.activeUrlSlug = $.jStorage.get("profile").urlSlug;
            // allowAccess = true;
            // $scope.isMine = true;
            setMoreAboutMe();
            reloadCount();
            switch ($state.params.name) {
                case "journeys":
                    console.log("scrolling to journeys");
                    $scope.myLife.innerView = allMyLife[0];
                    // $location.hash("journeys");
                    // anchorSmoothScroll.scrollTo("journeys");
                    smoothScroll($state.params.name);
                    break;
                case "moments":
                    getMoments();
                    console.log("scrolling to moments");
                    $scope.myLife.innerView = allMyLife[1];
                    smoothScroll($state.params.name);
                    // $location.hash("moments");
                    // anchorSmoothScroll.scrollTo("moments");
                    break;
                case "reviews":
                    getReviews();
                    console.log("scrolling to reviews");
                    $scope.myLife.innerView = allMyLife[2];
                    smoothScroll($state.params.name);
                    // $location.hash("reviews");
                    // anchorSmoothScroll.scrollTo("reviews");
                    break;
                case "holidayplanner":
                    $scope.myLife.innerView = allMyLife[3];
                    break;
                default:
                    $scope.myLife.innerView = allMyLife[0];
                    console.log('test');
                    break;
            }
            var getAllCountries = function (countries) {
                $scope.nationality = countries;
                $scope.getMap();
            };
            MyLife.getAllCountries(getAllCountries, function (err) {
                console.log(err);
            });
        } else {
            $state.go("agent-home-without", {
                urlSlug: $stateParams.urlSlug
            });
        }
    } else {
        //someone elses profile so get his/her data
        allowAccess = false;
        $.jStorage.set("activeUrlSlug", $stateParams.urlSlug);
        $scope.activeUrlSlug = $stateParams.urlSlug;
        // $scope.isMine = false;
        $scope.myProfileData = $.jStorage.get("profile");
        NavigationService.getProfile($stateParams.urlSlug, function (data) {
            if (data.value) {
                if (data.data.type === "User") {
                    $scope.userData = data.data;
                    TemplateService.title = $scope.userData.name + " | Travel & Local Life | TraveLibro";
                    allowAccess = false;
                    setMoreAboutMe();
                    reloadCount();
                    switch ($state.params.name) {
                        case "journeys":
                            console.log("scrolling to journeys");
                            $scope.myLife.innerView = allMyLife[0];
                            // $location.hash("journeys");
                            // anchorSmoothScroll.scrollTo("journeys");
                            smoothScroll($state.params.name);
                            break;
                        case "moments":
                            getMoments();
                            console.log("scrolling to moments");
                            $scope.myLife.innerView = allMyLife[1];
                            smoothScroll($state.params.name);
                            // $location.hash("moments");
                            // anchorSmoothScroll.scrollTo("moments");
                            break;
                        case "reviews":
                            getReviews();
                            console.log("scrolling to reviews");
                            $scope.myLife.innerView = allMyLife[2];
                            smoothScroll($state.params.name);
                            // $location.hash("reviews");
                            // anchorSmoothScroll.scrollTo("reviews");
                            break;
                        case "holidayplanner":
                            $scope.myLife.innerView = allMyLife[3];
                            break;
                        default:
                            $scope.myLife.innerView = allMyLife[0];
                            console.log('test');
                            break;
                    }
                    var getAllCountries = function (countries) {
                        $scope.nationality = countries;
                        $scope.getMap();
                    };
                    MyLife.getAllCountries(getAllCountries, function (err) {
                        console.log(err);
                    });
                } else {
                    $state.go("agent-home-without", {
                        urlSlug: $stateParams.urlSlug
                    });
                }
            } else {
                $state.go("errorpage");
            }
        }, function (data) {
            console.log(data);
        });
    }
})

.controller('JourneyCtrl', function ($scope, TemplateService, NavigationService, cfpLoadingBar, $timeout, $uibModal) {
    //Used to name the .html file

    $scope.template = TemplateService.changecontent("journey");
    $scope.menutitle = NavigationService.makeactive("Journey");
    TemplateService.title = $scope.menutitle;
    $scope.navigation = NavigationService.getnav();

    $scope.$watch('masonryContainer', function () {
        $timeout(function () {
            console.log("reload");
            $rootScope.$broadcast('masonry.reload');
        }, 200);
    });
    $scope.buildNow = function () {
        $scope.$broadcast('rebuild:me');
    }
    $scope.$on('scrollbar.hide', function () {
        // console.log('Scrollbar hide');
    });
    $scope.$on('scrollbar.show', function () {
        // console.log('Scrollbar show');
    });


    $scope.data = {
        'GB': {
            metric: 4
        },
        'US': {
            metric: 40
        },
        'FR': {
            metric: 29
        },
        'IN': {
            metric: 500
        }
        // 'FI': {metric: 15}
    };
    $scope.mapPathData = window._mapPathData; // defined in _mapdata.js
    $scope.mapDataHumanizeFn = function (val) {
        return val + " units";
    };
    $scope.heatmapColors = ['#2c3757', '#ff6759'];

    $scope.openLocalimg = function (getVal) {
        // $scope.showimgData = $scope.localLife[getVal];
        $scope.showimgData = getVal;
        // console.log(getVal);
        $uibModal.open({
            animation: true,
            templateUrl: "views/modal/local-imgview.html",
            scope: $scope,
            windowTopClass: "notify-popup"
        })
    };
    $timeout(function () {
        if ((navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1) ||
            (navigator.platform.indexOf("iPad") != -1)) {
            $(".download-app").addClass("hide");
        }
    }, 200);
    $scope.customLink = function () {
        window.open("https://play.google.com/store/apps/details?id=com.ascra.app.travellibro");
    };


})

.controller('headerctrl', function ($scope, TemplateService, NavigationService, LikesAndComments, $state, $http, $interval, $timeout, $stateParams) {
    $scope.template = TemplateService;
    $scope.getAllSearched = [];
    $scope.search = {};
    $scope.search.searchType = "";
    $scope.search.viewData = false;
    $scope.isLoggedIn = $.jStorage.get("isLoggedIn");
    $scope.template.isLoggedIn = $.jStorage.get("isLoggedIn");
    /////////////////////////////////////////////////

    setInterval(function () {
        $scope.searchHeaderLoad = TemplateService.searchHeaderLoad;
    }, 300);

    // ISMINE FUNCTION
    if ($.jStorage.get("isLoggedIn")) {
        $scope.isLoggedIn = true;
        $scope.template.isLoggedIn = true; ///////////////////////////////////////////////////////////////////////
        if ($.jStorage.get("profile") && ($stateParams.urlSlug == $.jStorage.get("profile").urlSlug)) {
            // $.jStorage.set("isMine", true);
            $scope.template.isMine = true;
        } else {
            // $.jStorage.set("isMine", false);
            $scope.template.isMine = false;
        }
    } else {
        $scope.isLoggedIn = false;
        $scope.template.isLoggedIn = false; //////////////////////////////////////////
        // $scope.isMine = false;
        $scope.template.isMine = false;
    }
    // ISMINE FUNCTION END

    if ($.jStorage.get('accessToken') && $.jStorage.get('accessToken') != '') {
        var callback = function (data, status) {
            if (data.data._id) {
                $.jStorage.set("isLoggedIn", true);
                $.jStorage.set("profile", data.data);
                $scope.userData = $.jStorage.get("profile");
                $scope.accessToken = $.jStorage.get("accessToken");
                // $scope.isLoggedIn = $.jStorage.get("isLoggedIn");
                if ($stateParams.urlSlug == $.jStorage.get("profile").urlSlug) {
                    $scope.template.isMine = true;
                } else {
                    $scope.template.isMine = false;
                }
                //restrict user who has not followed starings steps
                if ($scope.userData.type == "User") {
                    if ($.jStorage.get('qualifiedForLoginFlow')) {
                        $state.go('login-flow');
                    }
                    // else if ($.jStorage.get('qualifiedForHoliday')) {
                    //     $state.go('holiday');
                    // }
                    else if ($scope.userData && $scope.userData.alreadyLoggedIn == false) {
                        $state.go('mainpage');
                    }
                } else {
                    if ($scope.userData && $scope.userData.alreadyLoggedIn == false) {
                        $state.go('agent-login');
                    }
                }
                //restrict user who has not followed starings steps end
            } else {

            }
        };
        if ($.jStorage.get("profile") && $.jStorage.get("profile").type === "User") {
            NavigationService.getProfile("", callback, function (err) {
                console.log(err);
            });
        } else {
            NavigationService.getAgentsProfile("", callback, function (err) {
                console.log(err);
            });
        }
    } else {
        $.jStorage.set("profile", null);
        $scope.isLoggedIn = false;
        $scope.isMine = false;
    }

    // edit option
    $scope.editOption = function (model, class1, class2) {
        LikesAndComments.onClickDropDown(model, $scope, class1, class2);
    };
    // edit option end

    // route to itinerary
    $scope.routeSearchItinerary = function (itinerary) {
            if (itinerary.type == "quick-itinerary") {
                $state.go('userquickitinerary', {
                    'id': itinerary.urlSlug,
                    'urlSlug': itinerary.user.urlSlug
                })
            } else {
                $state.go('userdetailitinerary', {
                    'id': itinerary.urlSlug,
                    'urlSlug': itinerary.user.urlSlug
                })
            }
        }
        // route to itinerary end

    $(window).load(function () {
        var loading = setInterval(function () {
            var elementExists = document.getElementById("loader");
            if (elementExists) {
                $('.travelibro-loader').parent().addClass('loader-blur');
            } else {
                $('body').removeClass('loader-blur');
                clearInterval(loading);
            };
        }, 200);
    });

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });

    $scope.oneAtATime = true;
    $.fancybox.close(true);
    $scope.getslide = "menu-out";
    $scope.getnav = function () {
        if ($scope.getslide == "menu-in") {
            $scope.getslide = "menu-out";
            $scope.onebar = "";
            $scope.secondbar = "";
            $scope.thirdbar = "";
            $scope.buttonpos = "";
        } else {
            $scope.getslide = "menu-in";
            $scope.onebar = "firstbar";
            $scope.secondbar = "secondbar";
            $scope.thirdbar = "thirdbar";
            $scope.buttonpos = "buttonpos";
        }
    };

    $scope.isopen = false;
    $scope.opensearch = function () {
        $scope.isopen = !$scope.isopen;
    };

    $scope.opendownload = function () {
        $scope.isopen = !$scope.isopen;
    };

    if (typeof $.fn.fullpage.destroy == 'function') {
        $.fn.fullpage.destroy('all');
    }

    $scope.logout = function () {
        var accessToken = $.jStorage.get("accessToken");
        var profile = $.jStorage.get("profile");
        NavigationService.logout(function () {
            // NavigationService.disablePushNotification();
            OneSignal.getUserId(function (data) {
                console.log(data);
                $http({
                    "url": adminURL + "/user/updateDeviceId",
                    "method": "POST",
                    "data": {
                        'accessToken': accessToken,
                        'deviceId': data,
                        'remove': true
                    }
                });
                // NavigationService.disablePushNotification(data);
            });
            $.jStorage.flush();
            acsToken = "";
            accessToken = "";
            if (profile && profile.type == "User") {
                $state.go('login');
            } else {
                $state.go('partnerlogin');
            }
        }, function (err) {
            console.log(err);
        });
    };

    $scope.searchType = function () {
        console.log($scope.search.searchType, 'search type');
        if ($scope.search.searchType !== '') {
            $scope.viewSearch.backgroundClick = true;
            NavigationService.getSearchData({
                search: $scope.search.searchType
            }, function (data) {
                $scope.getAllSearched = data.data;
            });
        } else {
            $scope.viewSearch.backgroundClick = false;
        }
    };

    $scope.viewResult = function (state, searchText) {
        switch (state) {
            case 'search-traveller':
                $state.go('search-result', {
                    name: 'search-traveller',
                    searchText: searchText
                });
                break;
            case 'search-travelAgent':
                $state.go('search-result', {
                    name: 'search-travelAgent',
                    searchText: searchText
                });
                break;
            case 'search-itinerary':
                $state.go('search-result', {
                    name: 'search-itinerary',
                    searchText: searchText
                });
                break;
            case 'search-hashtag':
                $state.go('search-result', {
                    name: 'search-hashtag',
                    searchText: searchText
                });
                break;
            case 'search-country':
                $state.go('search-result', {
                    name: 'search-country',
                    searchText: searchText
                });
                break;
            case 'search-city':
                $state.go('search-result', {
                    name: 'search-city',
                    searchText: searchText
                });
                break;
            default:

        }
    }
    $timeout(function () {
        if ((navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1) ||
            (navigator.platform.indexOf("iPad") != -1)) {
            $(".download-app").addClass("hide");
        }
    }, 200);
    $scope.customLink = function () {
        window.open("https://play.google.com/store/apps/details?id=com.ascra.app.travellibro");
    };
    // SWITCHING TO PROFILE
    $scope.switchToProfile = function (userData) {
        console.log(userData, 'data user ni');
        if (userData.type == "User") {
            $state.go("mylife", {
                name: 'journey',
                urlSlug: userData.urlSlug
            });
        } else {
            $state.go("agent-home-without", {
                urlSlug: userData.urlSlug
            });
        }
    };
    // SWITCHING TO PROFILE END
})


.controller('languageCtrl', function ($scope, TemplateService, $translate, $rootScope) {
    $scope.changeLanguage = function () {
        console.log("Language CLicked");
        if (!$.jStorage.get("language")) {
            $translate.use("hi");
            $.jStorage.set("language", "hi");
        } else {
            if ($.jStorage.get("language") == "en") {
                $translate.use("hi");
                $.jStorage.set("language", "hi");
            } else {
                $translate.use("en");
                $.jStorage.set("language", "en");
            }
        }
        //  $rootScope.$apply();
    };
})

