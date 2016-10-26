﻿'use strict';

app.controller('SenadorListaController', ["$rootScope", "$scope", "$tabela", "$api", "$queryString",
    function ($rootScope, $scope, $tabela, $api, $queryString) {

    	var init = function () {
    		document.title = "OPS :: Senador";

    		$scope.filtro = {};

    		var qs = $queryString.search();
    		if (qs.page) {
    			$tabela.params.page = parseInt(qs.page);
    		}
    		if (qs.sorting) {
    			var lstSorting = qs.sorting.split(' ');
    			$tabela.params.sorting = {};
    			$tabela.params.sorting[lstSorting[0]] = lstSorting[1];
    		}

    		OPS.select("#lstParlamentar", "./Api/Senador/Pesquisa", qs.IdParlamentar);
    		$scope.filtro.IdParlamentar = qs.IdParlamentar;

    		OPS.select("#lstDespesa", "./Api/Senador/TipoDespesa", qs.Despesa);
    		$scope.filtro.Despesa = qs.Despesa;

    		//OPS.select("#lstFornecedor", "./Api/Fornecedor/Pesquisa", qs.Fornecedor);
    		$('#txtBeneficiario').val(qs.Fornecedor);
    		$scope.filtro.Fornecedor = qs.Fornecedor;

    		OPS.select("#lstUF", "./Api/Estado", qs.Uf);
    		$scope.filtro.Uf = qs.Uf;

    		OPS.select("#lstPartido", "./Api/Partido", qs.Partido);
    		$scope.filtro.Partido = qs.Partido;

    		$("#txtDocumento").val(qs.Documento);
    		$scope.filtro.Documento = qs.Documento || null;

    		$scope.filtro.Periodo = $("#lstPerido").val(qs.Periodo || "3").trigger('change').val();
    		$scope.TrocaAba(null, parseInt(qs.Agrupamento || '1'));

    		$scope.Pesquisar(true);

    		$('#lstPerido').selectpicker({
    			width: '100%',
    			actionsBox: true,
    			liveSearch: true,
    			liveSearchNormalize: true
    		});
    	}

    	$scope.Pesquisar = function (page_load) {
    		//switch ($("#lstAgrupamento").val()) {
    		//	case '2': $scope.visao = 'despesa.html'; break;
    		//	case '3': $scope.visao = 'fornecedor.html'; break;
    		//	case '4': $scope.visao = 'partido.html'; break;
    		//	case '5': $scope.visao = 'uf.html'; break;
    		//	case '6': $scope.visao = 'documento.html'; break;
    		//	default: $scope.visao = 'parlamentar.html';
    		//}

    		if (!page_load) {
    			$scope.filtro.IdParlamentar = $("#lstParlamentar").val();
    			$scope.filtro.Despesa = $("#lstDespesa").val();
    			$scope.filtro.Uf = $("#lstUF").val();
    			$scope.filtro.Partido = $("#lstPartido").val();
    			$scope.filtro.Fornecedor = $("#lstFornecedor").val();
    			$scope.filtro.Documento = $("#txtDocumento").val() || null;
    			$scope.filtro.Periodo = $("#lstPerido").val();
    			$scope.filtro.Agrupamento = $("#lstAgrupamento").val();

    			delete $tabela.params.sorting;
    			$tabela.params.page = 1;
    		}
    		$scope.BuscaGrid();
    	};

    	$scope.BuscaGrid = function () {
    		$scope.tableParams = $tabela.databind('Senador/Lancamentos', $scope.filtro);
    	}

    	$scope.LimparFiltros = function () {
    		$("#lstParlamentar, #lstDespesa, #lstUF, #lstPartido").selectpicker('deselectAll');
    		$("#txtBeneficiario, #txtDocumento").val('');
    		$("#lstPerido").val('3').selectpicker('refresh');
    		$scope.TrocaAba(null, 1);
    	}

    	$scope.TrocaAba = function ($event, id) {
    		if ($event) {
    			$event.preventDefault();
    		}

    		$rootScope.valor_total = null;
    		$scope.tableParams = null;

    		$('#dvDocumento').hide();
    		$('.nav-tabs li').removeClass('active')
    		$('.aba-' + id).addClass('active');

    		switch (id) {
    			case 1:
    				$scope.visao = 'parlamentar.html';
    				break;
    			case 2:
    				$scope.visao = 'despesa.html';
    				break;
    			case 3:
    				$scope.visao = 'fornecedor.html';
    				break;
    			case 4:
    				$scope.visao = 'partido.html';
    				break;
    			case 5:
    				$scope.visao = 'uf.html';
    				break;
    			case 6:
    				$scope.visao = 'documento.html';
    				$('#dvDocumento').show();
    				break;
    		}

    		$scope.filtro.Agrupamento = id;
    	}

    	init();
    }]);