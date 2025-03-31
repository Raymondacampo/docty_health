import axios from 'axios';
import React, { useState } from 'react';

// A reusable component for an editable field with a label, text input, and an error message.
const EditableField = ({ title, value, onChange, error, type = "text" }) => {
    return (
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between items-center gap-4">
          <label className="text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">
            {title}
          </label>
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={`self-stretch text-black font-['Inter'] sm:text-sm xs:text-xs border rounded p-2 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };
  

const UserProfileForm = ({ initialUser, finish }) => {
  // Initialize state from the passed user data.
  const [firstName, setFirstName] = useState(initialUser.first_name);
  const [lastName, setLastName] = useState(initialUser.last_name);
  const [username, setUsername] = useState(initialUser.username);
  const [email, setEmail] = useState(initialUser.email);
  const [phoneNumber, setPhoneNumber] = useState(initialUser.phone_number);
  const [bornDate, setBornDate] = useState(initialUser.born_date);

  // State for handling loading, generic errors, and per-field errors.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Validate fields and return an errors object.
  const validateFields = () => {
    const errors = {};
    // Validate full name (first and last)
    if (!(firstName || "").trim()) {
      errors.fullName = "First name is required";
    }
    if (!(lastName || "").trim()) {
      errors.fullName = errors.fullName
        ? errors.fullName + " and last name are required"
        : "Last name is required";
    }
    // Validate username.
    if (!(username || "").trim()){
      errors.username = "Username is required";
    }
    // Validate email.
    if (!(email || "").trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Invalid email address";
      }
    }
    // Validate phone number.
    const phoneRegex = /^\+?\d{7,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
    errors.phone = "Invalid phone number format";
    }
    
    // Validate date of birth.
    if (!(bornDate || "").trim()) {
      errors.bornDate = "Date of birth is required";
    }
    return errors;
  };

  // Handle form submission with a PUT request.
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

    // Prepare the updated user data.
    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      phone_number: phoneNumber,
      born_date: bornDate,
    };

    try {
      const accessToken = localStorage.getItem("access_token");
      console.log("Token being sent:", accessToken);

      if (!accessToken) {
        // Redirect or handle missing token scenario.
        console.error("No access token found");
        return;
      }

      const response = await axios.put(
        "http://localhost:8000/api/auth/me/",
        updatedUser,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log("Profile updated:", response.data);
      // Optionally, handle a successful response here.
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
      if (error == null && finish) {
        finish();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {/* Full name field: handles first and last name combined. */}
      <EditableField
        title="Full name"
        value={`${firstName} ${lastName}`}
        onChange={(e) => {
          const fullName = e.target.value;
          const nameParts = fullName.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
          if (fieldErrors.fullName) {
            setFieldErrors({ ...fieldErrors, fullName: undefined });
          }
        }}
        error={fieldErrors.fullName}
      />
      <EditableField
        title="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          if (fieldErrors.username) {
            setFieldErrors({ ...fieldErrors, username: undefined });
          }
        }}
        error={fieldErrors.username}
      />
      <div className="w-full justify-between items-center gap-4 flex">
        <div className="text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">
          Email
        </div>
          <div className="w-[209px] text-right self-stretch text-black font-['Inter'] text-wrap break-all sm:text-sm xs:text-xs">
              {email}
          </div>   
        </div>
      <EditableField
        title="Phone number"
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
          if (fieldErrors.phone) {
            setFieldErrors({ ...fieldErrors, phone: undefined });
          }
        }}
        error={fieldErrors.phone}
      />
      <EditableField
        title="Date of birth"
        type="date"
        value={bornDate}
        onChange={(e) => {
          setBornDate(e.target.value);
          if (fieldErrors.bornDate) {
            setFieldErrors({ ...fieldErrors, bornDate: undefined });
          }
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
