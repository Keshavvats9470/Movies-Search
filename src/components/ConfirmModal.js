import React from 'react';

function ConfirmModal({ show, onClose, onConfirm }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#121212] p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-100 mb-4">Confirm Deletion</h2>
                <p className="text-gray-300 mb-6">Are you sure you want to remove this movie?</p>
                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-600 text-gray-200 px-4 py-2 rounded mr-2">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-600 text-gray-200 px-4 py-2 rounded">Yes, Remove</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
