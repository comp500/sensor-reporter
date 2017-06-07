$(function() { 
	$.getJSON( "data.json", function( ajaxdata ) {
    	var items = [];
 		var config = {
 			type: 'line',
 			data: {
 				labels: ["-95", "-90", "-85", "-80", "-75", "-70", "-65", "-60", "-55", "-50", "-45", "-40", "-35", "-30", "-25", "-20", "-15", "-10", "-5", "0"],
 				datasets: [{
 					label: "Temperature (" + String.fromCharCode(176) + "C)",
 					backgroundColor: window.chartColors.red,
 					borderColor: window.chartColors.red,
 					data: ajaxdata.ambientTemperature,
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
$(function() { 
	$.getJSON( "data.json", function( ajaxdata ) {
    	var items = [];
 		var config = {
 			type: 'line',
 			data: {
 				labels: ["-95", "-90", "-85", "-80", "-75", "-70", "--65", "-60", "-55", "-50", "-45", "-40", "-35", "-30", "-25", "-20", "-15", "-10", "-5", "0"],
 				datasets: [{
 					label: "Humidity (%)",
 					backgroundColor: window.chartColors.red,
 					borderColor: window.chartColors.red,
 					data: ajaxdata.humidity,
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
						min: 10,
						max: 95,
 						scaleLabel: {
 						display: true,
 							labelString: 'Humidity (%)'
 						}
 					}]
 				}
 		}
 		};

			var ctx2 = document.getElementById("humidity").getContext("2d");
 			window.myLine = new Chart(ctx2, config);
		});
  });
$(function() { 
	$.getJSON( "data.json", function( ajaxdata ) {
    	var items = [];
 		var config = {
 			type: 'line',
 			data: {
 				labels: ["-95", "-90", "-85", "-80", "-75", "-70", "--65", "-60", "-55", "-50", "-45", "-40", "-35", "-30", "-25", "-20", "-15", "-10", "-5", "0"],
 				datasets: [{
 					label: "Pressure (hPa)",
 					backgroundColor: window.chartColors.red,
 					borderColor: window.chartColors.red,
 					data: ajaxdata.pressure,
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
 							labelString: 'Humidity (%)'
 						}
 					}]
 				}
 		}
 		};

			var ctx2 = document.getElementById("pressure").getContext("2d");
 			window.myLine = new Chart(ctx2, config);
		});
  });
