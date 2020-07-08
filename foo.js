const client = require('prom-client');


function hello() {
    const Registry = client.Registry;
    const register = new Registry();

    let gateway = new client.Pushgateway('http://127.0.0.1:9091',  [], register);

    const test = new client.Counter({
        name: 'prefix_test',
        help: 'prefix_test',
        registers: [register]
    });
    register.registerMetric(test);
    test.inc(10);

    gateway.push({ jobName: 'github-action-checks' }, function (err, resp, body) {
        console.log(`Error: ${err}`)
        console.log(`Body: ${body}`)
        console.log(`Response status: ${resp.statusCode}`)
    });
}

hello()