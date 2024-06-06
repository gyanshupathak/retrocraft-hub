#!/bin/bash
set -x
chmod -R 755 node_modules/.bin
chmod -R 755 node_modules/react-scripts
npx react-scripts build
