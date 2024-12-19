import userService from '../../service/user.service';
import userDb from '../../repository/user.db';
import { User } from '../../model/user';
import { Caretaker } from '../../model/caretaker';
import { Manager } from '../../model/manager';
import { AuthenticationResponse, UserInput } from '../../types';

const mockUser = new User({
    id: 1,
    username: 'mats_bultynck',
    password: 'hashedpassword',
    role: 'caretaker',
});
const mockUser2 = new User({
    id: 2,
    username: 'luka_herroelen',
    password: 'hashedpassword',
    role: 'manager',
});
const mockManager = new Manager({ id: 1, user: mockUser2, name: 'Luka Herroelen' });
const mockCaretaker = new Caretaker({ id: 1, user: mockUser, name: 'Mats Bultynck' });

let mockUserDbGetAllUsers: jest.Mock;
let mockUserDbGetUserByUsername: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockUserDbDeleteUser: jest.Mock;
let mockUserDbCreateUser: jest.Mock;
let mockUserDbGetAllCaretakers: jest.Mock;

beforeEach(() => {
    mockUserDbGetAllUsers = jest.fn();
    mockUserDbGetUserByUsername = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockUserDbDeleteUser = jest.fn();
    mockUserDbCreateUser = jest.fn();
    mockUserDbGetAllCaretakers = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given role admin, when getAllUsers is called, then all users are returned', async () => {
    // given
    userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue([mockUser]);

    // when
    const result = await userService.getAllUsers();

    // then
    expect(result).toEqual([mockUser]);
    expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
});

test('given valid username, when getUserByUsername is called, then user is returned', async () => {
    // given
    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(mockUser);

    // when
    const result = await userService.getUserByUsername({ username: 'janedoe' });

    // then
    expect(result).toEqual(mockUser);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
});

test('given valid user id, when getUserById is called, then user is returned', async () => {
    // given
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(mockUser);

    // when
    const result = await userService.getUserById(1);

    // then
    expect(result).toEqual(mockUser);
    expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
});

test('given valid username, when deleteUser is called, then user is deleted', async () => {
    // given
    userDb.deleteUser = mockUserDbDeleteUser.mockResolvedValue(undefined);

    // when
    await userService.deleteUser({ username: 'janedoe' });

    // then
    expect(mockUserDbDeleteUser).toHaveBeenCalledTimes(1);
    expect(mockUserDbDeleteUser).toHaveBeenCalledWith({ username: 'janedoe' });
});

test('given role caretaker, when getAllCaretakers is called, then all caretakers are returned', async () => {
    // given
    userDb.getAllCaretakers = mockUserDbGetAllCaretakers.mockResolvedValue([mockCaretaker]);

    // when
    const result = await userService.getAllCaretakers();

    // then
    expect(result).toEqual([mockCaretaker]);
    expect(mockUserDbGetAllCaretakers).toHaveBeenCalledTimes(1);
});

test('given existing username, when createUser is called, then error is thrown', async () => {
    // given
    const userInput: UserInput = { username: 'janedoe', password: 'password', role: 'caretaker' };
    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(mockUser);

    // when & then
    await expect(userService.createUser(userInput)).rejects.toThrowError(
        'User with username janedoe is already registered.'
    );
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
});
