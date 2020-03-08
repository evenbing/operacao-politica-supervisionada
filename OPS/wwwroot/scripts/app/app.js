﻿var $EditError = function (ex) {
    var msg = ex.ExceptionMessage || ex.Message || ex.d || ex;
    if (msg)
        alert(msg);
};

var OPS = function ($) {
    $.fn.selectpicker.Constructor.BootstrapVersion = '4';

    var select = function (selector, apiUrl, defaultValues) {
        var $select = $(selector).selectpicker({
            width: '100%',
            liveSearch: true,
            liveSearchNormalize: true,
            selectOnTab: true,
            selectedTextFormat: "count > 3",
            maxOptions: 50,
            style: 'btn-light'
        });

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $select.selectpicker('mobile');
        }

        var onSuccess = function (data) {
            var $lstOption = [];
            if (defaultValues) {
                var lstDefaultValues = defaultValues.split(',')
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    $lstOption.push($('<option></option>').val(item.id).text(item.text)
                        .data('tokens', item.tokens)
                        .attr('selected', lstDefaultValues.indexOf(item.id.toString()) !== -1));
                }
            } else {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    $lstOption.push($('<option></option>').val(item.id).text(item.text)
                        .data('tokens', item.tokens));
                }
            }

            $select.append($lstOption).selectpicker('refresh');
        }

        $.ajax({
            dataType: "json",
            url: apiUrl,
            data: {},
            success: onSuccess
        });
    }

    var objectToQueryString = function (obj, s) {
        s = s || [];
        var r20 = /%20/g
        var lstkeys = Object.keys(obj);

        for (var i = 0; i < lstkeys.length; i++) {
            if (obj[lstkeys[i]]) {
                s.push(lstkeys[i] + '=' + obj[lstkeys[i]]);
            }
        }

        return s.join("&").replace(r20, "+");
    }

    return {
        select: select,
        objectToQueryString: objectToQueryString
    };
}(jQuery);

