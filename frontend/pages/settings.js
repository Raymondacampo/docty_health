import { useState } from "react";
import { useUser } from "@/hooks/User"; // Note: Should this be useAuth?
import UserProfileForm from "@/components/forms/UserProfileForm";
import { apiClient } from "@/utils/api";
import { getApiImgUrl } from "@/utils/api";
import NavBar from "@/components/account/NavBar";
import SidebarToggle from "@/components/account/SideBarToggle";
import LoadingComponent from "@/components/LoadingComponent";
import CustomAlert from "@/components/CustomAlert";
import useAlert from "@/hooks/useAlert";

const Pencil = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#4285f4" />
    <path
      d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      fill="#4285f4"
    />
  </svg>
);

const Field = ({ title, value, setEdit }) => (
  <div className="w-full justify-between items-center gap-4 flex">
    <div className="text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">{title}</div>
    {value ? (
      <div className="max-w-[200px] text-right self-stretch text-black font-['Inter'] text-wrap break-all sm:text-sm xs:text-xs">
        {value}
      </div>
    ) : (
      <button onClick={() => setEdit(true)} className="text-[#4285f4] text-sm font-normal font-['Inter']">
        Add +
      </button>
    )}
  </div>
);

const ChangePasswordModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-black">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <p className="mb-6">Are you sure you want to change your password? We'll send you an email with instructions.</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-[#3d5a80] text-white rounded hover:bg-blue-900">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Settings() {
  const { user, loading, reload } = useUser(); // Note: Verify if this should be useAuth
  const [edit, setEdit] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true); // State for NavBar toggle
  const backendBaseUrl = getApiImgUrl();

  const {alert, showAlert } = useAlert(); // Custom hook for alert management

  if (loading) return <LoadingComponent isLoading={loading}/>;
  if (!user) return <div>Error loading user data.</div>;

  const handlePasswordChangeRequest = async () => {
    try {
      await apiClient.post("/auth/password_reset/", { email: user.email });
      setShowPasswordModal(false);
      showAlert("Password reset email sent successfully!", "success");
    } catch (error) {
      console.error("Error requesting password change:", error);
      showAlert("Failed to send password reset email.", "error");
    }
  };

  const handleEditFinish = () => {
    showAlert("Profile updated successfully!", "success");
    setEdit(false);
    reload();
  };

  return (
    <div className="flex w-full min-h-screen overflow-x-auto">
      <CustomAlert message={alert.msg} status={alert.status} />

      {/* Sidebar Toggle for lg screens */}
      {!isNavOpen && (
        <SidebarToggle onToggle={() => setIsNavOpen(true)} />
      )}
      {/* NavBar */}
      <NavBar isOpen={isNavOpen} onToggle={() => setIsNavOpen(false)} selection={'acc'} />
      {/* Main Content */}
      <div className="flex-1 justify-center items-start gap-2.5 inline-flex mt-2">
        <div className="py-4 rounded-[20px] justify-center items-start gap-4 inline-flex sm:px-0 sm:w-auto xs:w-full">
          <div className="w-full shadow-[0px_4px_6px_2px_rgba(0,0,0,0.15)] self-stretch py-8 bg-white justify-center items-start gap-6 flex flex-wrap 
            lg:px-10 
            md:px-8 
            sm:px-8 sm:rounded-[20px] sm:max-w-[800px]
            xs:px-2">
            <div className="w-full xs:w-[95%] flex-col justify-start items-start gap-6 flex">
              <div className="w-full flex items-center justify-between px-4">
                <div className="self-stretch text-black font-normal font-['Inter'] sm:text-3xl xs:text-2xl">
                  Personal data
                </div>
                {edit && (
                  <button
                    onClick={() => setEdit(false)}
                    className="ml-auto text-[#f44242] justify-end flex text-sm items-center gap-1"
                  >
                    Cancel
                  </button>
                )}
                {!edit && (
                  <button
                    onClick={() => setEdit(true)}
                    className="ml-auto text-[#4285f4] justify-end flex text-sm items-center gap-1"
                  >
                    <Pencil /> Edit info
                  </button>
                )}
              </div>
              <div className="w-full p-4 rounded-[10px] flex-col justify-start items-start gap-6 flex">
                <div className="w-full justify-start items-center gap-[11px] inline-flex flex-col">
                  {user.profile_picture ? (
                    <img
                      src={`${backendBaseUrl}${user.profile_picture}`}
                      alt="Profile Picture"
                      className="w-[125px] h-[125px] rounded-full object-cover"
                      onError={(e) => console.error(`Failed to load profile picture: ${e.target.src}`)}
                    />
                  ) : (
                    <div className="w-[125px] h-[125px] bg-[#d9d9d9] rounded-full flex items-center justify-center text-gray-500">No Photo</div>
                  )}
                </div>
                {edit && <UserProfileForm initialUser={user} finish={handleEditFinish} />}
                {!edit && (
                  <>
                    <Field
                      title="Full name"
                      value={`${user.first_name} ${user.last_name}`}
                      setEdit={setEdit}
                    />
                    <Field title="Username" value={user.username} setEdit={setEdit} />
                    <Field title="E-mail" value={user.email} setEdit={setEdit} />
                    <Field title="Phone number" value={user.phone_number} setEdit={setEdit} />
                    <Field title="Date of birth" value={user.born_date} setEdit={setEdit} />
                  </>
                )}
              </div>
            </div>
            <div className="w-full px-4 flex-col justify-start items-start gap-2 flex">
              <div className="self-stretch text-black font-normal font-['Inter'] sm:text-2xl xs:text-xl">
                Security & privacy
              </div>
              <div className="self-stretch py-4 rounded-[10px] flex-col justify-start items-center gap-4 flex">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-4 py-2 bg-[#98c1d1]/25 rounded-[10px] justify-start items-center gap-[30px] inline-flex"
                >
                  <div className="text-[#3d5a80] text-sm font-normal font-['Inter']">Change password</div>
                  <div data-svg-wrapper>{/* Change password SVG */}</div>
                </button>
              </div>
              <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onConfirm={handlePasswordChangeRequest}
              />
              <a href="">
                <span className="text-[#4285f4] text-sm font-normal font-['Inter']">
                  Enable two factor authentication
                </span>
                <span className="text-[#4285f4] text-base font-normal font-['Inter']">+</span>
              </a>
              <a href="" className="justify-start items-center gap-2 inline-flex">
                <div className="text-[#ff0000] text-sm font-normal font-['Inter']">Delete account</div>
                <div data-svg-wrapper></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}