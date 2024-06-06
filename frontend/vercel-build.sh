#!/bin/bash
npm install --legacy-peer-deps --force
chmod -R 755 node_modules/.bin
chmod -R 755 node_modules/react-scripts
npm run build