var app;
(function (angular, $) {
    'use strict';

    app = angular.module('app', ['ngRoute', 'ngTable', 'ngResource', 'ngSanitize', 'ngCookies', 'LocalStorageModule', 'angularUtils.directives.dirDisqus', 'afkl.lazyImage']);

    app.constant('ngAuthSettings', {
        apiServiceBaseUri: base_url,
        clientId: 'ngAuthApp'
    });

    app.config(['$provide', '$routeProvider', '$httpProvider', '$interpolateProvider', '$compileProvider', '$locationProvider',
        function ($provide, $routeProvider, $httpProvider, $interpolateProvider, $compileProvider, $locationProvider) {

            $httpProvider.interceptors.push('authInterceptorService');

            $compileProvider.debugInfoEnabled(false);

            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');

            $routeProvider
                .when("/", { templateUrl: "app/inicio.html?v=" + versao })
                .when("/sobre", { templateUrl: "app/sobre.html?v=" + versao })
                .when("/deputado-federal/documento/:id", { templateUrl: "app/auditoria/deputado-federal-documento.html?v=" + versao })
                .when("/deputado-federal/:id/secretario", { templateUrl: "app/auditoria/deputado-federal-secretario-detalhes.html?v=" + versao })
                .when("/deputado-federal/secretario", { templateUrl: "app/auditoria/deputado-federal-secretario-lista.html?v=" + versao })
                .when("/deputado-federal/frequencia/:id", { templateUrl: "app/auditoria/deputado-federal-frequencia-detalhes.html?v=" + versao })
                .when("/deputado-federal/frequencia", { templateUrl: "app/auditoria/deputado-federal-frequencia-lista.html?v=" + versao })
                .when("/deputado-federal/conheca", { templateUrl: "app/auditoria/deputado-federal-conheca.html?v=" + versao })
                .when("/deputado-federal/:id", { templateUrl: "app/auditoria/deputado-federal-detalhes.html?v=" + versao })
                .when("/deputado-federal", { templateUrl: "app/auditoria/deputado-federal-lista.html?v=" + versao })

                .when("/senador/:id", { templateUrl: "app/auditoria/senador-detalhes.html?v=" + versao })
                .when("/senador", { templateUrl: "app/auditoria/senador-lista.html?v=" + versao })

                .when("/deputado-estadual/:id", { templateUrl: "app/auditoria/deputado-estadual-detalhes.html?v=" + versao })
                .when("/deputado-estadual", { templateUrl: "app/auditoria/deputado-estadual-lista.html?v=" + versao })

                .when("/fornecedor/:id", { templateUrl: "app/auditoria/fornecedor.html?v=" + versao })

                //.when("/forum", { templateUrl: "app/forum" })

                //.when("/solicitacao-restituicao", { templateUrl: "app/solicitacao-restituicao" })

                //.when("/fiscalize", { templateUrl: "app/fiscalize/nota-fiscal-lista" })
                //.when("/fiscalize/:id", { templateUrl: "app/fiscalize/nota-fiscal-detalhes" })

                .when("/busca", { controller: "BuscaController", templateUrl: "app/busca.html?v=" + versao })

                .when("/login", { controller: "LoginController", templateUrl: "app/autenticacao/login.html?v=" + versao })
                .when("/signup", { controller: "SignupController", templateUrl: "app/autenticacao/signup.html?v=" + versao })
                .when("/refresh", { controller: "RefreshController", templateUrl: "app/autenticacao/refresh.html?v=" + versao })
                .when("/tokens", { controller: "TokensManagerController", templateUrl: "app/autenticacao/tokens.html?v=" + versao })
                .when("/reset-password", { controller: "ResetPasswordController", templateUrl: "app/autenticacao/reset-password.html?v=" + versao })
                .when("/set-password", { controller: "SetPasswordController", templateUrl: "app/autenticacao/set-password.html?v=" + versao })
                .when("/verify-email", { controller: "VerifyEmailController", templateUrl: "app/autenticacao/verify-email.html?v=" + versao })
                .when("/account", { controller: "AccountController", templateUrl: "app/autenticacao/account.html?v=" + versao })

                .when("/denuncia", { controller: "DenunciasListaController", templateUrl: "app/denuncia/denuncia-lista.html?v=" + versao })
                .when("/denuncia/:id", { controller: "DenunciaDetalhesController", templateUrl: "app/denuncia/denuncia-detalhes.html?v=" + versao })

                .when("/404", { templateUrl: "app/erro/404.html?v=" + versao })

                .otherwise({ redirectTo: '/' });
        }]);

    app.run(['$rootScope', '$http', '$location', '$templateCache', 'authService',
        function ($rootScope, $http, $location, $templateCache, authService) {
            $rootScope.countRequest = 1;
            authService.fillAuthData();

            $http.get('app/inicio.html?v=' + versao, { cache: $templateCache });

            $rootScope.$on('$locationChangeStart', function (event) {
                $rootScope.countRequest = 1;
            });

            $rootScope.$on('$locationChangeSuccess', function (event) {
                var path = $location.path();
                var $navbar = $('#navbar');
                
                if (path === '/' || path === '/inicio') {
                    $navbar.removeClass('border-bottom shadow-sm');
                } else if (!$('#navbar').hasClass('border-bottom shadow-sm')) {
                    $navbar.addClass('border-bottom shadow-sm');
                }

                $navbar.find('a.active').removeClass('active');
                if (path === '/sobre') {
                    $('#nav-sobre').addClass('active');
                } else if (path.indexOf('/deputado-federal') !== -1) {
                    $('#nav-camara').addClass('active');
                } else if (path.indexOf('/senador') !== -1) {
                    $('#nav-senado').addClass('active');
                }

                $rootScope.countRequest = 0;

                setTimeout(function () {
                    ga('send', 'pageview', { 'page': path });
                }, 1000);

                //$('body').animate({ scrollTop: 0 }, 0);
            });
        }]);

    app.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        }

        var _responseError = function (rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                var authData = localStorageService.get('authorizationData');

                if (authData) {
                    if (authData.useRefreshTokens) {
                        $location.path('/refresh');
                        return $q.reject(rejection);
                    }
                }

                authService.logOut();
                localStorageService.set('returnUrl', $location.url());
                $location.path('/login');
            }
            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }]);

    app.factory('authService', ['$http', '$q', '$rootScope', 'localStorageService', 'ngAuthSettings', function ($http, $q, $rootScope, localStorageService, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: false
        };

        var _externalAuthData = {
            provider: "",
            userName: "",
            externalAccessToken: ""
        };

        var _saveRegistration = function (registration) {
            $rootScope.countRequest++;
            _logOut();

            return $http.post(serviceBase + 'api/account/register', registration).success(function (response) {
                $rootScope.countRequest--;
                return response;
            }).error(function (err, status) {
                $rootScope.countRequest--;
            });

        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + ngAuthSettings.clientId;
            }

            var deferred = $q.defer();

            $rootScope.countRequest++;
            $http.post(serviceBase + 'api/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                $rootScope.countRequest--;

                if (loginData.useRefreshTokens) {
                    localStorageService.set('authorizationData', {
                        token: response.access_token,
                        userName: loginData.userName,
                        firstName: response.firstName,
                        userRoles: response.userRoles,
                        refreshToken: response.refresh_token,
                        useRefreshTokens: true
                    });
                }
                else {
                    localStorageService.set('authorizationData', {
                        token: response.access_token,
                        userName: loginData.userName,
                        firstName: response.firstName,
                        userRoles: response.userRoles,
                        refreshToken: "",
                        useRefreshTokens: false
                    });
                }
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                _authentication.firstName = response.firstName;
                _authentication.useRefreshTokens = loginData.useRefreshTokens;

                deferred.resolve(response);

            }).error(function (err, status) {
                $rootScope.countRequest--;
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.firstName = "";
            _authentication.useRefreshTokens = false;

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.firstName = authData.firstName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
            }

        };

        var _refreshToken = function () {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                if (authData.useRefreshTokens) {

                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                    localStorageService.remove('authorizationData');

                    $rootScope.countRequest++;
                    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                        $rootScope.countRequest--;

                        localStorageService.set('authorizationData', {
                            token: response.access_token,
                            userName: response.userName,
                            firstName: response.firstName,
                            userRoles: response.userRoles,
                            refreshToken: response.refresh_token,
                            useRefreshTokens: true
                        });

                        deferred.resolve(response);

                    }).error(function (err, status) {
                        $rootScope.countRequest--;
                        _logOut();
                        deferred.reject(err);
                    });
                }
            }

            return deferred.promise;
        };

        var _obtainAccessToken = function (externalData) {

            var deferred = $q.defer();

            $rootScope.countRequest++;
            $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {
                $rootScope.countRequest--;

                localStorageService.set('authorizationData', {
                    token: response.access_token,
                    userName: response.userName,
                    firstName: response.firstName,
                    userRoles: response.userRoles,
                    refreshToken: "",
                    useRefreshTokens: false
                });

                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.firstName = response.firstName;
                _authentication.userRoles = response.userRoles;
                _authentication.useRefreshTokens = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                $rootScope.countRequest--;
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _registerExternal = function (registerExternalData) {

            var deferred = $q.defer();
            $rootScope.countRequest++;

            $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {
                $rootScope.countRequest--;

                localStorageService.set('authorizationData', {
                    token: response.access_token,
                    userName: response.userName,
                    firstName: response.firstName,
                    userRoles: response.userRoles,
                    refreshToken: "",
                    useRefreshTokens: false
                });

                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.firstName = response.firstName;
                _authentication.userRoles = response.userRoles;
                _authentication.useRefreshTokens = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                $rootScope.countRequest--;
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;

        authServiceFactory.obtainAccessToken = _obtainAccessToken;
        authServiceFactory.externalAuthData = _externalAuthData;
        authServiceFactory.registerExternal = _registerExternal;

        return authServiceFactory;
    }]);

    app.factory('tokensManagerService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var tokenManagerServiceFactory = {};

        var _getRefreshTokens = function () {

            return $http.get(serviceBase + 'api/refreshtokens').then(function (results) {
                return results;
            });
        };

        var _deleteRefreshTokens = function (tokenid) {

            return $http.delete(serviceBase + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
                return results;
            });
        };

        tokenManagerServiceFactory.deleteRefreshTokens = _deleteRefreshTokens;
        tokenManagerServiceFactory.getRefreshTokens = _getRefreshTokens;

        return tokenManagerServiceFactory;

    }]);

    app.factory('$api', ['$http', '$location', '$rootScope', '$cacheFactory', '$q', function ($http, $location, $rootScope, $cacheFactory, $q) {
        //http://stackoverflow.com/questions/28669537/angularjs-abort-cancel-running-http-calls
        var promiseCanceller = $q.defer();

        var _$http = function (method, url, params, data) {
            $rootScope.countRequest++;
            var urlCompleta = ("./api/" + url).toLowerCase();

            return $http({
                method: method,
                url: urlCompleta,
                params: params, //querystring
                data: data
            }).success(function () {
                $rootScope.countRequest--;

            }).error(function (data, status, headers, config) {
                $rootScope.countRequest--;

                if (status === 404)
                    $location.path('/404').replace();
                if (status !== 401)
                    $EditError(data);
            });
        }

        return {
            get: function (controller, id) {
                return _$http('GET', controller + (id || id === 0 ? "/" + id : ''), null, null);
            },
            post: function (controller, model) {
                return _$http('POST', controller, null, model);
            },
            delete: function (controller, id) {
                return _$http('DELETE', controller + "/" + id, null, null);
            },
            put: function (controller, id, model) {
                return _$http('PUT', controller + "/" + id, null, model);
            }
        };
    }]);

    //app.service('$locationEx', ['$location', '$route', '$rootScope', function ($location, $route, $scope) {
    //    $location.skipReload = function () {
    //        var lastRoute = $route.current;
    //        var un = $scope.$on('$locationChangeSuccess', function () {
    //            $route.current = lastRoute;

    //            un(); //unsubscribes
    //        });

    //        //Quando a rota é alterada para a mesma que esta, o evento $locationChangeSuccess não é chamado e com isso a proxima navegação não estava funcionado.
    //        setTimeout(un, 100); //unsubscribes
    //        return $location;
    //    };
    //    return $location;
    //}]);

    app.factory('$tabela', ["$rootScope", "$resource", "NgTableParams", "$location",
        function ($rootScope, $resource, NgTableParams, $location) {
            var path = $location.path();
            var params = { page: 1, count: 100 };

            return {
                params: params,
                databind: function (url, filter, storeFilter) {
                    var _$resource = $resource('./api/' + url, filter || {}, {
                        query: {
                            method: "GET"
                        }
                    });

                    return new NgTableParams(params, {
                        counts: false,
                        filterDelay: 300,
                        getData: function (paramsInner) {
                            $rootScope.countRequest++;

                            var paramsSorting = paramsInner.sorting();
                            var sorting = '';
                            if (Object.keys(paramsSorting).length > 0) {
                                var key = Object.keys(paramsSorting)[0];
                                sorting = key + ' ' + paramsSorting[key];
                            }


                            var ngTableFilter = {};
                            if (Object.keys(paramsInner.filter()).length > 0) {
                                angular.copy(paramsInner.filter(), ngTableFilter); //DeepCopy
                            }

                            ngTableFilter['sorting'] = sorting;
                            ngTableFilter['count'] = paramsInner.count();
                            ngTableFilter['page'] = paramsInner.page();

                            return _$resource.query(ngTableFilter)
                                .$promise
                                .then(function (data) {
                                    //salvar a pesquisa atual na URL, para histórico e compartlhamento.
                                    //filter['sorting'] = sorting || undefined;
                                    ////filter['count'] = params.count();
                                    //if (paramsInner.page() > 1) {
                                    //    filter['page'] = paramsInner.page();
                                    //}

                                    // HACH: ao voltar 2x estava aplicando o filtro indevidamente a pagina que poderia quebrar.
                                    if (storeFilter !== false && path === $location.path()) {
                                        $location.search(filter);
                                        //$locationEx.skipReload().path($location.path()).search(filter).replace();
                                        //console.log(filter);

                                        // Esperar carregar o grid e levar para o grid, util quando paginando e filtrando.
                                        setTimeout(function () {
                                            $('body').animate({ scrollTop: $('.scroll-mark').offset().top }, 600);
                                        }, 50);
                                    }

                                    if (data.valor_total) {
                                        setTimeout(LoadPopoverAuditoria, 100);
                                        $rootScope.valor_total = data.valor_total;
                                    }

                                    $rootScope.countRequest--;
                                    paramsInner.total(data.total_count);
                                    return data.results;
                                })
                                .catch(function (response) {
                                    $rootScope.countRequest--;
                                    alert(response.message || response.data.ExceptionMessage);
                                });
                        }
                    });
                }
            };
        }]);

    app.factory("$queryString", ["$window", "$location", function ($window, $location) {
        function search() {

            var left = $window.location.search
                .split(/[&||?]/)
                .filter(function (x) { return x.indexOf("=") > -1; })
                .map(function (x) { return x.split(/=/); })
                .map(function (x) {
                    x[1] = x[1].replace(/\+/g, " ");
                    return x;
                })
                .reduce(function (acc, current) {
                    acc[current[0]] = current[1];
                    return acc;
                }, {});

            var right = $location.search() || {};

            var leftAndRight = Object.keys(right)
                .reduce(function (acc, current) {
                    acc[current] = right[current];
                    return acc;
                }, left);

            return leftAndRight;
        }

        return {
            search: search
        };

    }]);

}(window.angular, window.jQuery));


