#!/bin/sh
echo "Waiting for Kafka to be ready..."
sleep 20

for topic in HistoryChatTopic; do
  echo "Creating topic: $topic"
  /usr/bin/kafka-topics --create --if-not-exists \
    --bootstrap-server kafkaMessage:9092 \
    --replication-factor 1 \
    --partitions 3 \
    --topic "$topic"
done

tail -f /dev/null
