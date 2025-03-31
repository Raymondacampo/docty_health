'use client';

import React, { useState } from 'react';
import { apiClient } from '@/utils/api'; // Import apiClient

const EditableField = ({ title, value, onChange, error, type = "text" }) => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between items-center gap-4">
        <label className="text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">{title}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`self-stretch text-black font-['Inter'] sm:text-sm xs:text-xs border rounded p-2 ${error ? "border-red-500" : "border-gray-300"}`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const UserProfileForm = ({ initialUser, finish }) => {
  const [firstName, setFirstName] = useState(initialUser.first_name);
  const [lastName, setLastName] = useState(initialUser.last_name);
  const [username, setUsername] = useState(initialUser.username);
  const [email] = useState(initialUser.email); // Email is read-only
  const [phoneNumber, setPhoneNumber] = useState(initialUser.phone_number);
  const [bornDate, setBornDate] = useState(initialUser.born_date);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateFields = () => {
    const errors = {};
    if (!(firstName || "").trim()) {
      errors.fullName = "First name is required";
    }
    if (!(lastName || "").trim()) {
      errors.fullName = errors.fullName ? errors.fullName + " and last name are required" : "Last name is required";
    }
    if (!(username || "").trim()) {
      errors.username = "Username is required";
    }
    const phoneRegex = /^\+?\d{7,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      errors.phone = "Invalid phone number format";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    } else {
      setFieldErrors({});
    }

    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      phone_number: phoneNumber,
      born_date: bornDate,
    };

    try {
      const accessToken = localStorage.getItem('access_token');
      const { data } = await apiClient.put('/auth/me/', updatedUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send access token in header
        },
      });
      console.log("Profile updated:", data);
      if (finish) finish();
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <EditableField
        title="Full name"
        value={`${firstName} ${lastName}`}
        onChange={(e) => {
          const fullName = e.target.value;
          const nameParts = fullName.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
          if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: undefined });
        }}
        error={fieldErrors.fullName}
      />
      <EditableField
        title="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: undefined });
        }}
        error={fieldErrors.username}
      />
      <div className="w-full justify-between items-center gap-4 flex">
        <div className="text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">Email</div>
        <div className="w-[209px] text-right self-stretch text-black font-['Inter'] text-wrap break-all sm:text-sm xs:text-xs">{email}</div>
      </div>
      <EditableField
        title="Phone number"
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
          if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
        }}
        error={fieldErrors.phone}
      />
      <EditableField
        title="Date of birth"
        type="date"
        value={bornDate}
        onChange={(e) => {
          setBornDate(e.target.value);
          if (fieldErrors.bornDate) setFieldErrors({ ...fieldErrors, bornDate: undefined });
        }}
        error={fieldErrors.bornDate}
      />
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-[#ee6c4d] text-white rounded hover:bg-[#ff7653] transition"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default UserProfileForm;