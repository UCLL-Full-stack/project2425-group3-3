import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserTable from '../components/users/UserOverviewTable';
import { User, StatusMessage } from '@types';
import UserService from '@services/UserService';

jest.mock('@services/UserService', () => ({
    deleteUser: jest.fn(),
}));

const users: User[] = [
    {
        id: 1,
        username: 'john_doe',
        password: 'password123',
        role: 'admin',
    },
    {
        id: 2,
        username: 'jane_smith',
        password: 'password456',
        role: 'user',
    },
];

test('renders users and displays status message on successful delete', async () => {
    (UserService.deleteUser as jest.Mock).mockResolvedValueOnce({ status: 200 });

    render(<UserTable users={users} />);

    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.getByText('jane_smith')).toBeInTheDocument();

    const deleteButton = screen.getAllByText('Delete')[0]; // First delete button (for john_doe)
    fireEvent.click(deleteButton);

    await waitFor(() => {
        expect(screen.getByText('User deleted successfully')).toBeInTheDocument();
    });
});

test('displays error message when delete fails', async () => {
    (UserService.deleteUser as jest.Mock).mockResolvedValueOnce({
        status: 500,
        json: jest.fn().mockResolvedValue({ message: 'Error deleting user' }),
    });

    render(<UserTable users={users} />);

    const deleteButton = screen.getAllByText('Delete')[0]; // First delete button (for john_doe)
    fireEvent.click(deleteButton);

    await waitFor(() => {
        expect(screen.getByText('Error deleting user')).toBeInTheDocument();
    });
});

test('should call deleteUser when delete button is clicked', async () => {
    const mockDeleteUser = jest.fn().mockResolvedValue({ status: 200 });
    (UserService.deleteUser as jest.Mock) = mockDeleteUser;

    render(<UserTable users={users} />);

    const deleteButton = screen.getAllByText('Delete')[0]; // First delete button (for john_doe)

    fireEvent.click(deleteButton);

    expect(mockDeleteUser).toHaveBeenCalledWith('john_doe');
});
