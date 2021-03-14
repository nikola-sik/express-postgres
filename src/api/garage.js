const {Router} = require('express');
const Garage = require('../persistence/garages');

const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {address, car_id} = request.body;
    if (!address) {
      return response
        .status(400)
        .json({message: 'address must be provided'});
    }

    const garage = await Garage.create(address, car_id);

    return response.status(200).json(garage);
  } catch (error) {
    console.error(
      `createGarage({ garage address: ${request.body.address} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.get('/', async (request, response) => {
  try {
    const {id} = request.body;
    
    if (!id) {
      return response
        .status(400)
        .json({message: 'id must be provided'});
    }

    const garage = await Garage.find(id);
    if (!garage) {
      return response.status(400).json({message: 'garage does not exists'});
    }

    return response.status(200).json(garage);
  } catch (error) {
    console.error(
      `findGarage({ garage id: ${request.body.id} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.put('/', async (request, response) => {
    try {
      const {id, address, car_id} = request.body;
      if (!id || !address) {
        return response
          .status(400)
          .json({message: 'id and address must be provided'});
      }
  
      const garage = await Garage.update(id, address, car_id);
      if (!garage) {
        return response.status(400).json({message: 'garage does not exists'});
      }

      return response.status(200).json(garage);
    } catch (error) {
      console.error(
        `updateGarage({ garage id: ${request.body.id} }) >> Error: ${error.stack}`
      );
      response.status(500).json();
    }
  });

router.delete('/', async (request, response) => {
    try {
        const {id} = request.body;
        if (!id) {
            return response
              .status(400)
              .json({message: 'id must be provided'});
          }
      
        await Garage.delete(id);

      response.status(200).json();
    } catch (error) {
      console.error(`DELETE garage place with id: ${request.body.id} >> ${error.stack}`);
      response.status(500).json();
    }
  });


module.exports = router;
