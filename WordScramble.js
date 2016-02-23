var wordScrambleApp = angular.module('WordScrambleApp',[]);

wordScrambleApp.service('WordNikService', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
	var self = this;
  var api_key = "daf37ae535c1503c0297c06edad040ded89c1e42bfb45a4d1";

	self.GetWord = function (wordSize) {
  	var deferred = $q.defer();
    
		$http.get(
			"https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&excludePartOfSpeech=proper-noun&minCorpusCount=10000&&minDictionaryCount=30&&minLength=" + wordSize + "&maxLength=" + wordSize + "&api_key=" + api_key
		).success(function (response) {
      deferred.resolve(response.word.toLowerCase());
		}).error(function (data, status, headers, config) {
			deferred.reject("Error occurred while requesting a word");
		});
    
    return deferred.promise;
	}
  
  self.IsValid = function (word) {
  	var deferred = $q.defer();
    
		$http.get(
			"https://api.wordnik.com/v4/words.json/search/" + word + "?caseSensitive=false&api_key=" + api_key
		).success(function (response) {
      deferred.resolve(response.totalResults > 0);
		}).error(function (data, status, headers, config) {
			deferred.reject("Error occurred while requesting a word");
		});
    
    return deferred.promise;
	}
}]);

wordScrambleApp.controller('WordScrambleCtrl', ['$scope', '$timeout', '$interval', 'WordNikService', function ($scope, $timeout, $interval, wordNikService) {
	$scope.score = 0;
  $scope.wordSize = 6;
  $scope.gameOver = false;
  
  $scope.GetWordSize = function() {
    return new Array($scope.wordSize);   
	}
  
  var timer;  
  $scope.Init = function() {
  	// Stop any existing timer
    if (angular.isDefined(timer)) {
      $interval.cancel(timer);
      timer = undefined;
    }
    
    $scope.gameOver = false;
  	$scope.timeInSeconds = 30;
  	$scope.word = "";
    $scope.originalLetters = [];
  	$scope.guessedLetters = [];
    $scope.guessResult = "";
    
  	wordNikService.GetWord($scope.wordSize).then(function(response) {
    	$scope.word = response;
      $scope.originalLetters = $scope.word.split("");
    	$scope.Shuffle();
    });
    
		timer = $interval(function() {
      if ($scope.timeInSeconds == 0) {
      	$scope.gameOver = true;
      } else {
        $scope.timeInSeconds = $scope.timeInSeconds - 1;
      }
    }, 1000);
  }
  
  $scope.Score = function() {
  	if ($scope.timeInSeconds >= 25) {
    	$scope.score += 3;
    } else if ($scope.timeInSeconds >= 15) {
    	$scope.score += 2;
    } else {
    	$scope.score += 1;
    }
  }
  
  $scope.Shuffle = function() {
    // Make sure that the shuffling did not give the letters in the original order
    // If so, re-shuffle
    while ($scope.originalLetters.join("").toLowerCase() === $scope.word.toLowerCase()) {
      $scope.originalLetters = $scope.originalLetters.sort(function() { return Math.random() - 0.5; });
    }
  }
  
  $scope.Success = function() {
  	$scope.guessResult = "Success";
    $scope.Score();
    $timeout(function() {
    	$scope.Init();
    }, 500);
  }
  
  $scope.Failure = function() {
  	$scope.guessResult = "Failure";
  }
  
  $scope.Incomplete = function() {
  	$scope.guessResult = "";
  }
}]);

wordScrambleApp.directive('keyCapture', ['$filter', 'WordNikService', function ($filter, wordNikService) {
    return {
      link: function (scope, element, attrs) {
          element.bind("keydown keypress", function (event) {
            if (event.keyCode == 8)	{	// backspace
							var lastGuessedLetter = scope.guessedLetters.pop();
              if (lastGuessedLetter) {
              	scope.originalLetters.push(lastGuessedLetter);
                scope.guessResult = "";
                scope.$apply();
              }
              event.preventDefault();
            } else if (event.keyCode == 13) { // enter
            	// Trigger replay with enter when the user presses enter
            	if (scope.gameOver) {
            		scope.score = 0;
            		scope.Init();
              	event.preventDefault();
              }
            } else {
              var inputLetter = String.fromCharCode(event.keyCode).toLowerCase();
              if (inputLetter) {
                var inputLetterIndex = scope.originalLetters.indexOf(inputLetter);
                if (inputLetterIndex != -1) {
                  scope.originalLetters.splice(inputLetterIndex, 1);
                  scope.guessedLetters.push(inputLetter);
                  if (scope.guessedLetters.length == scope.wordSize) {
                  	wordNikService.IsValid(scope.guessedLetters.join("")).then(function(isValid) {
                    	if (isValid) {
                      	scope.Success();
                      } else {
                      	scope.Failure();
                      }
                    });
                  } else {
                  	scope.Incomplete();
                  }
                  scope.$apply();
                }
              }
              event.preventDefault();
            }
          });
      }
    }
}]);
