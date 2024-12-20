import UserService from '@services/UserService';
import { StatusMessage } from '@types';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import logo from '../logo.png';

const UserLoginForm: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const clearErrors = () => {
        setNameError(null);
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;

        if (!name || name.trim() === '') {
            setNameError('Name is required');
            result = false;
        }

        return result;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Zorgt dat je page niet refresht bij indienen form

        clearErrors();

        if (!validate()) {
            console.log('Validation failed');
            return;
        }

        const user = { username: name, password };
        const response = await UserService.loginUser(user);

        if (response.status === 200) {
            setStatusMessages([{ message: 'login success', type: 'success' }]);

            const user = await response.json();

            sessionStorage.setItem(
                'loggedInUser',
                JSON.stringify({
                    token: user.token,
                    username: user.username,
                    role: user.role,
                })
            );
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } else {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || response.statusText;
            setStatusMessages([{ message: `Error: ${errorMessage}`, type: 'error' }]);
        }
    };

    return (
        <>
            <Image src={logo} alt="Logo" className="mb-4" width={150} height={150} />
            <h3 className="px-0 mb-4 text-xl font-semibold">Login</h3>
            {statusMessages && (
                <div className="row">
                    <ul className="mx-auto mb-3 list-none">
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
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <label htmlFor="nameInput" className="block mb-2 text-sm font-medium">
                    Username:
                </label>
                <div className="block mb-2 text-sm font-medium">
                    <input
                        id="nameInput"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                    />
                    {nameError && <div className="text-red-800">{nameError}</div>}
                </div>
                <label htmlFor="passwordInput" className="block mb-2 text-sm font-medium">
                    Password:
                </label>
                <div className="block mb-2 text-sm font-medium">
                    <input
                        id="passInput"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="text-black border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                    />
                    {passwordError && <div className="text-red-800">{passwordError}</div>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600"
                >
                    Login
                </button>
            </form>
        </>
    );
};

export default UserLoginForm;
