import AnimalService from '@services/AnimalService';
import { useEffect, useState } from 'react';
import { Animal, User } from '@types';
import Head from 'next/head';
import Header from '@components/header';
import AnimalOverviewTable from '@components/animals/AnimalOverviewTable';
import AnimalDetailsTable from '@components/animals/AnimalDetailsTable';
import useSWR, { mutate } from 'swr';
import useInterval from 'use-interval';
import AnimalExpenseTable from '@components/animals/AnimalExpenseTable';
import AnimalAdminTable from '@components/animals/AnimalAdminTable';

const Animals: React.FC = () => {
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [unauthorized, setUnauthorized] = useState<boolean>();

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            setLoggedInUser(JSON.parse(user));
        }
        setIsReady(true);
    }, []);

    const getAnimals = async () => {
        try {
            // if (loggedInUser && loggedInUser.role === 'caretaker') {
            //     const response = await AnimalService.getAnimalsByCaretaker(loggedInUser.username);

            //     if (!response.ok) {
            //         if (response.status === 401) {
            //             setUnauthorized(true);
            //         } else {
            //             throw new Error(response.statusText);
            //         }
            //     }
            //     return await response.json();
            // } else {
            const response = await AnimalService.getAnimals();

            if (!response.ok) {
                if (response.status === 401) {
                    setUnauthorized(true);
                } else {
                    throw new Error(response.statusText);
                }
            }

            return await response.json();
            // }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const { data, isLoading, error } = useSWR(isReady ? 'animals' : null, getAnimals);

    useInterval(
        () => {
            mutate('animals', getAnimals());
        },
        isLoading ? 1000 : null
    );

    const selectAnimal = (animal: Animal) => {
        setSelectedAnimal(animal);
    };

    return (
        <>
            <Head>
                <title>Animals</title>
            </Head>
            <Header />
            {unauthorized ? (
                <div className="text-center text-red-800">
                    You are not authorized to view this page!
                </div>
            ) : (
                <main className="d-flex flex-column justify-content-center align-items-center">
                    <h1>Animals</h1>
                    <section>
                        <h2>Animals overview</h2>
                        {error && <div className="text-center text-red-800">{error.message}</div>}
                        {isLoading && <p className="text-center text-green-800">Loading...</p>}
                        {data && (
                            <AnimalOverviewTable
                                animals={data}
                                selectAnimal={selectAnimal}
                                DetailTableComponent={
                                    loggedInUser
                                        ? loggedInUser.role === 'caretaker'
                                            ? AnimalDetailsTable
                                            : loggedInUser.role === 'manager'
                                            ? AnimalExpenseTable
                                            : AnimalAdminTable
                                        : AnimalAdminTable
                                }
                            />
                        )}
                    </section>
                </main>
            )}
        </>
    );
};

export default Animals;
