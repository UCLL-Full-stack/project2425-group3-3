import { Animal } from '../model/animal';
import { Species } from '../model/species';
import database from './database';

const getAllSpecies = async (): Promise<Species[]> => {
    try {
        const speciesPrisma = await database.species.findMany();
        return speciesPrisma.map((speciesPrisma) => Species.from(speciesPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAnimalsFromSpecies = async ({ id }: { id: number }): Promise<Animal[]> => {
    try {
        const AnimalPrisma = await database.animal.findMany({
            where: { species: { id } },
            include: {
                species: true,
                expenses: true,
                caretaker: {
                    include: {
                        user: true
                    }
                }
            },
        });
        return AnimalPrisma.map((AnimalPrisma) => Animal.from(AnimalPrisma))
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }
};

export default { getAllSpecies, getAnimalsFromSpecies };
