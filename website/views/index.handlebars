{extends file="skeleton.tpl"}
{block name=body}
	{if $ready}
	<div class="alert alert-info" role="alert">
		<strong>Heads up!</strong> This software could break at any time.
	</div>
	<div class="container">
		<h3>Latest data</h3>
		<div class="row">
			{foreach $sensors as $sensor}
			<div class="col-md-3">
				<div class="card sensor-card">
					<div class="card-block text-center">
						<h1 class="display-3">{$sensor.value}{if isset($sensor.small) && $sensor.small}<strong class="small-unit">{$sensor.unit}</strong>{else}{$sensor.unit}{/if}</h1>
						<p class="lead">{$sensor.measurement}</p>
						<hr>
						<p class="lead">{$sensor.location}</p>
					</div>
				</div>
			</div>
			{/foreach}
		</div>
		<p class="lead">
			Data recorded <span class="measurementTime">{$measurementTime}</span> seconds ago
		</p>
		<h3>Graphs</h3>
		<div class="row">
			{foreach $sensors as $sensor}
			<div class="col-md-6">
				<div class="card">
					<div class="card-block">
						<h4 class="card-title">{$sensor.measurement}</h4>
						<h6 class="card-subtitle text-muted">Sensor {$sensor.sensorID} in {$sensor.location}</h6>
					</div>
					<div class="graph-container">
						<canvas id="graph-{$sensor.sensorID}"></canvas>
					</div>
				</div>
			</div>
			{/foreach}
		</div>
	</div>
	{else}
	<div class="alert alert-warning" role="alert">
		<strong>Warning!</strong> There is no data available yet.
	</div>
	<div class="container">
		<a href="/"><h2>Click to refresh</h2></a>
	</div>
	{/if}
{/block}
{block name=js}
	<script defer src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.min.js" integrity="sha256-VNbX9NjQNRW+Bk02G/RO6WiTKuhncWI4Ey7LkSbE+5s=" crossorigin="anonymous"></script>
	<script defer src="static/graphloader.js"></script>
{/block}
{assign "page" "index"}