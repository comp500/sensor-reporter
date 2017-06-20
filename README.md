# sensor-reporter
This is a weather station based on node.js that creates a webpage and graphs from the sensor data. Currently, data is recorded once per minute to display in the live data section, and an average is taken every 5 minutes for display on graphs (powered by chart.js) Raw data can be output as CSV (for excel), HTML (for viewing) and JSON (for advanced applications)

### PHP version
Some parts of the code (the web app) are avialable ported to PHP, in our case for use on Google cloud. Instructions and code can be found at https://github.com/comp500/sensor-website

### Requirements:
- Raspberry Pi
- node.js
- npm

Node package requirements are listed in package.json.

### Supports:
- TSL2591 Lux sensors
- BME280 Temperature/Humidity/Pressure sensors

### Future intentions
 - Improved database
