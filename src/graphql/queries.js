/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getContainer = /* GraphQL */ `
  query GetContainer($id: ID!) {
    getContainer(id: $id) {
      id
      name
      currentTemperature
      currentHumidity
      createdAt
      updatedAt
      sensorReadings {
        items {
          id
          sensorID
          containerName
          temperature
          humidity
          createdAt
          updatedAt
          containerSensorReadingsId
          sensorReadingContainerId
        }
        nextToken
      }
      currentLat
      currentLng
      gpsReading {
        items {
          id
          lat
          lng
          containerGpsReadingId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const listContainers = /* GraphQL */ `
  query ListContainers(
    $filter: ModelContainerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContainers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        currentTemperature
        currentHumidity
        createdAt
        updatedAt
        sensorReadings {
          nextToken
        }
        currentLat
        currentLng
        gpsReading {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getSensorReading = /* GraphQL */ `
  query GetSensorReading($id: ID!) {
    getSensorReading(id: $id) {
      id
      container {
        id
        name
        currentTemperature
        currentHumidity
        createdAt
        updatedAt
        sensorReadings {
          nextToken
        }
        currentLat
        currentLng
        gpsReading {
          nextToken
        }
      }
      sensorID
      containerName
      temperature
      humidity
      createdAt
      updatedAt
      containerSensorReadingsId
      sensor {
        id
        container {
          id
          name
          currentTemperature
          currentHumidity
          createdAt
          updatedAt
          currentLat
          currentLng
        }
        sensorReadings {
          nextToken
        }
        createdAt
        updatedAt
        sensorContainerId
      }
      sensorReadingContainerId
    }
  }
`;
export const listSensorReadings = /* GraphQL */ `
  query ListSensorReadings(
    $filter: ModelSensorReadingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSensorReadings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        container {
          id
          name
          currentTemperature
          currentHumidity
          createdAt
          updatedAt
          currentLat
          currentLng
        }
        sensorID
        containerName
        temperature
        humidity
        createdAt
        updatedAt
        containerSensorReadingsId
        sensor {
          id
          createdAt
          updatedAt
          sensorContainerId
        }
        sensorReadingContainerId
      }
      nextToken
    }
  }
`;
export const getSensor = /* GraphQL */ `
  query GetSensor($id: ID!) {
    getSensor(id: $id) {
      id
      container {
        id
        name
        currentTemperature
        currentHumidity
        createdAt
        updatedAt
        sensorReadings {
          nextToken
        }
        currentLat
        currentLng
        gpsReading {
          nextToken
        }
      }
      sensorReadings {
        items {
          id
          sensorID
          containerName
          temperature
          humidity
          createdAt
          updatedAt
          containerSensorReadingsId
          sensorReadingContainerId
        }
        nextToken
      }
      createdAt
      updatedAt
      sensorContainerId
    }
  }
`;
export const listSensors = /* GraphQL */ `
  query ListSensors(
    $filter: ModelSensorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSensors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        container {
          id
          name
          currentTemperature
          currentHumidity
          createdAt
          updatedAt
          currentLat
          currentLng
        }
        sensorReadings {
          nextToken
        }
        createdAt
        updatedAt
        sensorContainerId
      }
      nextToken
    }
  }
`;
export const getGpsReading = /* GraphQL */ `
  query GetGpsReading($id: ID!) {
    getGPSReading(id: $id) {
      id
      container {
        id
        name
        currentTemperature
        currentHumidity
        createdAt
        updatedAt
        sensorReadings {
          nextToken
        }
        currentLat
        currentLng
        gpsReading {
          nextToken
        }
      }
      lat
      lng
      containerGpsReadingId
      createdAt
      updatedAt
    }
  }
`;
export const listGpsReadings = /* GraphQL */ `
  query ListGpsReadings(
    $filter: ModelGPSReadingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGPSReadings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        container {
          id
          name
          currentTemperature
          currentHumidity
          createdAt
          updatedAt
          currentLat
          currentLng
        }
        lat
        lng
        containerGpsReadingId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
