import { Animal } from '../../model/animal';
import { Species } from '../../model/species';
import { Caretaker } from '../../model/caretaker';
import { User } from '../../model/user';
import { Expense } from '../../model/expense';

const species = new Species({ id: 1, species: 'Dog' });
const caretakerUser  = new User({
    username: 'caretaker_user',
    password: 'password',
    role: 'caretaker',
});
const caretaker = new Caretaker({ id: 1, user: caretakerUser , name: 'Caretaker User' });

test('given: valid values for animal, when: animal is created, then: animal is created with those values', () => {
    const animal = new Animal({
        id: 1,
        name: 'Buddy',
        age: 3,
        species,
        favouriteFood: 'Meat',
        favouriteToy: 'Ball',
        expenses: [], // Assuming expenses can be an empty array
        caretaker,
    });
    expect(animal.getId()).toBe(1);
    expect(animal.getName()).toBe('Buddy');
    expect(animal.getAge()).toBe(3);
    expect(animal.getSpecies()).toBe(species);
    expect(animal.getFavouriteFood()).toBe('Meat');
    expect(animal.getFavouriteToy()).toBe('Ball');
    expect(animal.getCaretakers()).toBe(caretaker);
});

test('given: invalid age, when: animal is created, then: an error is thrown', () => {
    const createAnimal = () => new Animal({
        id: 3,
        name: 'Max',
        age: -1, // Invalid age
        species,
        favouriteFood: 'Meat',
        favouriteToy: 'Ball',
        expenses: [],
        caretaker,
    });
    expect(createAnimal).toThrow('Age must be a non-negative number.');
});

test('given: invalid favourite food, when: animal is created, then: an error is thrown', () => {
    const createAnimal = () => new Animal({
        id: 4,
        name: 'Max',
        age: 2,
        species,
        favouriteFood: '', // Invalid favourite food
        favouriteToy: 'Ball',
        expenses: [],
        caretaker,
    });
    expect(createAnimal).toThrow('Favourite food is required and cannot be empty.');
});

test('given: invalid favourite toy, when: animal is created, then: an error is thrown', () => {
    const createAnimal = () => new Animal({
        id: 5,
        name: 'Max',
        age: 2,
        species,
        favouriteFood: 'Meat',
        favouriteToy: '', // Invalid favourite toy
        expenses: [],
        caretaker,
    });
    expect(createAnimal).toThrow('Favourite toy is required and cannot be empty.');
});