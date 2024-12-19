import { Admin } from '../../model/admin';
import { User } from '../../model/user';

const validAdminUser  = new User({
    id: 1,
    username: 'admin_user',
    password: 'securepassword',
    role: 'admin',
});

test('given: valid values for admin, when: admin is created, then: admin is created with those values', () => {
    const admin = new Admin({ id: 1, user: validAdminUser , name: 'Admin User' });
    expect(admin.getId()).toBe(1);
    expect(admin.getUser ()).toBe(validAdminUser );
    expect(admin.getName()).toBe('Admin User');
});

test('given: invalid name, when: admin is created, then: an error is thrown', () => {
    const createAdmin = () => new Admin({ id: 2, user: validAdminUser , name: '' });
    expect(createAdmin).toThrow('Name is required and cannot be empty.');
});