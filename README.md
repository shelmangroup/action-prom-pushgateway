# Action Prom Pushgateway

Small action to send metrics to prometheus pushgateway. Note. The reporting step allways need to he last
to make it work, since it relies on teh previus step status. This works per workflow file since it's 
dependent on the sequentially run of steps.


## Inputs

### `pushgateway` 

**Required** The http address to the prometheus pushgateway. You can pass basic auth like https://username:password@example.com:9091 or http://example.com:9091

### `previousstate`

**Required** The status of the current job. Needed to report the result of the run



## Example usage

```yaml
name: "run good case"
on:
  pull_request:
  push:
    branches:
      - master
      - 'releases/*'

jobs:
  trigger-good:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1

    - name: trigger
      run: exit 0

    - uses: shelmangroup/action-prom-pushgateway@v1
      with:
        pushgateway: "http://example.com:9091"
        previousstate: ${{ job.status }}
      if: always()
```
