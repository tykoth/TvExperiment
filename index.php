
<html>
	<head>
		<title>Layout de Teste</title>
		<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
		<link media="screen"  type="text/css" href="css/smoothness/jquery-ui-1.8.20.custom.css" rel="stylesheet" />
		<link media="screen"  type="text/css" href="css/ui.jqgrid.css" rel="stylesheet"  />
		<script src="js/jquery-1.7.2.min.js"></script>
		<script src="js/jquery-ui-1.8.20.custom.min.js"></script>
		<script src="js/jquery-ui-i18n.js"></script>
		
	</head>
	<script>
		$.fn.mover = $.fn.css;
		$(document).ready(function(){
			$(window).bind('keydown click', function(e){
				// CIMA
				
				var steps = 50
				
				if(e.keyCode == 38){
					$(".letrat").mover({
						top:'-='+steps+'px'
					});
				}		

				// BAIXO
				if(e.keyCode == 40 || (e.pageY > $(".letrat").position().top + steps)){
					$(".letrat").mover({
						top:'+='+steps+'px'
					});
				}
						
				
				// ESQUERDA
				if(e.keyCode == 37 || (e.pageX - steps < $(".letrat").position().left && e.pageY < $(".letrat").position().top + steps && e.pageY > $(".letrat").position().top - steps)){
					$(".letrat").mover({
						left:'-='+steps+'px'
					});
				}		
				
				
				// direita
				if(e.keyCode == 39 || (e.pageX - steps  > $(".letrat").position().left && e.pageY < $(".letrat").position().top + steps && e.pageY > $(".letrat").position().top - steps)){
					$(".letrat").mover({
						left:'+='+steps+'px'
					});
				}
				//console.log(e);
				html="<ul>";
				for(x in e){
					if(typeof(e[x]) != 'object' && typeof(e[x]) != 'undefined' && typeof(e[x]) != 'function' ){
					console.log(typeof(e[x]));
					html+="<li>" + x+" : "+e[x] + "</li>";
					}
				}
				html+="</ul>";
				$("#conteudo").html(html);
			});
		});
	</script>
	<style>
		.letrat {
			position:absolute;
			border:1px solid black;
			font-size:24px;
			font-weight:bold;
			width:50px;
			height:50px;
			line-height:50px;
			text-align:center;		
			top:0px;
			left:0px;
			background:#FFFFFF;
		}
	</style>
	<body>
			Mexendo a letra "T"
		<div class='letrat'>T</div>
		<div id="conteudo">
		</div>
	</body>
</html>