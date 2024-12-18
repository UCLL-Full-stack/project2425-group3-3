import Head from 'next/head';
import Header from '../components/header';
import Language from '../components/language/language';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@styles/Home.module.css'

export default function Home() {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t('main.title')}</title>
                <meta name="description" content="Welcome to the Animal Management System" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Language />
            <main className="d-flex flex-column justify-content-center align-items-center">
                <div className="text-center mt-8">
                    <h1 className="text-4xl font-bold mb-8">{t('main.h1')}</h1>
                    <p className="text-lg text-gray-300 mb-4">{t('main.text1')}</p>
                    <p className="text-lg text-gray-300 mb-4">{t('main.text2')}</p>
                    <p className="text-lg text-gray-300">{t('main.text3')}</p>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>admin_user</td>
                                <td>password</td>
                                <td>Admin</td>
                            </tr>
                            <tr>
                                <td>bob_brown</td>
                                <td>password</td>
                                <td>Manager</td>
                            </tr>
                            <tr>
                                <td>john_doe</td>
                                <td>password</td>
                                <td>Caretaker</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = async (context: { locale: any }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        },
    };
};
