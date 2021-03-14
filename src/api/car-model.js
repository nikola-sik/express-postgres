const {Router} = require('express');
const CarModel = require('../persistence/car-models');

const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {model, color, production_year} = request.body;
    if (!model || !color || !production_year) {
      return response
        .status(400)
        .json({message: 'model, color and production year must be provided'});
    }

    const carModel = await CarModel.create(model, color, production_year);

    return response.status(200).json(carModel);
  } catch (error) {
    console.error(
      `createCarModel({ car model: ${request.body.model} }) >> Error: ${error.stack}`
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

    const carModel = await CarModel.find(id);
    if (!carModel) {
      return response.status(400).json({message: 'car model does not exists'});
    }

    return response.status(200).json(carModel);
  } catch (error) {
    console.error(
      `findCarModel({ car model id: ${request.body.id} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.put('/', async (request, response) => {
    try {
      const {id, model, color, production_year} = request.body;
      if (!id || !model || !color || !production_year) {
        return response
          .status(400)
          .json({message: 'id, model, color and production year must be provided'});
      }
  
      const carModel = await CarModel.update(id, model, color, production_year);
  
      return response.status(200).json(carModel);
    } catch (error) {
      console.error(
        `updateCarModel({ car model id: ${request.body.id} }) >> Error: ${error.stack}`
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
      
        await CarModel.delete(id);

      response.status(200).json();
    } catch (error) {
      console.error(`DELETE car model with id: ${request.body.id} >> ${error.stack}`);
      response.status(500).json();
    }
  });


module.exports = router;
