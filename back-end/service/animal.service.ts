import { UnauthorizedError } from 'express-jwt';
import { Animal } from '../model/animal';
import { Expense } from '../model/expense';
import animalDb from '../repository/animal.db';
import expenseDb from '../repository/expense.db';
import { AnimalInput, Role } from '../types';

const getAllAnimals = async ({
    username,
    role,
}: {
    username: string;
    role: Role;
}): Promise<Animal[]> => {
    if (role === 'caretaker') {
        return animalDb.getAnimalsByCaretaker({ username });
    } else if (role === 'admin' || role === 'manager') {
        return animalDb.getAllAnimals();
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

// const getAnimalsByCaretaker = async ({ username }: { username: string }) => {
//     try {
//         const animals = await animalDb.getAnimalsByCaretaker({ username });

//         if (!animals || animals.length === 0) {
//             throw new Error('No animals for this caretaker found.');
//         }
//         return animals;
//     } catch (error) {
//         console.error('Error fetching animals from this caretaker:', error);
//         throw new Error('Failed to retrieve animals from this caretaker.');
//     }
// };

const deleteAnimal = async ({ id }: { id: number }) => {
    try {
        return await animalDb.deleteAnimal({ id });
    } catch (error) {
        console.error('Error deleting animal:', error);
        throw new Error('Failed to delete animal.');
    }
};

const putNewCaretaker = async ({
    animalId,
    caretakerId,
}: {
    animalId: number;
    caretakerId: number;
}) => {
    try {
        return await animalDb.putNewCaretaker({ animalId, caretakerId });
    } catch (error) {
        console.error('Error updating caretaker:', error);
        throw new Error('Failed to update caretaker.');
    }
};

const createAnimal = async ({
    name,
    age,
    speciesId,
    favouriteFood,
    favouriteToy,
    firstExpense,
    caretakerId,
}: AnimalInput): Promise<Animal> => {
    const expense = await expenseDb.createExpense(firstExpense);
    const createdAnimal = await animalDb.createAnimal(
        name,
        age,
        speciesId,
        favouriteFood,
        favouriteToy,
        caretakerId,
        expense
    );

    return createdAnimal;
};

export default {
    getAllAnimals,
    // getAnimalsByCaretaker,
    deleteAnimal,
    putNewCaretaker,
    createAnimal,
};
