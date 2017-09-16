var players = [];
var playerJs = [];

function playOne() {
  // create array for player IDs
  // determine the available player IDs
  for (x = 0; x < Object.keys(videojs.players).length; x++) {
    // assign the player to setPlayer
    var setPlayer = Object.keys(videojs.players)[x];
    // define the ready event for the player
    videojs(setPlayer).ready(function () {
      // assign this player to a variable
      player = this;
      // assign and event listener for play event
      player.on('play', onPlay);
      // push the player to the players array
      players.push(player);
    });
  }
  // event listener callback function
  function onPlay(e) {
    // determine which player the event is coming from
    // console.log(e);
    var id = e.target.id;
    // go through the array of players
    for (var i = 0; i < players.length; i++) {
      // get the player(s) that did not trigger the play event
      if (players[i].id() != id) {
        //log the players that were paused
        // console.log(players[i].id());
        // pause the other player(s)
        videojs(players[i].id()).pause();
      }
    }
  }
}

function stopAllPlayingVideos() {
  if (players.length != 0) {
    for (var i = 0; i < players.length; i++) {
      // pause the player(s)
      players[i].pause();
    }
  }
}

firstapp.directive('brightcovePlayer', function ($timeout) {
  return {
    restrict: 'E',
    link: function (scope, element, attr) {
      if (!attr.addons) {
        attr.addons = '';
      }

      // no poster
      if (!attr.poster) {
        attr.poster = '';
      }

      // Autoplay via attributes
      if (attr.autoplay) {
        attr.autoplay = 'autoplay';
      } else {
        attr.autoplay = '';
      }

      // Generate random id for BC player
      var randomNum = Math.floor((Math.random() * 10000) + 1);
      var randomId = 'player-element-' + randomNum;
      var bcPlayerId = 'bc-player-' + randomNum;

      element.attr('id', randomId);
      var myElement = $('#' + randomId);

      // Remove brightcover player script
      var removeScript = function () {
        var removeId = 'videojs-' + attr.accountId + '-' + attr.playerId;
        var videoScript = $('#' + removeId);
        if (videoScript) {
          $('script').each(function () {
            if (this.id === removeId) {
              this.parentNode.removeChild(this);
            }
          });
        }
      };

      // Add brightcover player script
      var addScript = function (pid) {
        var script = document.createElement('script');
        var documentBody = document.body;
        script.type = 'text/javascript';
        script.id = 'videojs-' + attr.accountId + '-' + pid;
        script.src = "https://players.brightcove.net/" + attr.accountId + "/" + attr.playerId + "_default/index.min.js";
        script.onload = callback;
        // Add to body
        documentBody.appendChild(script);
        // Add next to element
        //  myElement.append(script);
      };

      // Clear player
      var clearPlayer = function () {
        var myPlayer = videojs('#' + bcPlayerId);
        if (myPlayer) {
          myPlayer.ready(function () {
            myPlayer.dispose();
          });
        }
      };

      var addPlayer = function () {
        // if brigthcove player loaded using brightcove video id
        var templateVideoId = '<video poster=\"' + attr.poster + '\" id=\"' + bcPlayerId + '\" data-video-id=\"' + attr.videoId + '\" data-account=\"' + attr.accountId + '\" data-player=\"' + attr.playerId + '\" data-embed=\"default\" class=\"video-js\" controls ' + attr.addons + ' ' + attr.autoplay + ' playsinline width=\"100%\"></video>';

        // if video loaded in brightcove player by external url
        var templateVideoUrl = '<video poster=\"' + attr.poster + '\" id=\"' + bcPlayerId + '\" data-player=\"' + attr.playerId + '\" data-embed=\"default\" data-application-id class=\"video-js\" controls ' + attr.addons + ' ' + attr.autoplay + ' playsinline width=\"100%\"><source src=\"' + attr.videoUrl + '\"></video>';

        // if brigthcove player loaded using iframe
        var iframeUrl = 'http://players.brightcove.net/' + attr.accountId + '/' + attr.playerId + '_default/index.html?videoId=' + attr.videoId;
        var iframeTemplate = '<iframe src=\"' + iframeUrl + '\" allowfullscreen webkitallowfullscreen mozallowfullscreen style="width: 100%; height: 100%; position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px;"></iframe>';

        if (attr.videoId) {
          if (myElement) {
            if (attr.iframe) {
              myElement.append(iframeTemplate);
            } else {
              myElement.append(templateVideoId);
            }
          }
        } else if (attr.videoUrl) {
          if (myElement) {
            myElement.append(templateVideoUrl);
          }
        }
      };

      // Callback on script load
      function callback() {
        $timeout(function () {
          playOne();
        }, 400);
      }

      //  removeScript(); // TO BE DELETED
      addPlayer();

      if (!attr.iframe) { // Check if iframe is false
        if (!(_.includes(playerJs, attr.playerId))) { // check if the player id exists
          playerJs.push(attr.playerId);
          addScript(attr.playerId);
        }

        $timeout(function () {
          playerJs = [];
        }, 300);
      }

      scope.$on('$destroy', function () {
        if (!isPhone) {
          clearPlayer();
        }
      });

    }
  };
});
