#!/usr/bin/env bash

docker build -t cr.yandex/crprasudad2h8egspgoc/yagami-consumer:latest -f Dockerfile.consumer --platform linux/amd64 .
docker build -t cr.yandex/crprasudad2h8egspgoc/yagami-listener:latest -f Dockerfile.listener --platform linux/amd64 .
docker build -t cr.yandex/crprasudad2h8egspgoc/yagami-producer:latest -f Dockerfile.producer --platform linux/amd64 .

docker push cr.yandex/crprasudad2h8egspgoc/yagami-consumer:latest
docker push cr.yandex/crprasudad2h8egspgoc/yagami-listener:latest
docker push cr.yandex/crprasudad2h8egspgoc/yagami-producer:latest
