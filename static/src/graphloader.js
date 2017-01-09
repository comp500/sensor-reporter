$(function() { 
	$.getJSON( "data.json", function( ajaxdata ) {
    	var items = [];
		//var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 		var config = {
 			type: 'line',
 			data: {
 				labels: ["-95", "-90", "-85", "-80", "-75", "-70", "-65", "-60", "-55", "-50", "-45", "-40", "-35", "-30", "-25", "-20", "-15", "-10", "-5", "0"],
 				datasets: [{
 					label: "Temperature (" + String.fromCharCode(176) + "C)",
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
 							labelString: 'Time (Mins ago)',
 							fontFamily: "sans-serif"
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
	window.setInterval(function () {
		document.getElementById("measurementTime").innerText = parseInt(document.getElementById("measurementTime").innerText) + 1;
	}, 1000);
  });
/*
$(function() { 
	$.getJSON( "datapress.json", function( ajaxdatapress ) {
    	var items = [];
 		var config = {
 			type: 'line',
 			data: {
 				labels: ["-95", "-90", "-85", "-80", "-75", "-70", "--65", "-60", "-55", "-50", "-45", "-40", "-35", "-30", "-25", "-20", "-15", "-10", "-5", "0"],
 				datasets: [{
 					label: "Pressure (hPa)",
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
 							labelString: 'Time (Mins ago)',
 							fontFamily: "sans-serif"
 						}
 					}],
 					yAxes: [{
 						display: true,
 						scaleLabel: {
 						display: true,
 							labelString: 'Pressure (hPa)'
 						}
 					}]
 				}
 		}
 		};

			var ctx2 = document.getElementById("ambient").getContext("2d");
 			window.myLine = new Chart(ctx2, config);
		});
  });
*/
