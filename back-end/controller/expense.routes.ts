/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Expense:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         totalCost:
 *           type: number
 *           format: int32
 *           description: Total cost of the expense.
 *         month:
 *           type: string
 *           description: Expense's month in the format "MM-YYYY".
 */

import express, { NextFunction, Request, Response } from 'express';
import expenseService from '../service/expense.service';

const expenseRouter = express.Router();

/**
 * @swagger
 * /expenses:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of all expenses.
 *     description: Retrieve a list of all expenses.
 *     responses:
 *       200:
 *         description: A JSON array of expense objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized access.
 */
expenseRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expenses = await expenseService.getAllExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        next(error);
    }
});

export default expenseRouter;
