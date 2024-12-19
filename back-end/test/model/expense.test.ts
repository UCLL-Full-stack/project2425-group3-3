import { Expense } from '../../model/expense';
import { Animal } from '../../model/animal';
import { Species } from '../../model/species';
import { Caretaker } from '../../model/caretaker';
import { User } from '../../model/user';

const species = new Species({ id: 1, species: 'Dog' });
const caretakerUser  = new User({
    username: 'caretaker_user',
    password: 'password',
    role: 'caretaker',
});
const caretaker = new Caretaker({ id: 1, user: caretakerUser , name: 'Caretaker User' });
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

test('given: valid values for expense, when: expense is created, then: expense is created with those values', () => {
    const expense = new Expense({ id: 1, totalCost: 100, month: '01-2022' });
    expect(expense.getId()).toBe(1);
    expect(expense.getTotalCost()).toBe(100);
    expect(expense.getMonth()).toBe('01-2022');
});

test('given: invalid total cost, when: expense is created, then: an error is thrown', () => {
    const createExpense = () => new Expense({ id: 2, totalCost: -50, month: '01-2022' });
    expect(createExpense).toThrow('Total cost per month must be a non-negative number.');
});

test('given: invalid month format, when: expense is created, then: an error is thrown', () => {
    const createExpense = () => new Expense({ id: 3, totalCost: 100, month: '2022-01' });
    expect(createExpense).toThrow('Invalid month format. Use "MM-YYYY".');
});

test('given: missing month, when: expense is created, then: an error is thrown', () => {
    const createExpense = () => new Expense({ id: 4, totalCost: 100, month: '' });
    expect(createExpense).toThrow('Invalid month format. Use "MM-YYYY".');
});