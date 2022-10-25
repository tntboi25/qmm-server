const Client = require('./Client');
const logger = require('./logger');

const emptyStats = () => ({
  connectionsByUserAgent: {},
  connectionsByRoomId: {},
  connectionsByOrigin: {},

  bytesReceivedByUserAgent: {},
  bytesReceivedByRoomId: {},
  bytesReceivedByOrigin: {},

  bytesSentByUserAgent: {},
  bytesSentByRoomId: {},
  bytesSentByOrigin: {}
});

let stats = emptyStats();

const printStats = () => {
  for (const [statName, data] of Object.entries(stats)) {
    let sum = 0;
    for (const dataValue of Object.values(data)) {
      sum += dataValue;
    }

    const sorted = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100);
    logger.info(`stats: ${statName}`)
    logger.info(`stats:  ${sum}\t(total)`)
    for (const [dataName, dataValue] of sorted) {
      logger.info(`stats:  ${dataValue}\t${dataName}`);
    }
  }

  stats = emptyStats();
};

/**
 * @template {Record<string, number>} T
 * @param {T} object
 * @param {string} property
 */
const incrementProperty = (object, property, number) => {
  // @ts-ignore
  object[property] = (object[property] || 0) + number;
};

/** @param {Client} client */
const recordConnection = (client) => {
  incrementProperty(stats.connectionsByUserAgent, client.userAgent, 1);
  incrementProperty(stats.connectionsByRoomId, client.getRoomId(), 1);
  incrementProperty(stats.connectionsByOrigin, client.origin, 1);
};

/** @param {Client} client */
const recordBytesReceived = (client, bytes) => {
  incrementProperty(stats.bytesReceivedByUserAgent, client.userAgent, bytes);
  incrementProperty(stats.bytesReceivedByRoomId, client.getRoomId(), bytes);
  incrementProperty(stats.bytesReceivedByOrigin, client.origin, bytes);
};

/** @param {Client} client */
const recordBytesSent = (client, bytes) => {
  incrementProperty(stats.bytesSentByUserAgent, client.userAgent, bytes);
  incrementProperty(stats.bytesSentByRoomId, client.getRoomId(), bytes);
  incrementProperty(stats.bytesSentByOrigin, client.origin, bytes);
};

module.exports = {
  printStats,
  recordConnection,
  recordBytesReceived,
  recordBytesSent
};
