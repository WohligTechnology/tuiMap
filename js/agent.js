var agent = angular.module('agent', [])

.factory('Agent', function (TravelibroService, $filter) {

    return {
        verifyOtp: function (otp, callback) {
            var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            if (otp.length == 4 && !(format.test(otp))) {
                TravelibroService.http({
                    url: adminURL + "/agent/verifyOtpWeb",
                    data: {
                        otp: otp
                    },
                    method: "POST"
                }).success(callback)
            } else {
                return callback({
                    'value': false
                });
            }
        },
        requestOtp: function () {
            TravelibroService.http({
                url: adminURL + "/agent/requestOtp",
                method: "POST"
            }).success(function (data) {
                console.log(data);
            });
        },
        saveAgentData: function (formData, callback) {
            console.log(formData);
            TravelibroService.http({
                url: adminURL + "/agent/saveAgentDetailsWeb",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },

        saveTour: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/toursPackages/saveWeb",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            });
        },
        deleteTour: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/toursPackages/deleteTour",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            });
        },
        countAdder: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/toursPackages/viewCount",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            });
        },
        getAgentdata: function (formData, callback) {
            console.log(formData, 'agent ka data');
            TravelibroService.http({
                url: adminURL + "/agent/getAgentSection",
                method: "POST",
                data: formData
            }, 'paginationLoad').success(function (data) {
                callback(data);
            })
        },
        saveAgentReview: function (formData, callback) {
            formData.rating = parseInt(formData.rating);
            console.log(formData, 'review Agaya');
            TravelibroService.http({
                url: adminURL + "/testimonials/save",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            })
        },
        getAgentDetails: function (callback) {
            TravelibroService.http({
                url: adminURL + "/agent/getOneAgent",
                method: "POST"
            }).success(function (data) {
                callback(data);
            })
        },
        saveSettings: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/agent/save",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            })
        },
        changePassword: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/agent/changePassword",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            })
        },
        setLeads: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/leads/setLeads",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            })
        },
        agentStatusSave: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/agentStatus/save",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            })
        },
        deleteStatus: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/agentStatus/deleteStatus",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data);
            })
        },
        downloadTourPdf: function (formData, callback) {
            console.log(formData, 'PDF');
            TravelibroService.http({
                url: adminURL + "/download",
                method: "GET",
                params: {
                    id: formData._id,
                    filename: formData.pdf
                }
            }).success(function (data) {
                callback(data);
            })
        },
        getAvgRating: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/testimonials/getAvgRating",
                method: "POST",
                data: {
                    "urlSlug": formData
                }
            }).success(function (data) {
                callback(data);
            })
        },
        getAllLeads: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/Leads/getAllLeads",
                method: "POST",
                data: formData
            }, 'paginationLoad').success(function (data) {
                callback(data);
            })
        },
        getAllProfileViews: function (callback) {
            TravelibroService.http({
                url: adminURL + "/agent/getAllProfileViews",
                method: "POST"
            }).success(function (data) {
                callback(data);
            })
        },
        changeStatus: function (data) {
            TravelibroService.http({
                url: adminURL + "/Leads/changeStatus",
                data: {
                    "_id": data._id,
                    "status": true
                },
                method: "POST"
            })
        },
        updateCoverPhoto: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/agent/updateCoverPhoto",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        savePhotoAlbum: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/album/saveWeb",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        getAgentItinerary: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/itinerary/getAgentItineraryWeb",
                method: "POST",
                data: formData
            }, 'paginationLoad').success(function (data) {
                callback(data)
            });
        },
        getTravelActivity: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/activityfeed/getAgentDataWeb",
                method: "POST",
                data: formData
            }, 'paginationLoad').success(function (data) {
                callback(data)
            });
        },
        getAlbum: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/album/getAlbum",
                method: "POST",
                data: formData
            }, 'paginationLoad').success(function (data) {
                callback(data)
            });
        },
        getViewDownloads: function (formData, callback) {
            TravelibroService.http({
                url: adminURL + "/activityfeed/getViewsDownloads",
                method: "POST",
                data: formData
            }).success(function (data) {
                callback(data)
            });
        },
        getAgentCitySearch: function (formData, callback) {
            TravelibroService.post(adminURL + "/city/searchDestCity", formData).success(callback).error(function (data) {
                console.log(data);
            });
        },
        updateLikeStatusWeb: function (formData, callback) {
            TravelibroService.post(adminURL + "/agentstatus/updateLikeStatusWeb", formData).success(callback).error(function (data) {
                console.log(data);
            });
        },
        getLeadsData: function (formData, callback) {
            TravelibroService.post(adminURL + "/leads/getLeadsData", formData).success(callback).error(function (data) {
                console.log(data);
            })
        },
        getOneAlbum: function (formData, callback) {
            TravelibroService.post(adminURL + "/album/getOneAlbum", formData).success(callback).error(function (data) {
                console.log(data);
            })
        }
    }
});
