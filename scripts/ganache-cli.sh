#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit
touch ./allFiredEvents

if [ "$SOLIDITY_COVERAGE" = true ]; then
  testrpc_port=8555
else
  testrpc_port=8545
fi

testrpc_running() {
  nc -z localhost "$testrpc_port"
}

start_testrpc() {
  if [ "$SOLIDITY_COVERAGE" = true ]; then
    ./node_modules/.bin/testrpc-sc -i 16 --gasLimit 0xfffffffffff --port "$testrpc_port"  > /dev/null &
  else
    npx ganache-cli -a 30 -i 15 --gasLimit 0xfffffffffff --port "$testrpc_port" > /dev/null &
  fi

  testrpc_pid=$!
}

if testrpc_running; then
  echo "Killing testrpc instance at port $testrpc_port"
#  kill -9 $(lsof -i:$testrpc_port -t)
fi

echo "Starting our own testrpc instance at port $testrpc_port"
start_testrpc
sleep 5

# Exit error mode so the testrpc instance always gets killed
set +e
result=0
if [ "$SOLIDITY_COVERAGE" = true ]; then
  npx solidity-coverage "$@"
  result=$?
elif [ "$TRUFFLE_TEST" = true ]; then
  npx truffle test --network rpc "$@"
  result=$?
fi

kill -9 $testrpc_pid

exit $result