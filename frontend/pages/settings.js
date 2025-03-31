import { useState } from "react";
import { useUser } from "@/hooks/User";
import UserProfileForm from "@/components/forms/UserProfileForm";
import LogoutButton from "@/components/LogoutButton";
import SpecialtySearch from "@/components/account/SpecialtySearch";
import ClinicSearch from "@/components/account/ClinicSearch";
import { SpecializationMenu } from "@/components/account/SpecializationMenu";
import { ClinicMenu } from "@/components/account/ClinicMenu";
import { DoctorDocumentUpload } from "@/components/account/DoctorDocumentUpload";
import DocumentsSection from "@/components/account/DocumentsSection";
import DoctorAvailabilitySection from "@/components/account/DoctorAvailabilitySection";

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
      <div className="w-[209px] text-right self-stretch text-black font-['Inter'] text-wrap break-all sm:text-sm xs:text-xs">
        {value}
      </div>
    ) : (
      <button onClick={() => setEdit(true)} className="text-[#4285f4] text-sm font-normal font-['Inter']">
        Add +
      </button>
    )}
  </div>
);

const ProfessionalData = ({ data, onReload }) => (
  <div className="w-full rounded-[10px] flex-col justify-start items-start gap-6 inline-flex">
    <div className="w-full flex items-center justify-between">
      <div className="self-stretch text-black font-normal font-['Inter'] sm:text-2xl xs:text-xl">
        Professional data
      </div>
    </div>
    <div className="self-stretch p-4 rounded-[10px] flex-col justify-start items-start gap-6 flex">
      <div className="self-stretch flex-col justify-between items-start gap-8 inline-flex">
        <div className="w-full flex-col flex gap-4">
          <div className="self-stretch justify-between items-start gap-4 inline-flex">
            <div className="w-[125px] text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">
              Exequatur
            </div>
            <div className="text-black text-sm font-normal font-['Inter']">{data.exequatur}</div>
          </div>
          <div className="self-stretch justify-between items-start gap-4 inline-flex">
            <div className="w-[125px] text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">
              Experience
            </div>
            <div className="text-black text-sm font-normal font-['Inter']">{data.experience} Years</div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2.5">
          <div className="w-full text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">
            Specialization
          </div>
          {data.specializations.length > 0 &&
            data.specializations.map((specialization) => (
              <div
                key={specialization.id}
                className="w-full px-4 py-2 bg-[#98c1d1]/25 rounded-[10px] justify-between items-center gap-2.5 flex"
              >
                <div className="text-black text-sm font-normal font-['Inter']">{specialization.name}</div>
                <div>
                  <SpecializationMenu specialization={specialization} onDelete={onReload} />
                </div>
              </div>
            ))}
          <SpecialtySearch onSpecialtyAdded={onReload} />
        </div>
        <div className="w-full flex flex-col gap-2.5">
          <div className="w-full text-[#3d5a80] font-normal font-['Inter'] sm:text-base xs:text-sm">Clinics</div>
          {data.clinics.length > 0 &&
            data.clinics.map((clinic) => (
              <div
                key={clinic.id}
                className="w-full px-4 py-2 bg-[#98c1d1]/25 rounded-[10px] justify-between items-center gap-2.5 flex"
              >
                <div className="text-black text-sm font-normal font-['Inter']">{clinic.name}</div>
                <div>
                  <ClinicMenu clinic={clinic} onDelete={onReload} />
                </div>
              </div>
            ))}
          <ClinicSearch onClinicAdded={onReload} />
        </div>
      </div>
    </div>
  </div>
);

const Scheduling = ({ user, onReload }) => (
  <div className="w-full rounded-[10px] flex-col justify-start items-start gap-6 inline-flex">
    <div className="w-full flex items-center justify-between">
      <div className="self-stretch text-black font-normal font-['Inter'] sm:text-2xl xs:text-xl">Availability</div>
    </div>
    <div className="self-stretch flex-col justify-start items-center gap-2 flex">
      <div className="self-stretch rounded-[10px] flex-col justify-start items-center gap-6 flex px-4">
        <div className="self-stretch justify-start items-start gap-4 inline-flex">
          <div className="w-[125px] text-[#3d5a80] font-normal font-['Inter'] sm:text-lg xs:text-base">
            Taking dates
          </div>
        </div>
        <div className="self-stretch flex-col justify-start items-start gap-2 flex">
          <DoctorAvailabilitySection user={user} onReload={onReload} />
        </div>
      </div>
    </div>
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
  const { user, loading, reload } = useUser(); // Use the hook
  const [edit, setEdit] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Error loading user data.</div>;

  const handlePasswordChangeRequest = async () => {
    try {
      await apiClient.post("/auth/password_reset/", { email: user.email });
      setShowPasswordModal(false);
      alert("Password reset email sent successfully!");
    } catch (error) {
      console.error("Error requesting password change:", error);
      alert("Failed to send password reset email.");
    }
  };

  const handleEditFinish = () => {
    setEdit(false);
    reload(); // Trigger reload using the hook's reload function
  };

  return (
    <div className="w-full justify-center items-start gap-2.5 inline-flex">
      <div className="py-4 bg-white rounded-[20px] justify-center items-start gap-4 inline-flex sm:px-0 sm:w-auto xs:w-full">
        <div className="w-full self-stretch py-8 bg-white border border-black/25 justify-center items-start gap-20 flex flex-wrap lg:px-20 md:px-10 sm:px-20 sm:rounded-[20px] sm:max-w-[900px] xs:px-4">
          <div className="w-full flex-col justify-start items-start gap-6 flex">
            <div className="w-full flex items-center justify-between px-4">
              <div className="self-stretch text-black font-normal font-['Inter'] sm:text-2xl xs:text-xl">
                Personal data
              </div>
              {edit &&
                <button
                  onClick={() => setEdit(false)}
                  className="ml-auto text-[#f44242] justify-end flex text-sm items-center gap-1"
                >
                  Cancel
                </button>
              } 
              {edit == false && 
                <button
                  onClick={() => setEdit(true)}
                  className="ml-auto text-[#4285f4] justify-end flex text-sm items-center gap-1"
                >
                  <Pencil /> Edit info
                </button>              
              }

            </div>
            <div className="w-full p-4 rounded-[10px] flex-col justify-start items-start gap-6 flex">
              <div className="w-full justify-start items-center gap-[11px] inline-flex flex-col">
                <div className="w-[75px] h-[75px] bg-[#d9d9d9] rounded-full"></div>
              </div>
              {edit && <UserProfileForm initialUser={user} finish={handleEditFinish} />} 
              {edit == false &&
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
              }
            </div>
          </div>
          {user.is_doctor && (
            <>
              <ProfessionalData data={user} onReload={reload} />
              <Scheduling user={user} onReload={reload} />
              <div className="w-full">
                <DocumentsSection data={user} onReload={reload} />
                <DoctorDocumentUpload onUpload={reload} />
              </div>
            </>
          )}
          <div className="w-full flex-col justify-start items-start gap-2 flex">
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
            <LogoutButton />
            <a href="" className="justify-start items-center gap-2 inline-flex">
              <div className="text-[#ff0000] text-sm font-normal font-['Inter']">Delete account</div>
              <div data-svg-wrapper></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}