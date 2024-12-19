const getSpecies = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/species', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const getAnimalsBySpecies = async (id: number) => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/species/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch animals');
        }
        const animals = await response.json();
        if (!Array.isArray(animals)) {
            console.error('Expected an array of animals, but got:', animals);
            return []; // Return an empty array if the response is not an array
        }
        return animals;
    } catch (error) {
        console.error('Error fetching animals:', error);
        return []; // Return an empty array in case of an error
    }
};

const SpeciesService = {
    getSpecies,
    getAnimalsBySpecies,
};

export default SpeciesService;
