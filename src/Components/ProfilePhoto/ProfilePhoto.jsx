import React, { useRef, useState, useEffect } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

function ProfilePhoto({ image, setImage }) {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Clean up object URLs when component unmounts or image changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const imageHandleChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG, etc.)');
            return;
        }

        // Validate file size (e.g., 5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Clean up previous URL if exists
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const imageHandleDelete = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setImage(null);
        setPreviewUrl(null);
        // Clear the file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className='flex justify-center mb-4'>
            <input
                type='file'
                accept='image/*'
                ref={inputRef}
                onChange={imageHandleChange}
                className='hidden'
            />

            {!image ? (
                <div className="flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer w-20 h-20">
                    <LuUser className='text-4xl text-blue-500' />
                    <button
                        onClick={onChooseFile}
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                        aria-label="Upload profile photo"
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt='Profile'
                        className='w-20 h-20 rounded-full object-cover'
                    />
                    <button
                        type='button'
                        onClick={imageHandleDelete}
                        className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                        aria-label="Remove profile photo"
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfilePhoto;