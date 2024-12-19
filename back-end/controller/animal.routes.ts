/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Animal:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         name:
 *           type: string
 *           description: Animal's name.
 *         age:
 *           type: number
 *           format: int32
 *           description: Animal's age.
 *         speciesId:
 *           type: number
 *           description: ID of the species.
 *         favouriteFood:
 *           type: string
 *           description: Animal's favourite food.
 *         favouriteToy:
 *           type: string
 *           description: Animal's favourite toy.
 *         firstExpense:
 *           type: number
 *           format: int64
 *           description: ID of the first expense.
 *         caretakerId:
 *           type: number
 *           format: int64
 *           description: ID of the caretaker.
 *     AnimalInput:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - speciesId
 *         - favouriteFood
 *         - favouriteToy
 *         - firstExpense
 *         - caretakerId
 *       properties:
 *         name:
 *           type: string
 *           description: Animal's name.
 *         age:
 *           type: number
 *           format: int32
 *           description: Animal's age.
 *         speciesId:
 *           type: number
 *           description: ID of the species.
 *         favouriteFood:
 *           type: string
 *           description: Animal's favourite food.
 *         favouriteToy:
 *           type: string
 *           description: Animal's favourite toy.
 *         firstExpense:
 *           type: number
 *           format: int64
 *           description: ID of the first expense.
 *         caretakerId:
 *           type: number
 *           format: int64
 *           description: ID of the caretaker.
 */

import express, { NextFunction, Request, Response } from 'express';
import animalService from '../service/animal.service';
import { AnimalInput, Role } from '../types';

const animalRouter = express.Router();

/**
 * @swagger
 * /animals:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all animals.
 *     responses:
 *       200:
 *         description: A JSON array containing animal objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Animal'
 */
animalRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role }};
        const { username, role } = request.auth;
        const animals = await animalService.getAllAnimals({ username, role });
        res.status(200).json(animals);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /animals/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete an animal by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the animal to delete.
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Animal deleted successfully.
 *       404:
 *         description: Animal not found.
 */
animalRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        await animalService.deleteAnimal({ id });
        res.status(200).send({ message: 'Animal deleted successfully' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /animals/{id}/{caretakerId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update the caretaker of an animal by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the animal to update.
 *         schema:
 *           type: number
 *       - name: caretakerId
 *         in: path
 *         required: true
 *         description: ID of the new caretaker.
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Caretaker updated successfully.
 *       404:
 *         description: Animal or caretaker not found.
 */
animalRouter.put('/:id/:caretakerId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const animalId = Number(req.params.id);
        const caretakerId = Number(req.params.caretakerId);
        const updatedAnimal = await animalService.putNewCaretaker({ animalId, caretakerId });
        res.status(200).send({ message: 'Animal updated successfully' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /animals:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new animal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnimalInput'
 *     responses:
 *       201:
 *         description: Animal created successfully.
 *       400:
 *         description: Invalid input.
 */
animalRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newAnimal = <AnimalInput>req.body;
        const createdAnimal = await animalService.createAnimal(newAnimal);
        res.status(201).json(createdAnimal);
    } catch (error) {
        next(error);
    }
});

export default animalRouter;
