var fileuploadservicemod = angular.module('fileuploadservicemod', []);
fileuploadservicemod.service('FileUploadService', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })

        .success(function (data, status) {
            console.log(data);
        })

        .error(function () {});
    }
}]);