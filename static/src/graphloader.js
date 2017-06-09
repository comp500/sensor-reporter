window.chartColors = { // replace with colours in code?
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(231,233,237)'
};

$(function () {
	var currentSeconds = parseInt(document.getElementsByClassName("measurementTime")[0].innerText);
	window.setInterval(function () {
		currentSeconds++;
		var timeElements = document.getElementsByClassName("measurementTime");
		for (var i = 0; i < timeElements.length; i++) {
			timeElements[i].innerText = currentSeconds;
		}
	}, 1000);
	$.getJSON("data.json", function (ajaxdata) {
		new Chart(document.getElementById("ambient").getContext("2d"), {
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
						ticks: {
							min: 0,
							max: 35
						},
						scaleLabel: {
							display: true,
							labelString: 'Temperature'
						}
 					}]
				}
			}
		});
		new Chart(document.getElementById("humidity").getContext("2d"), {
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
						ticks: {
							min: 10,
							max: 95,
						},
						scaleLabel: {
							display: true,
							labelString: 'Humidity (%)'
						}
 					}]
				}
			}
		});
		new Chart(document.getElementById("pressure").getContext("2d"), {
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
						ticks: {
							min: 990,
							max: 1040
						},
						scaleLabel: {
							display: true,
							labelString: 'Humidity (%)'
						}
 					}]
				}
			}
		});
	});
});
