import express from 'express';
import HabitController from '../controllers/HabitController.js';
import { auth } from '../middlewares/auth.js';


const habitRouter = express.Router();
const controller = new HabitController();

habitRouter.post('/create' ,auth, controller.create);
habitRouter.get('/findOne', controller.findOne);
habitRouter.get('/find',controller.find);
habitRouter.get('/findById',controller.findById);
habitRouter.put('/findByIdAndUpdate',controller.findByIdAndUpdate);
habitRouter.delete('/findByIdAndDelete',controller.findByIdAndDelete);




export default habitRouter;