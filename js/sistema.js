
	var markers = [];
	var markersArray = [];
	var radiuses = [];
	var markerCluster;
	var map;
	var geocoder = new google.maps.Geocoder();
	var infowindow = new google.maps.InfoWindow();
	
	var clienteMarker = {}
	
	
function success(position) {
	map.setCenter(position);
}

function infoWindow(content, latlng){
	infowindow.setContent(content);
	infowindow.setPosition(latlng);
	infowindow.open(map);
}

function limpaClienteMarker(){
	for(x in clienteMarker){
		clienteMarker[x].setMap(null);
	}
}			
function addClienteMarker(data){
	var markers = [];
	for(x in data){
	
		marker_index = data[x].latitude+','+data[x].longitude;
		
		if(clienteMarker[marker_index]){
			clienteMarker[marker_index].data.push(data[x]);
			if(clienteMarker[marker_index].getMap() == null){
				clienteMarker[marker_index].setMap(map)
			}
		} else {
			clienteMarker[marker_index] = new google.maps.Marker({
				position: new google.maps.LatLng(data[x].latitude, data[x].longitude), 
				map: map,
				data: [data[x]],
				icon:'img/modulo-icon-on.png'
			});	
			
			google.maps.event.addListener(clienteMarker[marker_index], 'rightclick', function(event) {
				addMarker(event);
			});			
			
			google.maps.event.addListener(clienteMarker[marker_index], 'click', function(event){
				htmlContent = "<b>Clientes</b>:<br/>"
				for(x in this.data){
					htmlContent+= "<a href='javascript:;' onclick='showCliente(this, " + this.data[x].id + ")'>" + this.data[x].nome + "</a><br/>";
				}
				infowindow.setContent(htmlContent);
				infowindow.setPosition(event.latLng);
				infowindow.open(map);						
			}); 
		}		
	}
}
	
  
			
	function addMarker(event) {
	
			infoWindow("<b>Carregando...</b>", event.latLng)
			
			geocoder.geocode({location:event.latLng}, function(results, status){
			
				resultados = {}
				$.map(results, function(item){
					if(typeof(resultados[item.types[0]]) == 'undefined'){
						resultados[item.types[0]] = []
					}
					
					for(x in item.address_components){
						if(item.address_components[x].types.length > 0){
							item[item.address_components[x].types[0]] = item.address_components[x].long_name;
						}
					}
					resultados[item.types[0]].push(item);
				});
				
				results = [];
				for(x in resultados){
					for(y in resultados[x]){
						results.push(resultados[x][y]);
					}
				}			
				
				types_labels = {
					'locality':'Cidades', 
					'sublocality':'Bairros', 
					'route':'Ruas', 
					'street_address':'Endereços',
					'postal_code':'Endereços com CEP'
				}
				
				
				$("#cadastro").find(":input.cep").val(results[0].postal_code);		   
				$("#cadastro").find(":input.endereco").val(results[0].route);		
				$("#cadastro").find(":input.numero").val(					);	
				$("#cadastro").find(":input.complemento").val(				);	
				$("#cadastro").find(":input.bairro").val(results[0].sublocality);	
				$("#cadastro").find(":input.cidade").val(results[0].locality);	
				$("#cadastro").find(":input.estado").val(results[0].administrative_area_level_1);	
				$("#cadastro").find(":input.telefone_fixo").val(			);	
				$("#cadastro").find(":input.telefone_movel").val(			);
				$("#cadastro").find(":input.latitude").val(event.latLng.lat());
				$("#cadastro").find(":input.longitude").val(event.latLng.lng());
				console.log(results[0]);
				buttons = "<button class='cadastro'>Cadastro</button>";
				var x = $("<div>").css({
					'font-size':'14px',
					'text-align':'center',
					'marigin':'10px'
				}).html("<div><b>" + results[0].route + "</b> <br/>" + results[0].sublocality + '<br/>' + buttons);
				
				infowindow.setContent(x[0]);
			});  			
			
			
			google.maps.event.addListener(infowindow, 'domready', function(event,b,c,d) {
				$(".cadastro").click(function(){
					$("#cadastro").dialog('open');
				});
			});		
			//google.maps.event.addListener(infowindow, 'closeclick', function(event,b,c,d) {
			//	console.log([this,b,c,d]);
			//});				
			
  
			$("#cadastro").dialog({
				autoOpen:false,
				title:'Cadastro de Cliente',
				open:function(){
					$(this).find(".inputs > label").show().not(":eq(0)").hide();
					$(this).dialog("option", "position", 'center');	
					
					$('.ui-dialog-buttonpane').find('button:contains("Voltar")').button({disabled: true, icons:{primary:'ui-icon-carat-1-w'}});
					$('.ui-dialog-buttonpane').find('button:contains("Avançar")').button({icons:{secondary:'ui-icon-carat-1-e'}});
				},
				modal:true,
				//position: [event.pageX, event.pageY],
				position: 'center',
				buttons:{
					'Voltar':function(){
						var atual = $(this).find(".inputs > label:visible");
						
						// Habilita/Desabilita botão Voltar
						if($(this).find(".inputs > label").index(atual) == 1){
							$('.ui-dialog-buttonpane').find('button:contains("Voltar")').button({disabled: true});
						}
						
						if(atual.prev().length > 0){
							atual.hide();
							atual.prev().show();
						}
					},
					'Avançar':function(){
						var atual = $(this).find(".inputs > label:visible");
						var dialog = $(this);
						console.log($(this).find(".inputs > label").index(atual));
						
						buttons = $( "#cadastro" ).dialog( "option", "buttons");
						
						// Habilita/Desabilita botão Voltar
						if($(this).find(".inputs > label").index(atual) == 0){
							$('.ui-dialog-buttonpane').find('button:contains("Voltar")').button({disabled: false});
						}
						
						if($(this).find(".inputs > label").index(atual) == 11){
							var $post = $(this).find(":input").serialize();
							$.post("services.php", "save=true&" + $post, function(data){
								addClienteMarker(data);
								dialog.dialog('close');
								infowindow.close();
							}, 'json');	
							
						}
						
						if(atual.next().length > 0){
							atual.hide();
							atual.next().show();
						}
						
					}
				}
			});
			//if(x = prompt("Vai?")){
			//	marker.setTitle(x);
			//	markers.push(marker);
			//} else {
			//	marker.setMap(null);
			//}
			//google.maps.event.addListener(marker, 'click', function(event) {
			//	alert("Marked");
			//});	
		//});
		
	}  


