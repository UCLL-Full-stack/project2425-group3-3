import UserService from '@services/UserService';
import { useEffect, useState } from 'react';
import { User } from '@types';
import Head from 'next/head';
import Header from '@components/header';
import UserOverviewTable from '@components/users/UserOverviewTable';
import useSWR, { mutate } from 'swr';
import useInterval from 'use-interval';
import UserSignupForm from '@components/users/UserSignupForm';
import AnimalAddForm from '@components/animals/AnimalAddForm';

const Users: React.FC = () => {
    const [unauthorized, setUnauthorized] = useState<boolean>();
    
    const getUsers = async () => {
        try {
            const response = await UserService.getUsers();
            if (!response.ok) {
                if (response.status === 401) {
                    setUnauthorized(true);
                } else {
                    throw new Error(response.statusText);
                }
            } else {
                return await response.json();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const { data, isLoading, error } = useSWR('users', getUsers);

    useInterval(
        () => {
            mutate('users', getUsers());
        },
        isLoading ? 1000 : null
    );

    return (
        <>
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            <Header />
            {unauthorized ? (
                <div className="text-center text-red-800">
                    You are not authorized to view this page!
                </div>
            ) : (
                <main className="d-flex flex-column justify-content-center align-items-center">
                    <h1>Admin Dashboard</h1>
                    <section>
                        <h2>Users overview</h2>
                        {error && <div className="text-center text-red-800">{error.message}</div>}
                        {isLoading && <p className="text-center text-green-800">Loading...</p>}
                        {data && <UserOverviewTable users={data} />}
                    </section>
                    <section className="flex flex-col items-center min-h-screen p-6">
                        <div className="flex justify-between gap-6 w-3/4">
                            <UserSignupForm />
                            <AnimalAddForm />
                        </div>
                    </section>
                </main>
            )}
        </>
    );
};

export default Users;
