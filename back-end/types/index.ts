import { Caretaker } from '../model/caretaker';
import { Expense } from '../model/expense';
import { Species } from '../model/species';

type Role = 'admin' | 'caretaker' | 'manager';

interface UserInput {
    id?: number;
    username: string;
    password: string;
    role: Role;
}

interface SpeciesInput {
    id?: number;
    species: string;
}

interface ExpenseInput {
    id?: number;
    totalCost: number;
    month: string;
}

interface AnimalInput {
    id?: number;
    name: string;
    age: number;
    speciesId: number;
    favouriteFood: string;
    favouriteToy: string;
    firstExpense: number;
    caretakerId: number;
}

interface CaretakerInput {
    id?: number;
    user: UserInput;
    name: string;
}

interface ManagerInput {
    id?: number;
    user: UserInput;
    name: string;
}

type AuthenticationResponse = {
    token: string;
    username: string;
    role: string;
};

export {
    Role,
    UserInput,
    SpeciesInput,
    ExpenseInput,
    AnimalInput,
    CaretakerInput,
    ManagerInput,
    AuthenticationResponse,
};
