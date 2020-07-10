# Action Prom Pushgateway

Small action to send metrics to prometheus pushgateway. Note. The reporting step allways need to he last
to make it work, since it relies on teh previus step status. This works per workflow file since it's 
dependent on the sequentially run of steps.


## Inputs

### `pushgateway` 

**Required** The http address to the prometheus pushgateway. You can pass basic auth like https://username:password@example.com:9091 or http://example.com:9091

### `previousstate`

**Required** The status of the current job. Needed to report the result of the run


## Metrics
metrics sent currently
* `github_actions_run` (labels=[job,repo,run_id,status]) status=(sucess or failure) sucessful run equals 1 failed run equals 0 gauge 

example output from pushgateway
```bash
# HELP github_actions_run github_actions_run
# TYPE github_actions_run gauge
github_actions_run{instance="",job="github_actions",repo="github.com/shelmangroup/action-prom-pushgateway",run_id="164250517",status="success"} 1
push_failure_time_seconds{instance="",job="github_actions"} 0
push_time_seconds{instance="",job="github_actions"} 1.5943653317836294e+09
```



## Example usage

```yaml
name: "run good case"
on:
  pull_request:
  push:
    branches:
      - master

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
