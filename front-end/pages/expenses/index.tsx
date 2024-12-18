import ExpenseService from '@services/ExpenseService';
import { useEffect, useState } from 'react';
import { Expense } from '@types';
import Head from 'next/head';
import Header from '@components/header';
import ExpenseOverviewTable from '@components/expenses/ExpenseOverviewTable';
import useSWR, { mutate } from 'swr';
import useInterval from 'use-interval';

const Expenses: React.FC = () => {
    const [unauthorized, setUnauthorized] = useState<boolean>();

    const getExpenses = async () => {
        try {
            const response = await ExpenseService.getExpenses();
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

    const { data, isLoading, error } = useSWR('expenses', getExpenses);

    useInterval(
        () => {
            mutate('expenses', getExpenses());
        },
        isLoading ? 1000 : null
    );

    return (
        <>
            <Head>
                <title>Expenses</title>
            </Head>
            <Header />
            {unauthorized ? (
                <div className="text-center text-red-800">
                    You are not authorized to view this page!
                </div>
            ) : (
                <main className="d-flex flex-column justify-content-center align-items-center">
                    <h1>Expenses</h1>
                    <section>
                        <h2>Expenses overview</h2>
                        {error && <div className="text-center text-red-800">{error.message}</div>}
                        {isLoading && <p className="text-center text-green-800">Loading...</p>}
                        {data && <ExpenseOverviewTable expenses={data} />}
                    </section>
                </main>
            )}
        </>
    );
};

export default Expenses;
