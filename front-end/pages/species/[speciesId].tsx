import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import useInterval from 'use-interval';
import SpeciesService from '@services/SpeciesService';
import AnimalOverviewTable from '@components/animals/AnimalOverviewTable';
import Header from '@components/header';
import { Animal } from '@types';
import { useEffect, useState } from 'react';

const SpeciesById = () => {
    const [unauthorized, setUnauthorized] = useState<boolean>();

    const router = useRouter();
    const { speciesId } = router.query;

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (!user) {
            setUnauthorized(true);
        } else {
            setUnauthorized(false);
        }
    }, []);

    const fetchAnimalsBySpecies = async () => {
        if (speciesId) {
            return await SpeciesService.getAnimalsBySpecies(Number(speciesId));
        }
        return [];
    };

    const { data: animals, error } = useSWR(
        speciesId ? `species-${speciesId}` : null,
        fetchAnimalsBySpecies
    );

    useInterval(
        () => {
            if (speciesId) {
                mutate(`species-${speciesId}`, fetchAnimalsBySpecies);
            }
        },
        animals ? 10000 : null
    );

    const speciesName = animals && animals.length > 0 ? animals[0].species.species : 'Species';

    return (
        <>
            <Head>
                <title>{speciesName}</title>
            </Head>
            <Header />
            {unauthorized ? (
                <div className="text-center text-red-800">
                    You are not authorized to view this page!
                </div>
            ) : (
                <main className="flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold mb-4">{`All ${speciesName}s on the farm`}</h1>
                    <section className="w-full max-w-4xl mx-auto p-5 text-center">
                        {error && <p className="text-red-800">Failed to load animals</p>}
                        {!animals && <p>Loading...</p>}
                        {animals && animals.length > 0 ? (
                            <AnimalOverviewTable
                                animals={animals}
                                selectAnimal={() => {}}
                                DetailTableComponent={() => (
                                    <>
                                        <p className="text-center">
                                            Navigate to the animals page to explore additional
                                            details.
                                        </p>
                                    </>
                                )}
                            />
                        ) : (
                            <p>No animals found for this species</p>
                        )}
                    </section>
                </main>
            )}
        </>
    );
};

export default SpeciesById;
