import { Manager } from '../../model/manager';
import { User } from '../../model/user';

const validManagerUser  = new User({
    id: 1,
    username: 'manager_user',
    password: 'securepassword',
    role: 'manager',
});

test('given: valid values for manager, when: manager is created, then: manager is created with those values', () => {
    const manager = new Manager({ id: 1, user: validManagerUser , name: 'Manager User' });
    expect(manager.getId()).toBe(1);
    expect(manager.getUser ()).toBe(validManagerUser );
    expect(manager.getName()).toBe('Manager User');
});

test('given: invalid name, when: manager is created, then: an error is thrown', () => {
    const createManager = () => new Manager({ id: 2, user: validManagerUser , name: '' });
    expect(createManager).toThrow('Name is required and cannot be empty.');
});