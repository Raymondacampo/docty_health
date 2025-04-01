// components/forms/UserProfileForm.js
'use client';
import { useState } from 'react';
import { apiClient } from '@/utils/api';

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
    if (file) {
      const img = new Image();
      img.onload = () => {
        if (img.width !== img.height) {
          setError("Profile picture must be square (width must equal height).");
          setProfilePicture(null);
          e.target.value = '';  // Clear input
        } else {
          setProfilePicture(file);
          setError(null);
          setRemovePicture(false);
        }
      };
      img.onerror = () => {
        setError("Failed to load image.");
        setProfilePicture(null);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleRemoveCheckbox = (e) => {
    setRemovePicture(e.target.checked);
    if (e.target.checked) setProfilePicture(null);
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

    try {
      const accessToken = localStorage.getItem('access_token');
      const { data: response } = await apiClient.put('/auth/me/', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Profile updated:", response);
      finish();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter']">First Name</label>
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-black" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter']">Last Name</label>
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-black" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter']">Phone Number</label>
        <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-black" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter']">Date of Birth</label>
        <input type="date" name="born_date" value={formData.born_date} onChange={handleChange} className="border border-gray-300 rounded-md p-2 text-black" />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#3d5a80] text-sm font-normal font-['Inter']">Profile Picture (Square Images Only)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md p-2 text-black"
        />
        {initialUser.profile_picture && (
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={removePicture} onChange={handleRemoveCheckbox} className="h-4 w-4" />
            <span className="text-sm text-gray-600">Remove Profile Picture</span>
          </label>
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="mt-4 bg-[#ee6c4d] text-white px-4 py-2 rounded-md hover:bg-[#ff7653]">Save</button>
    </form>
  );
}