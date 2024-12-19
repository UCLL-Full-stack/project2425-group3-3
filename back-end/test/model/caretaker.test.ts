import { Caretaker } from '../../model/caretaker';
import { User } from '../../model/user';

const validCaretakerUser  = new User({
    id: 1,
    username: 'caretaker_user',
    password: 'securepassword',
    role: 'caretaker',
});

test('given: valid values for caretaker, when: caretaker is created, then: caretaker is created with those values', () => {
    const caretaker = new Caretaker({ id: 1, user: validCaretakerUser , name: 'Caretaker User' });
    expect(caretaker.getId()).toBe(1);
    expect(caretaker.getUser ()).toBe(validCaretakerUser );
    expect(caretaker.getName()).toBe('Caretaker User');
});

test('given: invalid name, when: caretaker is created, then: an error is thrown', () => {
    const createCaretaker = () => new Caretaker({ id: 2, user: validCaretakerUser , name: '' });
    expect(createCaretaker).toThrow('Name is required and cannot be empty.');
});