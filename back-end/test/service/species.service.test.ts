import speciesDb from '../../repository/species.db';
import speciesService from '../../service/species.service';
import { Species } from '../../model/species';
import { Animal } from '../../model/animal';
import { User } from '../../model/user';
import { Caretaker } from '../../model/caretaker';

const mockSpecies = [
    new Species({ id: 1, species: 'Lion' }),
    new Species({ id: 2, species: 'Tiger' }),
];

const mockUser = new User({username: 'john_doe', password: 'password', role: 'caretaker'})
const mockUser2 = new User({username: 'jane_doe', password: 'password', role: 'caretaker'})
const mockCaretaker = new Caretaker({user: mockUser, name: 'John Doe'})
const mockCaretaker2 = new Caretaker({user: mockUser2, name: 'Jane Doe'})
const mockAnimals = [
    new Animal({
        id: 1,
        name: 'Lion 1',
        age: 5,
        species: mockSpecies[0],
        favouriteFood: 'Meat',
        favouriteToy: 'Ball',
        expenses: [],
        caretaker: mockCaretaker,
    }),
    new Animal({
        id: 2,
        name: 'Lion 2',
        age: 4,
        species: mockSpecies[1],
        favouriteFood: 'Meat',
        favouriteToy: 'Frisbee',
        expenses: [],
        caretaker: mockCaretaker2,
    }),
];

let mockSpeciesDbGetAllSpecies: jest.Mock;
let mockSpeciesDbGetAnimalsFromSpecies: jest.Mock;

beforeEach(() => {
    mockSpeciesDbGetAllSpecies = jest.fn();
    mockSpeciesDbGetAnimalsFromSpecies = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given valid species in the database, when getAllSpecies is called, then species are returned', async () => {
    // given
    
    speciesDb.getAllSpecies = mockSpeciesDbGetAllSpecies.mockResolvedValue(mockSpecies);

    // when
    const result = await speciesService.getAllSpecies();

    // then
    expect(result).toEqual(mockSpecies);
    expect(mockSpeciesDbGetAllSpecies).toHaveBeenCalledTimes(1);
});

test('given database failure, when getAllSpecies is called, then an error is thrown', async () => {
    // given
    speciesDb.getAllSpecies = mockSpeciesDbGetAllSpecies.mockRejectedValue(new Error('Database error.'));

    // when
    const getAllSpecies = async () => await speciesService.getAllSpecies();

    // then
    await expect(getAllSpecies).rejects.toThrow('Failed to retrieve species.');
    expect(mockSpeciesDbGetAllSpecies).toHaveBeenCalledTimes(1);
});

test('given valid species id, when getAnimalsFromSpecies is called, then animals are returned', async () => {
    // given
    const speciesId = 1;
    speciesDb.getAnimalsFromSpecies = mockSpeciesDbGetAnimalsFromSpecies.mockResolvedValue(mockAnimals);

    // when
    const result = await speciesService.getAnimalsFromSpecies({ id: speciesId });

    // then
    expect(result).toEqual(mockAnimals);
    expect(mockSpeciesDbGetAnimalsFromSpecies).toHaveBeenCalledTimes(1);
    expect(mockSpeciesDbGetAnimalsFromSpecies).toHaveBeenCalledWith({ id: speciesId });
});

test('given database failure, when getAnimalsFromSpecies is called, then an error is thrown', async () => {
    // given
    const speciesId = 1;
    speciesDb.getAnimalsFromSpecies = mockSpeciesDbGetAnimalsFromSpecies.mockRejectedValue(new Error('Database error.'));

    // when
    const getAnimalsFromSpecies = async () => await speciesService.getAnimalsFromSpecies({ id: speciesId });

    // then
    await expect(getAnimalsFromSpecies).rejects.toThrow('Failed to retrieve animals from this species.');
    expect(mockSpeciesDbGetAnimalsFromSpecies).toHaveBeenCalledTimes(1);
    expect(mockSpeciesDbGetAnimalsFromSpecies).toHaveBeenCalledWith({ id: speciesId });
});
