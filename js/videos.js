var app = angular.module('myApp', ['ui.router']);

app.filter('slice', function () {
    return function (arr, start, end) {
        return arr.slice(start, end);
    };
});

app.filter('authorsNames', function () {
    return function (authorsId) {
        authorsNames = [];
        for (var i = 0; i < authorsId.length; i++) {
            authorsNames[i] = authors.filter(function (element) {
                return element.id == authorsId[i]
            })[0].name;
        }

        var ret = authorsNames[0];
        if (authorsNames.length == 1) {
            return ret;
        }

        for (var i = 1; i < authorsNames.length - 1; i++) {
            ret += ', ' + authorsNames[i];
        }
        ret += ' e ' + authorsNames[authorsNames.length - 1];
        return ret;
    };
});

app.filter('authors', function () {
    return function (video) {
        return authors.filter(function (element) {
            return $.inArray(element.id, video.authorsId) >= 0;
        });
    }
})

app.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**'
    ]);
});

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/videos/page/1');

        $stateProvider
            .state('videosPage', {
                url: '/videos/page/:pageNum',
                templateUrl: 'videos.html'
            })
            .state('videoTitle', {
                url: '/video/:title',
                templateUrl: "video.html"
            });
    }]);

app.controller('videosController', function ($scope, $stateParams, $location) {

    var Video = Parse.Object.extend("Video");
    var query = new Parse.Query(Video);
    query.find({
        success: function (results) {
            console.log(results)
            for (var i = 0; i < results.length; i++) {
            }
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }});

    $scope.data = {}
    $scope.data.authorId = $stateParams.authorId;
    $scope.data.allvideos = videos;

    $scope.data.baseUrl = '/videos/page/';

    if ($scope.data.authorId) {
        $scope.data.baseUrl = '/videos/' + $scope.data.authorId + '/page/';
        $scope.data.allvideos = $scope.data.allvideos.filter(function (element) {
            return $.inArray($scope.data.authorId, element.authorsId) >= 0;
        })
    }

    $scope.interface = {};
    $scope.interface.page = parseInt($stateParams.pageNum) || 1;

    $scope.interface.init = ($scope.interface.page - 1) * 10;

    $scope.interface.final = $scope.interface.init + 10;

    $scope.functions = {}

    $scope.functions.nextPage = function () {
        $location.path($scope.data.baseUrl + ($scope.interface.page + 1))
    }

    $scope.functions.previousPage = function () {
        $location.path($scope.data.baseUrl + ($scope.interface.page - 1))
    }

    $scope.functions.seevideo = function (index) {
        selectedIndex = $scope.interface.init + index
        $location.path("/video/" + $scope.data.allvideos[selectedIndex].id)
    }

    $scope.functions.embbedSrc = function(src){
        return "https://www.youtube.com/embed/" + src
    }
});

app.controller('videoController', function ($scope, $stateParams) {

    $scope.data = {}
    $scope.data.videoId = $stateParams.title;

    var byTitle = function (element) {
        return element.videoId === $scope.data.videoId
    }

    $scope.data.video = videos.filter(byTitle)[0];

    $scope.functions = {};

    $scope.functions.embbedSrc = function(){
        return "https://www.youtube.com/embed/" + $scope.data.id
    }
});

app.controller('uploadsController', function ($scope) {

    $scope.data = {}

    $scope.functions = {}

    $scope.functions.upload = function(file) {
        console.log(file)
        if(file === undefined){
            alert("Você deve selecionar um arquivo");
        } else {

        }

    }
});