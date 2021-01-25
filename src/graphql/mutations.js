/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createContainer = /* GraphQL */ `
  mutation CreateContainer(
    $input: CreateContainerInput!
    $condition: ModelContainerConditionInput
  ) {
    createContainer(input: $input, condition: $condition) {
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
export const updateContainer = /* GraphQL */ `
  mutation UpdateContainer(
    $input: UpdateContainerInput!
    $condition: ModelContainerConditionInput
  ) {
    updateContainer(input: $input, condition: $condition) {
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
export const deleteContainer = /* GraphQL */ `
  mutation DeleteContainer(
    $input: DeleteContainerInput!
    $condition: ModelContainerConditionInput
  ) {
    deleteContainer(input: $input, condition: $condition) {
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
export const createSensorReading = /* GraphQL */ `
  mutation CreateSensorReading(
    $input: CreateSensorReadingInput!
    $condition: ModelSensorReadingConditionInput
  ) {
    createSensorReading(input: $input, condition: $condition) {
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
export const updateSensorReading = /* GraphQL */ `
  mutation UpdateSensorReading(
    $input: UpdateSensorReadingInput!
    $condition: ModelSensorReadingConditionInput
  ) {
    updateSensorReading(input: $input, condition: $condition) {
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
export const deleteSensorReading = /* GraphQL */ `
  mutation DeleteSensorReading(
    $input: DeleteSensorReadingInput!
    $condition: ModelSensorReadingConditionInput
  ) {
    deleteSensorReading(input: $input, condition: $condition) {
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
export const createSensor = /* GraphQL */ `
  mutation CreateSensor(
    $input: CreateSensorInput!
    $condition: ModelSensorConditionInput
  ) {
    createSensor(input: $input, condition: $condition) {
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
export const updateSensor = /* GraphQL */ `
  mutation UpdateSensor(
    $input: UpdateSensorInput!
    $condition: ModelSensorConditionInput
  ) {
    updateSensor(input: $input, condition: $condition) {
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
export const deleteSensor = /* GraphQL */ `
  mutation DeleteSensor(
    $input: DeleteSensorInput!
    $condition: ModelSensorConditionInput
  ) {
    deleteSensor(input: $input, condition: $condition) {
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
export const createGpsReading = /* GraphQL */ `
  mutation CreateGpsReading(
    $input: CreateGPSReadingInput!
    $condition: ModelGPSReadingConditionInput
  ) {
    createGPSReading(input: $input, condition: $condition) {
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
export const updateGpsReading = /* GraphQL */ `
  mutation UpdateGpsReading(
    $input: UpdateGPSReadingInput!
    $condition: ModelGPSReadingConditionInput
  ) {
    updateGPSReading(input: $input, condition: $condition) {
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
export const deleteGpsReading = /* GraphQL */ `
  mutation DeleteGpsReading(
    $input: DeleteGPSReadingInput!
    $condition: ModelGPSReadingConditionInput
  ) {
    deleteGPSReading(input: $input, condition: $condition) {
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
