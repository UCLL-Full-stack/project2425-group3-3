import { useEffect, useState } from 'react';
import AnimalService from '@services/AnimalService';
import SpeciesService from '@services/SpeciesService';
import UserService from '@services/UserService';
import { Caretaker, Species, StatusMessage } from '@types';
import classNames from 'classnames';
import useSWR from 'swr';

const AnimalAddForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number>(0);
    const [speciesId, setSpeciesId] = useState<number | null>(null);
    const [caretakerId, setCaretakerId] = useState<number | null>(null);
    const [favouriteFood, setFavouriteFood] = useState<string>('');
    const [favouriteToy, setFavouriteToy] = useState<string>('');
    const [firstExpense, setFirstExpense] = useState<number>(0);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [caretakers, setCaretakers] = useState<Caretaker[]>([]);

    const fetchAllData = async () => {
        const [speciesResponse, caretakersResponse] = await Promise.all([
            SpeciesService.getSpecies(),
            UserService.getCaretakers(),
        ]);

        if (!speciesResponse.ok) {
            throw new Error(`Failed to fetch species: ${speciesResponse.statusText}`);
        }

        if (!caretakersResponse.ok) {
            throw new Error(`Failed to fetch caretakers: ${caretakersResponse.statusText}`);
        }

        const speciesData = await speciesResponse.json();
        const caretakersData = await caretakersResponse.json();

        return { species: speciesData, caretakers: caretakersData };
    };

    const { data, error } = useSWR('animalAddFormData', fetchAllData);

    const validate = () => {
        let result = true;
        setStatusMessages([]);

        if (!name.trim()) {
            setStatusMessages([{ message: `Name is required.`, type: 'error' }]);
            result = false;
        }
        if (age < 0) {
            setStatusMessages([{ message: `Age must be a non-negative number.`, type: 'error' }]);
            result = false;
        }
        if (!speciesId) {
            setStatusMessages([{ message: `Species is required.`, type: 'error' }]);
            result = false;
        }
        if (!caretakerId) {
            setStatusMessages([{ message: `Caretaker is required.`, type: 'error' }]);
            result = false;
        }
        if (!favouriteFood.trim()) {
            setStatusMessages([{ message: `Favourite food is required.`, type: 'error' }]);
            result = false;
        }
        if (!favouriteToy.trim()) {
            setStatusMessages([{ message: `Favourite toy is required.`, type: 'error' }]);
            result = false;
        }
        if (firstExpense < 0) {
            setStatusMessages([{ message: `Expense must be a non-negative number.`, type: 'error' }]);
            result = false;
        }

        return result;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setStatusMessages([]);

        if (!validate()) {
            return;
        }

        const animal = {
            name,
            age,
            speciesId,
            favouriteFood,
            favouriteToy,
            firstExpense,
            caretakerId,
        };

        const response = await AnimalService.createAnimal(animal);
        const data = await response.json();
        if (response.status === 200) {
            setStatusMessages([
                { message: `Animal ${data.name} was successfully added!`, type: 'success' },
            ]);
            setTimeout(() => {
                setStatusMessages([]);
            }, 3000);
            setName('');
            setAge(0);
            setSpeciesId(null);
            setFavouriteFood('');
            setFavouriteToy('');
            setFirstExpense(0);
            setCaretakerId(null);
        } else {
            const errorMessage = data.message || response.statusText;
            setStatusMessages([{ message: `Error: ${errorMessage}`, type: 'error' }]);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="w-full md:w-2/3 lg:w-3/4 mx-auto bg-neutral-900 border border-green-500 rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
                <h2 className="text-2xl font-semibold text-center mb-4">Add Animals</h2>

                {statusMessages && (
                    <div className="text-center mb-4">
                        <ul className="list-none">
                            {statusMessages.map(({ message, type }, index) => (
                                <li
                                    key={index}
                                    className={classNames({
                                        'text-red-800': type === 'error',
                                        'text-blue-800': type === 'success',
                                    })}
                                >
                                    {message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Age:</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Species:</label>
                        <select
                            value={speciesId || ''}
                            onChange={(e) => setSpeciesId(Number(e.target.value))}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        >
                            <option value="">Select a species</option>
                            {data?.species.map((species: Species) => (
                                <option key={species.id} value={species.id}>
                                    {species.species}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Favourite Food:</label>
                        <input
                            type="text"
                            value={favouriteFood}
                            onChange={(e) => setFavouriteFood(e.target.value)}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Favourite Toy:</label>
                        <input
                            type="text"
                            value={favouriteToy}
                            onChange={(e) => setFavouriteToy(e.target.value)}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">First Expense:</label>
                        <input
                            type="number"
                            value={firstExpense}
                            onChange={(e) => setFirstExpense(Number(e.target.value))}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Caretaker:</label>
                        <select
                            value={caretakerId || ''}
                            onChange={(e) => setCaretakerId(Number(e.target.value))}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        >
                            <option value="">Select a caretaker</option>
                            {data?.caretakers.map((caretaker: Caretaker) => (
                                <option key={caretaker.id} value={caretaker.id}>
                                    {caretaker.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-lg text-sm"
                    >
                        Add Animal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AnimalAddForm;
