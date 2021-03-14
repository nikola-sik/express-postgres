const {Router} = require('express');
const Car = require('../persistence/cars');
const CarModel = require('../persistence/car-models');
const Garage = require('../persistence/garages');
const sessionMiddleware = require('../middleware/session-middleware');
const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {registration_number, user_id, car_model_id} = request.body;
    if (!registration_number || !user_id || !car_model_id) {
      return response
        .status(400)
        .json({message: 'registration number, user id and car model id must be provided'});
    }

    const car = await Car.create(registration_number, user_id, car_model_id);
    if (!car) {
      return response.status(400).json({message: 'Registration number already exists'});
    }

    return response.status(200).json(car);
  } catch (error) {
    console.error(
      `createCar({ registration number: ${request.body.registration_number} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.get('/', async (request, response) => {
  try {
    const {registration_number} = request.body;
    
    if (!registration_number) {
      return response
        .status(400)
        .json({message: 'registration number must be provided'});
    }

    const car = await Car.find(registration_number);
    if (!car) {
      return response.status(400).json({message: 'registration number does not exists'});
    }

    return response.status(200).json(car);
  } catch (error) {
    console.error(
      `findCar({ registration number: ${request.body.registration_number} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.get('/find-my-car', async (request, response) => {
  try {
    const {registration_number} = request.body;
    
    if (!registration_number) {
      return response
        .status(400)
        .json({message: 'registration number must be provided'});
    }

    const car = await Car.find(registration_number);
    if (!car) {
      return response.status(400).json({message: 'registration number does not exists'});
    }
    const carModel = await CarModel.find(car.car_model_id);
    if (!carModel) {
      return response.status(400).json({message: 'car model does not exists'});
    }
    const garage = await Garage.findCarInGarageById(car.id);
    if (!garage) {
      return response.status(400).json({message: `in garage does not exists car ${registration_number}`});
    }

    const carData = new Object();
    carData.registrationNumber = car.registration_number;
    carData.model = carModel.model;
    carData.color = carModel.color;
    carData.productionYear = carModel.production_year;
    carData.address = garage.address;
    carData.userId = car.user_id;

    return response.status(200).json(carData);
  } catch (error) {
    console.error(
      `findCar({ registration number: ${request.body.registration_number} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});


router.put('/', async (request, response) => {
    try {
      const {id, registration_number, user_id, car_model_id} = request.body;
      if (!id || !registration_number || !user_id || !car_model_id) {
        return response
          .status(400)
          .json({message: 'id, registration number, user id and car model id must be provided'});
      }
  
      const car = await Car.update(id, registration_number, user_id, car_model_id);
      if (!car) {
        return response.status(400).json({message: 'Registration number already exists'});
      }
  
      return response.status(200).json(car);
    } catch (error) {
      console.error(
        `updateCar({ registration number: ${request.body.registration_number} }) >> Error: ${error.stack}`
      );
      response.status(500).json();
    }
  });

router.delete('/', sessionMiddleware, async (request, response) => {
    try {
        const {registration_number} = request.body;
        if (!registration_number) {
            return response
              .status(400)
              .json({message: 'registration number must be provided'});
          }
      
        await Car.delete(registration_number);

      response.status(200).json();
    } catch (error) {
      console.error(`DELETE car with registration number: ${request.body.registration_number} >> ${error.stack}`);
      response.status(500).json();
    }
  });


module.exports = router;
