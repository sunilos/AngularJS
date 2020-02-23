var app = angular.module("sosApp", ["ngRoute"]);
app.constant(
    "org", { name: "SunilOS Open Source Learning Center", address: "President Tower" }
);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "Welcome.html"
        })
        .when("/customer", {
            templateUrl: "Customer.html",
            controller: 'customerCtl'
        })
        .when("/account", {
            templateUrl: "Account.html",
            controller: 'accountCtl'
        })
        .when("/marksheet/:id", {
            templateUrl: "Marksheet.html",
            controller: 'marksheetCtl'
        })
        .when("/marksheetList", {
            templateUrl: "MarksheetList.html",
            controller: 'marksheetListCtl'
        })
        .when("/loan/:id", {
            templateUrl: "Loan.html",
            controller: 'loanCtl'
        })
        .when("/loan/:id/:amt", {
            templateUrl: "Loan.html",
            controller: 'loanCtl'
        }).otherwise({
            template: "<h1>Invalid URL...</h1>"
        });
});


//Customer controller
var customerCB = function ($scope, $location, org) {
    $scope.message = "";
    $scope.form = {};
    $scope.submit = function () {
        $scope.message = "Data is submitted" + org.address;
    }
    $scope.submitAndGo = function () {
        $location.url("account");
    }
};
app.controller('customerCtl', customerCB);


//Account controller
var accountCB = function ($scope, $location) {
    $scope.message = "";
    $scope.form = {};
    $scope.submit = function () {
        $scope.message = "Data is submitted"
    }
    $scope.submitAndGo = function () {
        $location.url("loan/10");
    }
};
app.controller('accountCtl', accountCB);

//Loan controller
var loanCB = function ($scope, $routeParams) {
    $scope.message = "";
    $scope.form = {};
    $scope.form.number = $routeParams.id;

    if ($routeParams.amt) {
        $scope.form.amount = parseInt($routeParams.amt);
    }

    $scope.submit = function () {
        $scope.message = "Data is submitted"
    }
};
app.controller('loanCtl', loanCB);


//Marksheet service
app.service('marksheetService', function ($http) {

    //Rest endpoint
    endpoint = "http://api.sunilos.com:9080/ORSP10/Marksheet/";

    this.get = function (id, callbackCtl) {
        var url = endpoint + "get/" + id;
        var promise = $http.get(url);
        promise.then(function (response) {
            callbackCtl(response.data);
        }, function (response) {
            callbackCtl(response, true);
        });
    };

    this.save = function (form, callbackCtl) {
        var url = endpoint + "save";
        var promise = $http.post(url, form);
        promise.then(function (response) {
            callbackCtl(response.data);
        }, function (response) {
            callbackCtl(response, true);
        });
    };

    this.search = function (searchForm, callbackCtl) {
        var url = endpoint + "search";
        $http.post(url, searchForm).then(function (response) {
            callbackCtl(response.data);
        }, function (response) {
            callbackCtl(response, true);
        });
    };

    this.delete = function (id, callbackCtl) {
        var url = endpoint + "delete/" + id;
        $http.get(url).then(function (response) {
            callbackCtl(response.data);
        }, function (response) {
            callbackCtl(response, true);
        });
    };

});


//Marksheet List controller
app.controller('marksheetListCtl', function ($scope, $location, marksheetService) {

    $scope.message = "";
    $scope.list = {};
    $scope.searchForm = {};

    $scope.search = function () {
        console.log(1);
        marksheetService.search($scope.searchForm, function (res, error) {
            console.log(11, res);
            if (error) {
                alert(res);
                return;
            }
            $scope.list = res.result.data;
            console.log($scope.list);
        });
    }

    $scope.edit = function (id) {
        $location.url("marksheet/" + id);
    }

    $scope.new = function () {
        $scope.edit(0);
    }

    $scope.delete = function (id) {
        marksheetService.delete(id, function (res, error) {
            if (error) {
                alert(res);
                return;
            }
            $scope.search();
        });
    }

    $scope.search();

});


//Marksheet List controller
app.controller('marksheetCtl', function ($scope, $routeParams, $location, marksheetService) {

    $scope.message = "";
    $scope.form = {};
    $scope.success = true;

    $scope.display = function () {
        $scope.form.id = $routeParams.id;
        if ($scope.form.id > 0) {
            marksheetService.get($scope.form.id, function (res, error) {
                console.log(12, res);
                if (error) {
                    alert(res);
                    return;
                }
                $scope.form = res.result.data;
            });
        }
    }

    $scope.submit = function () {
        marksheetService.save($scope.form, function (res, error) {
            console.log(11, res);
            if (error) {
                alert(res);
                return;
            }
            $scope.success = res.success;
            if($scope.success){
                $scope.message ="Data is saved";     
            }else{
                $scope.message = res.message;
            }
            $scope.form.id = res.result.data;
        });
    }

    $scope.search = function (id) {
        $location.url("marksheetList");
    }

    $scope.display();

});

