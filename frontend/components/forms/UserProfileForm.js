// components/forms/UserProfileForm.js
'use client';
import { useState } from 'react';
import { formApiClient } from '@/utils/api';

export default function UserProfileForm({ initialUser, finish }) {
  const [formData, setFormData] = useState({
    first_name: initialUser.first_name || '',
    last_name: initialUser.last_name || '',
    phone_number: initialUser.phone_number || '',
    born_date: initialUser.born_date || '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [removePicture, setRemovePicture] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file ? { name: file.name, size: file.size, type: file.type } : 'None');
    if (!file) {
      setProfilePicture(null);
      setError('No file selected');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG or PNG image.');
      setProfilePicture(null);
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      setProfilePicture(null);
      e.target.value = '';
      return;
    }

    setProfilePicture(file);
    setError(null);
    setRemovePicture(false);
    console.log('Profile picture set:', file.name);
  };

  const handleRemoveCheckbox = (e) => {
    setRemovePicture(e.target.checked);
    if (e.target.checked) setProfilePicture(null);
    console.log('Remove picture:', e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('phone_number', formData.phone_number);
    data.append('born_date', formData.born_date);

    if (profilePicture) {
      data.append('profile_picture', profilePicture);
    } else if (removePicture) {
      data.append('profile_picture', 'remove');
    }

    console.log('FormData contents:');
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    try {
      const response = await formApiClient.put('/auth/me/', data);
      console.log('API response:', response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      console.error('API error:', err.response?.data || err.message);
    } finally {
      finish();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter'] text-wrap">First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full max-w-full border border-gray-300 rounded-md p-2 text-black box-border"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter'] text-wrap">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full max-w-full border border-gray-300 rounded-md p-2 text-black box-border"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter'] text-wrap">Phone Number</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full max-w-full border border-gray-300 rounded-md p-2 text-black box-border"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter'] text-wrap">Date of Birth</label>
        <input
          type="date"
          name="born_date"
          value={formData.born_date}
          onChange={handleChange}
          className="w-full max-w-full border border-gray-300 rounded-md p-2 text-black box-border"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter'] text-wrap">
          Profile Picture (Will be cropped to square)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full max-w-full rounded-md p-2 text-black box-border text-ellipsis"
        />
        {initialUser.profile_picture && (
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={removePicture}
              onChange={handleRemoveCheckbox}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-600 text-wrap">Remove Profile Picture</span>
          </label>
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="mt-4 bg-[#ee6c4d] text-white px-4 py-2 rounded-md hover:bg-[#ff7653]"
      >
        Save
      </button>
    </form>
  );
}