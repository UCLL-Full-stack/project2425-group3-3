const getToken = () => {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
        return JSON.parse(user)?.token;
    }
    return null;
};

const getAnimals = async () => {
    const token = getToken();

    return fetch(process.env.NEXT_PUBLIC_API_URL + '/animals', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

// const getAnimalsByCaretaker = async (username: string) => {
//     try {
//         const token = getToken();
//         const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/animals/${username}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         console.log(response);

//         if (!response.ok) {

//             throw new Error(`Failed to fetch animals. Status: ${response.status}`);
//         }

//         // const animals = await response.json();

//         // if (!Array.isArray(animals)) {
//         //     console.error('Expected an array of animals, but got:', animals);
//         //     return []; // Return an empty array if the response is not an array
//         // }
//         // console.log(animals);
//         return response;
//     } catch (error) {
//         console.error('Error fetching animals:', error);
//         return [];
//     }
// };

const deleteAnimal = async (id: string) => {
    try {
        const token = getToken();
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/animals/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete animal. Status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Error deleting animal:', error);
        return null;
    }
};

const putNewCaretaker = async (id: string, caretakerId: string) => {
    try {
        const token = getToken();
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/animals/${id}/${caretakerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to update caretaker. Status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Error updating caretaker:', error);
        return null;
    }
};

const createAnimal = async (animal: { name: string; age: number; speciesId: number, favouriteFood: string, favouriteToy: string, firstExpense: number, caretakerId: number }) => {
    const token = getToken();

    return fetch(process.env.NEXT_PUBLIC_API_URL + '/animals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(animal),
    });
};


const AnimalService = {
    getAnimals,
    // getAnimalsByCaretaker,
    deleteAnimal,
    putNewCaretaker,
    createAnimal,
};

export default AnimalService;
