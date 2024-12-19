import React, { useEffect, useState } from 'react';
import SpeciesService from '../../services/SpeciesService';
import styles from '../../styles/Home.module.css';
import useSWR from 'swr';

type Species = {
    id: number;
    species: string;
};

const SpeciesOverviewTable: React.FC = () => {
    const [unauthorized, setUnauthorized] = useState<boolean>();

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (!user) {
            setUnauthorized(true);
        } else {
            setUnauthorized(false);
        }
    }, []);

    const fetchSpeciesAndCounts = async () => {
        const species: Species[] = await SpeciesService.getSpecies().then((res: Response) =>
            res.json()
        );

        const countsPromises = species.map(async (s: Species) => {
            const animals = await SpeciesService.getAnimalsBySpecies(s.id);
            return { id: s.id, count: animals.length };
        });

        const counts = await Promise.all(countsPromises);

        const animalCounts: { [key: number]: number } = {};
        counts.forEach(({ id, count }: { id: number; count: number }) => {
            animalCounts[id] = count;
        });

        return { species, animalCounts };
    };

    const { data, error } = useSWR('speciesAndCounts', fetchSpeciesAndCounts);

    const species = data?.species || [];
    const animalCounts = data?.animalCounts || {};

    return (
        <div className={styles.tableContainer}>
            {error && <div className="text-center text-red-800">{error.message}</div>}

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th scope="col">Species</th>
                        <th scope="col">Amount of animals from this species</th>
                    </tr>
                </thead>
                <tbody>
                    {species.map((s) => (
                        <tr
                            key={s.id}
                            onClick={() => {
                                if (!unauthorized) {
                                    window.location.href = `/species/${s.id}`;
                                }
                            }}
                            role={unauthorized ? undefined : 'button'}
                            className={unauthorized ? 'cursor-default' : 'cursor-pointer'}
                        >
                            <td>{s.species}</td>
                            <td>{animalCounts[s.id] || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SpeciesOverviewTable;
