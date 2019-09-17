#!/bin/bash
plugin install file://./serbian-analyzer-1.0-SNAPSHOT.zip

exec /docker-entrypoint.sh elasticsearch