function error(msg) {

}
		
		
function showCliente(a,b){
	$.post("services.php", "cliente=" + b, function(data){
	endHtml = "";
		for(x in data[0]){
			endHtml+= "<b>" + x + "</b>: " + data[0][x] + "<br/>"
		}
		$("#informacoesDoCliente").html(
			endHtml
		).dialog({
			title:'Informações do Cliente',
			modal:true,
			zIndex:9999
		});
	}, 'json');
}
$(document).ready(function() {
	geocoder.geocode({address:'Santos, São Paulo, Brasil'}, function(results, status){
		var latlng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
		var myOptions = {
			zoom: 15,
			center: latlng,
			mapTypeControl: false,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};						
		
		map = new google.maps.Map($("#mapcanvas").get(0), myOptions);

		google.maps.event.addListener(map, 'rightclick', function(event) {
			addMarker(event);
		});			
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(function(geoposition){
			latlng = new google.maps.LatLng(geoposition.coords.latitude, geoposition.coords.longitude)
			map.setCenter(latlng);
			marker = new google.maps.Marker({
				position: latlng, 
				map: map,
				icon:'img/user-icon-on.png'
			});	
		  }, error);
		} else {
		  error('not supported');
		}		
	})

	
	$("#verClientes").click(function(){
		$.post("services.php", "clientes=true", function(data){ limpaClienteMarker(); addClienteMarker(data); }, 'json');
	});
	
	$("#pegaEndereco").click(function(){
		geocoder.geocode({location:map.getCenter()}, function(results, status){
			$("<div>").html("<b>Endereço:</b> " + results[0].formatted_address + "<br/><b>Location Type:</b>" + results[0].geometry.location_type).dialog();
		})                  
	});
		
		
	
	
	
	
	//
	$.widget( "custom.catcomplete", $.ui.autocomplete, {
		_renderMenu: function( ul, items ) {
			var self = this,
				currentCategory = "";
			$.each( items, function( index, item ) {
				if ( item.category != currentCategory ) {
					ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
					currentCategory = item.category;
				}
				self._renderItem( ul, item );
			});
		}
	});
$("#search > :text").catcomplete({
	minLength:3,
	source: function(request, response) {
		geocoder.geocode( {
		
			address : request.term + ', Brasil',
			bounds : map.getBounds(),
			location : map.getCenter(),
			region : 'BR'
			
		
		}, function(results, status) { 
		
			//console.log(results);
			resultados = {}
			$.map(results, function(item){
				if(typeof(resultados[item.types[0]]) == 'undefined'){
					resultados[item.types[0]] = []
				}
				
				for(x in item.address_components){
					if(item.address_components[x].types.length > 0){
						item[item.address_components[x].types[0]] = item.address_components[x].long_name;
					}
				}
				resultados[item.types[0]].push(item);
			});
			
			results = [];
			for(x in resultados){
				for(y in resultados[x]){
					results.push(resultados[x][y]);
				}
			}			
			
			types_labels = {
				'locality':'Cidades', 
				'sublocality':'Bairros', 
				'route':'Ruas', 
				'street_address':'Endereços',
				'postal_code':'Endereços com CEP'
			}
			if (status == google.maps.GeocoderStatus.OK) {

				response($.map(results, function(item){
					if($.inArray(item.types[0], ['locality', 'sublocality', 'route', 'street_address', 'postal_code']) == -1){
						return;
					}
					
					
					return {
						label: 	item.formatted_address.replace(/(, \d{5}-\d{3}, Brasil|, Brasil)/gi, ''),
						value: 	item.formatted_address,
						lat:	item.geometry.location.lat(),
						lng:	item.geometry.location.lng(),
						bounds:	item.geometry.bounds,
						viewport: item.geometry.viewport,
						category: types_labels[item.types[0]]
					}
				}));
			}
		});
	},
	select:function(event, ui){
	
		
		//console.log(ui.item);
		map.setCenter(new google.maps.LatLng(ui.item.lat, ui.item.lng));
		map.fitBounds(ui.item.viewport);
		//var polygon = new google.maps.Rectangle({map: map, bounds: ui.item.bounds});
		$.getJSON("services.php", null, function(data){
			for(x in data){
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(data[x].latitude, data[x].longitude), 
					map: window.map
				});	
				
				markers.push(marker);
			}
			
			markerCluster = new MarkerClusterer(map, markers);
			//markerCluster.removeMarkers(markers)
		});
		//ne = ui.item.bounds.getNorthEast();
        //sw = ui.item.bounds.getSouthWest();
        //
        //list = randomMarkers(ne.lat(), sw.lng(), sw.lat(), ne.lng());
		//console.log(list);
		//for (x in list){
		//
		//	var marker = new google.maps.Marker({
		//		position: new google.maps.LatLng(list[x].lat, list[x].lng), 
		//		map: window.map
		//	});	
		//}
		//		var latlng = new google.maps.LatLng(item.lat, item.lng);
		//		var marker = new google.maps.Marker({
		//			position: latlng, 
		//			map: window.map, 
		//			title:item.label
		//		});	
		//		
		//		map.setCenter(latlng);		
	}
});
		//$("#search > :text").autocomplete({
		//	source: function( request, response ) {
		//		$.ajax({
		//			url: "http://ws.geonames.org/searchJSON",
		//			dataType: "jsonp",
		//			data: {
		//				featureClass: "P",
		//				style: "full",
		//				maxRows: 12,
		//				name_startsWith: request.term
		//			},
		//			success: function( data ) {
		//				response( $.map( data.geonames, function( item ) {
		//					return {
		//						label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
		//						value: item.name,
		//						lng: item.lng,
		//						lat: item.lat
		//						
		//					}
		//				}));
		//			}
		//		});
		//	},
		//	minLength: 2,
		//	select: function( event, ui ) {
		//		item = ui.item;
		//		var latlng = new google.maps.LatLng(item.lat, item.lng);
		//		var marker = new google.maps.Marker({
		//			position: latlng, 
		//			map: window.map, 
		//			title:item.label
		//		});	
		//		
		//		map.setCenter(latlng);			
		//		//log( ui.item ?
		//		//	"Selected: " + ui.item.label :
		//		//	"Nothing selected, input was " + this.value);
		//		//sistema de pesquisa e estatistica de imóveis
		//	},
		//	open: function() {
		//		$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		//	},
		//	close: function() {
		//		$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		//	}
		//});	
		
	$("#slideshow").css("overflow", "hidden");
	$("#acionarLogin").toggle(
		function(){ $("#loginbox").fadeIn(); },
		function(){ $("#loginbox").fadeOut(); } 
	);
	$("ul#slides").cycle({
		fx: 'scrollHorz',
		//pause: 1,
		prev: '#prev',
		next: '#next',
		timeout:0
	});
	$("#prev, #next").hide();
	$("#slideshow").hover(function() {
    	$("#prev, #next").fadeIn();
  	},
  		function() {
    	$("#prev, #next").fadeOut();
  	});
	
	// Bug do "não sei porque".
	$("#nav").css({position:'absolute'})
	
});
			
		//	$("#slideshow").css({
		//		overflow:'hidden'
		//	});
        //
		//	$("#slideshow").hover(function() {
		//		$("ul#nav").fadeIn();
		//	}, function() {
		//		$("ul#nav").fadeOut();
		//	});
		//	
		//	$("#slides > div").css({
		//		width:'660px',
		//		height:'260px',
		//		border:'0px'
		//	});
		//	 
		//	$("#slides > div").position({
		//		of:$("#slideshow"),
		//		my:'center, center',
		//		at:'center, center',
		//		colision:'fit fit'
		//	});
	//	//	
	//	//	$("#slides > div").find(".slide").position({
	//	//		of:$("#slides"),
	//	//		my:'center, center',
	//	//		at:'center, center',
	//	//		colision:'fit fit'
	//	//	});
	//	//	//$("#seta_esquerda").css({
	//	//	//	left: 0	,
	//	//	//	right: 'auto'		
	//	//	//});	
	//	//	//$("#seta_direita").css({
	//	//	//	left: 'auto',
	//	//	//	right: 0			
	//	//	//});				
	//	//	//$("#seta_esquerda").position({
	//	//	//	of:$("#slides"),
	//	//	//	my:'right, top',
	//	//	//	at:'right, top'
	//	//	//});
    //  //
	//	//	
	//	//	$("#slides, #slides > div").css('border', '0px').find(".slide");
	//	//	$("#slides").css({overflow:'hidden'});
	//	//	
		//	$("#next").click(slide);
		//	function slide(){
		//		var $slides_width = $("#slides").width();				
		//		var $slide_atual = $("#slides").find(".slide:last");
		//		
		//		console.log($slide_atual);
		//		
		//		
		//		$slide_atual.prev().css({marginLeft:"-=" + $slides_width + "px"});
		//		//
		//		//$("#slides").find(".slide").position({
		//		//	of:$("#slideshow"),
		//		//	my:'center, center',
		//		//	at:'center, center',
		//		//	colision:'fit fit'
		//		//});				
		//		//
		//		$("#slides").animate({
		//			marginLeft:"+=" + $slides_width + "px"
		//		}, 1500, function(){ 
		//			$slide_atual.prependTo("#slides");
		//			$("#slides > div").css({
		//				width:'660px',
		//				height:'260px',
		//				border:'0px'
		//			});
		//			 
		//			//$("#slides > div").position({
		//			//	of:$("#slideshow"),
		//			//	my:'center, center',
		//			//	at:'center, center',
		//			//	colision:'fit fit'
		//			//});		
		//		});			
		//		//
		//		$slide_atual.prev().animate({
		//			marginLeft:"+=" + $slides_width + "px"
		//		}, 1500, function(){
		//		});
		//	
		//	}
	//		
	//		$("#slides > span").css('z-index', '9999');
	//		//$("#slides > div:not(:eq(2))").hide();
	//		//$("#slides").removeClass();
	

				//var places = new google.maps.places.PlacesService(map);
		//places.search({
		//	name:request.term,
		//	location: map.getCenter(),
		//	radius: '10000' 
		//	,types:['locality', 'sublocality']
		//}, function(results, status) { 
		//	if (status == google.maps.GeocoderStatus.OK) {
		//		//console.log(results);
		//		//objeto_final = {}
		//		//for(x in results[0].address_components){		
		//		//	objeto_final[results[0].address_components[x].types[0]] = results[0].address_components[x].long_name;	
		//		//}
		//		//objeto_final['label'] = results[0].formatted_address
		//		console.log(results);
		//		response($.map(results, function(item){
		//			return {
		//				label: 	item.name,
		//				value: 	item.formatted_address,
		//				lat:	item.geometry.location.lat(),
		//				lng:	item.geometry.location.lng(),
		//				bounds:	item.geometry.bounds,
		//				viewport: item.geometry.viewport,
		//				category: item.types[0]
		//			}
		//		}));
		//	}
		//});