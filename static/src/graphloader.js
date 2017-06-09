window.chartColors = { // replace with colours in code?
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(231,233,237)'
};

window.addEventListener("load", function(event) {
	var currentSeconds = parseInt(document.getElementsByClassName("measurementTime")[0].innerText);
	window.setInterval(function () {
		currentSeconds++;
		var timeElements = document.getElementsByClassName("measurementTime");
		for (var i = 0; i < timeElements.length; i++) {
			timeElements[i].innerText = currentSeconds;
		}
	}, 1000);
	
	var createGraphs = function (ajaxdata) {
		for (var i = 0; i < ajaxdata.metadata.length; i++) {
			var meta = ajaxdata.metadata[i];
			new Chart(document.getElementById("graph-" + meta.sensorID).getContext("2d"), {
				type: 'line',
				data: {
					labels: ["-95", "-90", "-85", "-80", "-75", "-70", "-65", "-60", "-55", "-50", "-45", "-40", "-35", "-30", "-25", "-20", "-15", "-10", "-5", "0"],
					datasets: [{
						label: meta.measurement + "(" + meta.unit + ")",
						backgroundColor: window.chartColors.red,
						borderColor: window.chartColors.red,
						data: ajaxdata.values[meta.sensorID],
						fill: false
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
								min: meta.min,
								max: meta.max
							},
							scaleLabel: {
								display: true,
								labelString: meta.measurement
							}
						}]
					}
				}
			});
		}
	};
	
	var oReq = new XMLHttpRequest();

	oReq.onreadystatechange = function () {
		if (oReq.readyState === XMLHttpRequest.DONE) {
			if (oReq.status === 200) {
				console.log(JSON.parse(this.responseText));
				createGraphs(JSON.parse(this.responseText));
			} else {
				console.log(oReq.status);
			}
		}
	};

	oReq.open("GET", "/data.json");
	oReq.send();
}, false);