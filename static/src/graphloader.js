$(function() { 
	$.getJSON( "data.json", function( ajaxdata ) {
    	var items = [];
		var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 		var config = {
 			type: 'line',
 			data: {
 				labels: ["1800", "2000", "2200", "2400", "0200", "0400", "0600", "0800", "1000"],
 				datasets: [{
 					label: "Temperature",
 					backgroundColor: window.chartColors.red,
 					borderColor: window.chartColors.red,
 					data: ajaxdata,
 					fill: false,
 				}]
 			},
 			options: {
 				responsive: true,
 				tooltips: {
 					mode: 'index',
 					intersect: false,
 				},
 				hover: {
 				mode: 'nearest',
 					intersect: true
 				},
 				scales: {
 				xAxes: [{
 						display: true,
 						scaleLabel: {
 							display: true,
 							labelString: 'Time',
 							fontFamily: "serif"
 						}
 					}],
 					yAxes: [{
 						display: true,
 						scaleLabel: {
 						display: true,
 							labelString: 'Temperature'
 						}
 					}]
 				}
 		}
 		};

			var ctx2 = document.getElementById("ambient").getContext("2d");
 			window.myLine = new Chart(ctx2, config);
		});
  });

