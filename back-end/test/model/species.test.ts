import { Species } from '../../model/species';

test('given: valid values for species, when: species is created, then: species is created with those values', () => {
    const species = new Species({ id: 1, species: 'Cat' });
    expect(species.getId()).toBe(1);
    expect(species.getSpecies()).toBe('Cat');
});

test('given: invalid species name, when: species is created, then: an error is thrown', () => {
    const createSpecies = () => new Species({ id: 2, species: '' });
    expect(createSpecies).toThrow('Species is required and cannot be empty.');
});

test('given: species with only whitespace, when: species is created, then: an error is thrown', () => {
    const createSpecies = () => new Species({ id: 3, species: '   ' });
    expect(createSpecies).toThrow('Species is required and cannot be empty.');
});