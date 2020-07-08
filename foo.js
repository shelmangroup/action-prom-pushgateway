'use strict';

const client = require('prom-client');

function foo() {
    const Registry = client.Registry;
    const register = new Registry();
    const gateway = new client.Pushgateway('http://127.0.0.1:9091', [], register);
    const prefix = 'github_actions';

    const dummy = new client.Counter({
        name: `${prefix}_test`,
        help: `${prefix}_test`,
        registers: [register],
    });
    register.registerMetric(dummy);
    dummy.inc(10);

    gateway.push({ jobName: prefix }, (err, resp, body) => {
        console.log(`Error: ${err}`);
        console.log(`Body: ${body}`);
        console.log(`Response status: ${resp.statusCode}`);
    });
}

foo();
