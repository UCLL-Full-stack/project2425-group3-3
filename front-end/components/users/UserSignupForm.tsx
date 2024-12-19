import { useState } from 'react';
import UserService from '@services/UserService';
import { StatusMessage } from '@types';
import classNames from 'classnames';

const UserSignupForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('caretaker');
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const validate = () => {
        let result = true;
        setStatusMessages([]);

        if (!username) {
            setStatusMessages([{ message: `Username is required.`, type: 'error' }]);
            result = false;
        }
        if (!password) {
            setStatusMessages([{ message: `Password is required.`, type: 'error' }]);
            result = false;
        }
        if (role !== 'manager' && role !== 'caretaker') {
            setStatusMessages([{ message: `Can only add managers or caretakers`, type: 'error' }]);
            result = false;
        }
        return result;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setStatusMessages([]);

        if (!validate()) {
            return;
        }

        const user = {
            username,
            password,
            role,
        };

        const response = await UserService.createUser(user);
        const data = await response.json();
        if (response.ok) {
            setStatusMessages([
                { message: `User ${data.username} was successfully added!`, type: 'success' },
            ]);
            setTimeout(() => {
                setStatusMessages([]);
            }, 3000);
        } else {
            const errorMessage = data.message || response.statusText;
            setStatusMessages([{ message: `Error: ${errorMessage}`, type: 'error' }]);
        }

        setUsername('');
        setPassword('');
        setRole('caretaker');
    };

    return (
        <>
            <div className="w-full md:w-2/3 lg:w-3/4 max-w-md mx-auto bg-neutral-900 border border-green-500 rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
                <h2 className="text-2xl font-semibold text-center mb-4">Add Users</h2>

                {statusMessages && (
                    <div className="text-center mb-4">
                        <ul className="list-none">
                            {statusMessages.map(({ message, type }, index) => (
                                <li
                                    key={index}
                                    className={classNames({
                                        'text-red-800': type === 'error',
                                        'text-blue-800': type === 'success',
                                    })}
                                >
                                    {message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Role:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3"
                        >
                            <option value="caretaker">Caretaker</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-lg text-sm"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </>
    );
};

export default UserSignupForm;
