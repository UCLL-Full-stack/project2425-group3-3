/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Species:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Unique identifier for the species.
 *         name:
 *           type: string
 *           description: Name of the species.
 */

import express, { NextFunction, Request, Response } from 'express';
import speciesService from '../service/species.service';

const speciesRouter = express.Router();

/**
 * @swagger
 * /species:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of all species.
 *     description: Fetch all species stored in the system.
 *     responses:
 *       200:
 *         description: A JSON array of species objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Species'
 *       401:
 *         description: Unauthorized access.
 */
speciesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const species = await speciesService.getAllSpecies();
        res.status(200).json(species);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /species/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve animals by species ID.
 *     description: Get a list of animals belonging to a specific species using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the species.
 *         schema:
 *           type: number
 *           format: int64
 *     responses:
 *       200:
 *         description: A list of animals belonging to the species.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Species not found.
 */
speciesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const listOfAnimals = await speciesService.getAnimalsFromSpecies({ id });
        res.status(200).json(listOfAnimals);
    } catch (error) {
        next(error);
    }
});

export default speciesRouter;
