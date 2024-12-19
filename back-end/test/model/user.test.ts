import { User } from '../../model/user';

test('given: valid values for User, when: User is created, then: User is created with those values', () => {
    const user = new User({
        username: 'user1',
        password: 'password1',
        role: 'admin'
    });
    expect(user.getUsername()).toEqual('user1');
    expect(user.getPassword()).toEqual('password1');
    expect(user.getRole()).toEqual('admin');
});

test('given: invalid username, when: User is created, then: an error is thrown', () => {
    const createUser  = () => new User({
        username: '',
        password: 'password1',
        role: 'admin'
    });
    expect(createUser ).toThrow('Username cannot be empty.');
});