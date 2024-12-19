import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimalOverviewTable from '../components/animals/AnimalOverviewTable'; 
import { Animal, Caretaker, Species, Expense } from '@types'; 

const species1: Species = { id: 1, species: 'Panthera leo' }; 
const species2: Species = { id: 2, species: 'Loxodonta' }; 

const caretaker1: Caretaker = {
    id: 1,
    name: 'John',
    user: { id: 1, username: 'john_doe', password: 'password123', role: 'caretaker' },
};

const caretaker2: Caretaker = {
    id: 2,
    name: 'Alice',
    user: { id: 2, username: 'alice_smith', password: 'password456', role: 'caretaker' },
};

const expense1: Expense = { id: 1, totalCost: 100, month: 'January' };
const expense2: Expense = { id: 2, totalCost: 150, month: 'February' };

const animals: Animal[] = [
    {
        id: 1,
        name: 'Lion',
        age: 5,
        species: species1,
        favouriteFood: 'Meat',
        favouriteToy: 'Ball',
        expenses: [expense1],
        caretaker: caretaker1,
    },
    {
        id: 2,
        name: 'Elephant',
        age: 10,
        species: species2,
        favouriteFood: 'Grass',
        favouriteToy: 'Tire',
        expenses: [expense2],
        caretaker: caretaker2,
    },
];


const DetailTableComponent = ({ animal }: { animal: Animal }) => (
    <div>
        <p>Favourite Food: {animal.favouriteFood}</p>
        <p>Favourite Toy: {animal.favouriteToy}</p>
        <p>Caretaker: {animal.caretaker.name}</p>
    </div>
);

test('renders basic animal information in the table', () => {
    render(
        <AnimalOverviewTable
            animals={animals}
            selectAnimal={jest.fn()}
            DetailTableComponent={DetailTableComponent}
        />
    );

    expect(screen.getByText(/Lion/i)).toBeInTheDocument();
    expect(screen.getByText(/Elephant/i)).toBeInTheDocument();
    expect(screen.getByText(/Panthera leo/i)).toBeInTheDocument();
    expect(screen.getByText(/Loxodonta/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
    expect(screen.getByText(/10/i)).toBeInTheDocument();
});

test('expands and shows details when an animal row is clicked', () => {
    render(
        <AnimalOverviewTable
            animals={animals}
            selectAnimal={jest.fn()}
            DetailTableComponent={DetailTableComponent}
        />
    );

    const lionRow = screen.getByText(/Lion/i).closest('tr');
    fireEvent.click(lionRow);

    expect(screen.getByText(/Favourite Food: Meat/i)).toBeInTheDocument();
    expect(screen.getByText(/Favourite Toy: Ball/i)).toBeInTheDocument();
    expect(screen.getByText(/Caretaker: John/i)).toBeInTheDocument();

    fireEvent.click(lionRow);

    expect(screen.queryByText(/Favourite Food: Meat/i)).not.toBeInTheDocument();
});
