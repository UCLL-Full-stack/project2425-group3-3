import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type PopupProps = {
    onCancel: () => void;
    onConfirm: () => void;
};

const Popup: React.FC<PopupProps> = ({ onCancel, onConfirm }) => {
    return (
        <>
            <div
                className="relative z-10"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                ></div>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-neutral-700 shadow-xl transition-all sm:w-96">
                        <div className="p-4">
                            <div className="flex flex-row items-center">
                                <div className="flex flex-col w-full">
                                    <div className="align-top self-start">
                                        <div className="flex items-center justify-center  mx-auto w-12 h-12 rounded-full bg-red-100">
                                            <ExclamationTriangleIcon className="h-7 w-7 text-red-600 m-2" />
                                        </div>
                                    </div>

                                    <div className="text-center flex flex-col justify-center ">
                                        <h3
                                            className="text-2xl font-thin text-gray-200 pt-0"
                                            id="modal-title"
                                        >
                                            Logout
                                        </h3>
                                        <p className="text-sm text-gray-400 ">
                                            Are you sure you want to logout?
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 px-4 py-3 justify-between bg-neutral-700 sm:flex-row sm:px-6">
                            <button
                                onClick={onCancel}
                                type="button"
                                className="inline-flex justify-center w-full px-4 py-2 text-sm text-gray-200 bg-neutral-700 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                type="button"
                                className="inline-flex justify-center w-full px-4 py-2 text-sm font-thin text-gray-200 bg-red-600 rounded-md shadow-sm hover:bg-red-400 hover:text-gray-900 "
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Popup;