/* AuditoriaPF.aspx */
function loadAuditoriaPF() {
    $("#dialog-message").dialog({
        modal: true,
        autoOpen: false,
        height: 500,
        width: 800,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
};

function ExibeOqueProcurar() {
    $("#dialog-message").dialog("open");
}

function Denunciar() {
    window.parent.TabDenuncia($('#LabelCNPJ').text(), $('#LabelRazaoSocial').text());
}

function Doacoes() {
    window.parent.TabDoacoes($('#LabelCNPJ').text(), $('#LabelRazaoSocial').text());
}

function LoadPopoverAuditoria() {
    $('.popover-link').each(function () {
        $(this).popover({
            html: true,
            sanitize: false,
            trigger: 'manual',
            content: function () {
                return $('#popover_content_wrapper').html();
            }
        }).click(function (e) {
            e.preventDefault();
            $('.popover').popover('hide');

            $(this).popover('toggle');
            $('.popover .btn').click(function (e) {
                var agrupamento = parseInt($(this).data('valor'));
                if (agrupamento !== 0) {

                    var popover_content_id = $(this).closest('.popover').prop('id');
                    var $buttonDetalhar = $('a.popover-link[aria-describedby="' + popover_content_id + '"]');

                    var valor = $buttonDetalhar.data('valor');
                    var descricao = $buttonDetalhar.data('descricao');

                    var $select;
                    var Agrupamento = parseInt($('#lstAgrupamento').val());
                    switch (Agrupamento) {
                        case 1:
                            $select = $('#lstParlamentar');
                            break;
                        case 2:
                            $select = $('#lstDespesa');
                            break;
                        case 3:
                            $select = $('#txtBeneficiario');
                            break;
                        case 4:
                            $select = $('#lstPartido');
                            break;
                        case 5:
                            $select = $('#lstUF');
                            break;
                        case 6:
                            $select = $('#txtDocumento');
                            break;
                    }
                    if (Agrupamento != 3) {
                        var $selectItens = $select.find('option[value="' + valor + '"]');
                        if ($selectItens.length > 0) {
                            $selectItens.attr('selected', 'selected').selectpicker('refresh');
                        } else {
                            var $option = $('<option selected></option>').val(valor).text(descricao);
                            $select.append($option);
                        }
                        $select.selectpicker('refresh');
                    } else {
                        $select.val(valor); //input
                    }

                    angular.element('.aba-' + agrupamento + ' a').trigger('click'); //call ngClick
                    angular.element('#ButtonPesquisar').trigger('click'); //call ngClick
                }

                $(this).parents('.popover').popover('hide');
            });
        });
    });
}

var _urq = _urq || [];
function loadSiteMaster() {
    setTimeout(function () {
        _urq.push(['setGACode', GoogleAnalyticsKey]);
        _urq.push(['setPerformInitialShorctutAnimation', false]);
        _urq.push(['initSite', '9cf4c59a-d438-48b0-aa5e-e16f549b9c8c']);

        (function () {
            var ur = document.createElement('script'); ur.type = 'text/javascript'; ur.async = true;
            ur.src = document.location.protocol + '//cdn.userreport.com/userreport.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ur, s);
        })();

        var interval = setInterval(function () {
            if ($('#crowd-shortcut').length == 1) {
                clearInterval(interval);

                $('#crowd-shortcut').parent().css('top', '84px');
            }
        }, 100);

        /* Facebook */
        //window.fbAsyncInit = function () {
        //	FB.init({
        //		appId: '1033624573364106',
        //		xfbml: true,
        //		version: 'v2.8'
        //	});
        //};

        //(function (d, s, id) {
        //	var js, fjs = d.getElementsByTagName(s)[0];
        //	if (d.getElementById(id)) { return; }
        //	js = d.createElement(s); js.id = id;
        //	js.src = "//connect.facebook.net/en_US/sdk.js";
        //	fjs.parentNode.insertBefore(js, fjs);
        //}(document, 'script', 'facebook-jssdk'));
    }, 3000); //Não bloquear a carga da tela
}

function ReportarErro(e, self) {
    trackOutboundLink(self, true);

    if ($('#crowd-shortcut').length > 0) {
        _urq.push(['Feedback_Open', 'submit/bug']);

        e.preventDefault();
        return false;
    }
}

function DeixarUmaIdeia(e, self) {
    trackOutboundLink(self, true);

    if ($('#crowd-shortcut').length > 0) {
        _urq.push(['Feedback_Open', 'ideias/popular']);

        e.preventDefault();
        return false;
    }
}

/* Google Analytics */
try {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', GoogleAnalyticsKey, 'auto');
    //ga('send', 'pageview');
} catch (e) { }

/**
* Função que acompanha um clique em um link externo no Analytics.
* Essa função processa uma string de URL válida como um argumento e usa essa string de URL
* como o rótulo do evento. Ao definir o método de transporte como 'beacon', o hit é enviado
* usando 'navigator.sendBeacon' em um navegador compatível.
*/
var trackOutboundLink = function (self, isExternal) {
    var url = $(self).attr('href');

    if (ga.hasOwnProperty('loaded') && ga.loaded === true) {
        //Success, ga is loaded
        ga('send', 'event', {
            'eventCategory': 'Outbound',
            'eventAction': 'Link',
            'eventLabel': url,
            'eventValue': 1,
            'hitCallbackTimeout': 500, // ms
            'hitCallback': function () {
                if (!isExternal) { document.location = url; }
            },
            'hitCallbackFail': function () {
                console.log("Unable to send Google Analytics data");
            }
        });
    } else {

        // Google Analytics is blocked
        if (!isExternal) {
            document.location = url;
        }
    }

    return isExternal;
}

// https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings
// Feature detects Navigation Timing API support.
if (window.performance) {
    // Sends the hit, passing `performance.now()` as the timing value.
    ga('send', 'timing', 'JS Dependencies', 'load', performance.now());
}


//Highcharts.theme = {
//    colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']
//    //colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
//    //colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
//    //colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee']
//    //colors: ['#514F78', '#42A07B', '#9B5E4A', '#72727F', '#1F949A', '#82914E', '#86777F', '#42A07B']
//    //colors: ['#FDD089', '#FF7F79', '#A0446E', '#251535'],
//};

//// Apply the theme
//Highcharts.setOptions(Highcharts.theme);

Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: {
        decimalPoint: ',',
        thousandsSep: '.'
    }
});