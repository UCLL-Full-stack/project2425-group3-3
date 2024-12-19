import { Animal } from '../../model/animal';
import { Expense } from '../../model/expense';
import { Species } from '../../model/species';
import animalDb from '../../repository/animal.db';
import expenseDb from '../../repository/expense.db';
import animalService from '../../service/animal.service';
import { AnimalInput } from '../../types';
import { Caretaker } from '../../model/caretaker';
import { User } from '../../model/user';

const mockExpense = new Expense({ id: 1, totalCost: 100, month: '12-2024' });
const mockSpecies = new Species({ id: 1, species: 'Lion' });
const mockUser = new User({ username: 'janedoe', password: 'password', role: 'caretaker' });

const mockCaretaker = new Caretaker({
    id: 1,
    name: 'Jane Doe',
    user: mockUser,
});

const mockAnimal = new Animal({
    id: 1,
    name: 'Simba',
    age: 3,
    species: mockSpecies,
    favouriteFood: 'Meat',
    favouriteToy: 'Ball',
    expenses: [mockExpense],
    caretaker: mockCaretaker,
});

let mockAnimalDbGetAllAnimals: jest.Mock;
let mockAnimalDbGetAnimalsByCaretaker: jest.Mock;
let mockAnimalDbCreateAnimal: jest.Mock;
let mockAnimalDbDeleteAnimal: jest.Mock;
let mockExpenseDbCreateExpense: jest.Mock;

beforeEach(() => {
    mockAnimalDbGetAllAnimals = jest.fn();
    mockAnimalDbGetAnimalsByCaretaker = jest.fn();
    mockAnimalDbCreateAnimal = jest.fn();
    mockAnimalDbDeleteAnimal = jest.fn();
    mockExpenseDbCreateExpense = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given role admin, when getAllAnimals is called, then all animals are returned', async () => {
    // given
    animalDb.getAllAnimals = mockAnimalDbGetAllAnimals.mockResolvedValue([mockAnimal]);

    // when
    const result = await animalService.getAllAnimals({ username: 'admin', role: 'admin' });

    // then
    expect(result).toEqual([mockAnimal]);
    expect(mockAnimalDbGetAllAnimals).toHaveBeenCalledTimes(1);
});

test('given role caretaker, when getAllAnimals is called, then animals by caretaker are returned', async () => {
    // given
    animalDb.getAnimalsByCaretaker = mockAnimalDbGetAnimalsByCaretaker.mockResolvedValue([
        mockAnimal,
    ]);

    // when
    const result = await animalService.getAllAnimals({ username: 'janedoe', role: 'caretaker' });

    // then
    expect(result).toEqual([mockAnimal]);
    expect(mockAnimalDbGetAnimalsByCaretaker).toHaveBeenCalledTimes(1);
});

test('given valid animal input, when createAnimal is called, then animal is created', async () => {
    // given
    const animalInput: AnimalInput = {
        name: 'Simba',
        age: 3,
        speciesId: 1,
        favouriteFood: 'Meat',
        favouriteToy: 'Ball',
        firstExpense: 100,
        caretakerId: 1,
    };

    expenseDb.createExpense = mockExpenseDbCreateExpense.mockResolvedValue(mockExpense);
    animalDb.createAnimal = mockAnimalDbCreateAnimal.mockResolvedValue(mockAnimal);

    // when
    const result = await animalService.createAnimal(animalInput);

    // then
    expect(result).toEqual(mockAnimal);
    expect(mockExpenseDbCreateExpense).toHaveBeenCalledTimes(1);
    expect(mockAnimalDbCreateAnimal).toHaveBeenCalledTimes(1);
});

test('given valid id, when deleteAnimal is called, then animal is deleted', async () => {
    // given
    animalDb.deleteAnimal = mockAnimalDbDeleteAnimal.mockResolvedValue(undefined);

    // when
    await animalService.deleteAnimal({ id: 1 });

    // then
    expect(mockAnimalDbDeleteAnimal).toHaveBeenCalledTimes(1);
    expect(mockAnimalDbDeleteAnimal).toHaveBeenCalledWith({ id: 1 });
});

test('given valid caretaker update, when putNewCaretaker is called, then caretaker is updated', async () => {
    // given
    const putNewCaretakerMock = jest.fn().mockResolvedValue(undefined);
    animalDb.putNewCaretaker = putNewCaretakerMock;

    // when
    await animalService.putNewCaretaker({ animalId: 1, caretakerId: 2 });

    // then
    expect(putNewCaretakerMock).toHaveBeenCalledTimes(1);
    expect(putNewCaretakerMock).toHaveBeenCalledWith({ animalId: 1, caretakerId: 2 });
});
