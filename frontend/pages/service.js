export default function Service() {
  return (
    <div className="w-full relative flex justify-center items-center bg-white overflow-hidden tracking-wide py-16 px-4">
        <div className="flex max-w-4xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="text-2xl text-[#060648] font-bold">Terms of Service</div>
            <div className="text-sm text-black">Last updated: <b>13-05-2025</b></div>            
          </div>
        
            <div className="text-sm text-black">
              Welcome to Doctify, a platform based in the Dominican Republic that connects patients with doctors. By using our services, you agree to the following terms. 
              Please read them carefully before registering or using the platform.
            </div>

            <div className="text-xl text-[#060648] font-bold">1. Acceptance of Terms</div>
            <div className="text-sm text-black">
              By accessing or using Doctify, you agree to be bound by these Terms of Service. If you do not agree with any part of the terms, you may not use the platform.
            </div>

            <div className="text-xl text-[#060648] font-bold">2. User Types and Eligibility</div>
            <div className="text-sm text-black">
              Doctify is intended for:

              Patients looking to find and schedule appointments with medical professionals.

              Doctors who wish to offer their services to patients.

              Doctors register directly through the platform. There is no prior verification system before listing.
            </div>

            <div className="text-xl text-[#060648] font-bold">3. Services Provided</div>
            <div className="text-sm text-black">
              Users can:

              Search for doctors based on specialty, location, and other filters.

              Book appointments.

              Rate and review doctors.

              Save favorite doctors.

              Doctify is only for scheduling appointments. No medical services or payments are conducted directly through the platform.
            </div>

            <div className="text-xl text-[#060648] font-bold">4. Data Collection</div>
            <div className="text-sm text-black">
              We collect the following user information:

              Name

              Phone number

              Email address

              Exequatur number (for doctors)

              Location

              Insurance provider details

              We do not collect or store any medical records. Only appointment logs are saved.
            </div>

            <div className="text-xl text-[#060648] font-bold">5. Responsibility and Liability</div>
            <div className="text-sm text-black">
              Doctify is not responsible for the conduct, diagnosis, treatment, or availability of any doctor listed. All medical responsibility lies solely with the doctor.
              We do not guarantee the outcome of appointments or the availability of any professional.
            </div>
            <div className="text-xl text-[#060648] font-bold">6. User Content and Reviews</div>
            <div className="text-sm text-black">
              Users may leave reviews and ratings. We do not moderate or remove user-generated content unless legally required to do so.
            </div>

            <div className="text-xl text-[#060648] font-bold">7. Account Management</div>
            <div className="text-sm text-black">
              Users can delete their accounts at any time.

              Doctify reserves the right to suspend or permanently remove any account, especially in cases of impersonation or fraud (e.g., fake doctor profiles).
            </div>

            <div className="text-xl text-[#060648] font-bold">8. Governing Law</div>
            <div className="text-sm text-black">
              These Terms shall be governed by the laws of the Dominican Republic.
            </div>

            <div className="text-xl text-[#060648] font-bold">9. Modifications</div>
            <div className="text-sm text-black">
              We reserve the right to update these Terms of Service at any time. Changes will be notified through the platform and updated on this page.

              If you have any questions or concerns, please contact us via the platform's support page.
            </div>
        </div>
    </div>
  );
}