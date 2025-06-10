import { useUser } from "@/hooks/User";
import LogoutButton from "@/components/LogoutButton";
import LoadingComponent from "@/components/LoadingComponent";
import { UserIcon, Cog6ToothIcon, CalendarDateRangeIcon } from '@heroicons/react/24/solid';
import {CheckCircleIcon} from "@heroicons/react/24/outline";


const ConfigBox = ({ title, description, icon, link }) => (
  <a
    href={link}
    className="border border-[#3d5a80]/25 justify-center items-center inline-flex hover:bg-[#98c1d1]/25 sm:flex-col sm:w-[300px] sm:order-first sm:gap-4 sm:px-8 xs:flex-row xs:w-full xs:order-last xs:py-4 xs:gap-4 xs:px-4"
  >
    <div className="flex-col justify-center items-start flex sm:gap-4 xs:gap-2">
      <div className="text-[#293241] font-bold font-['Inter'] sm:text-lg xs:text-base">{title}</div>
      <div className="text-[#293241] font-medium font-['Inter'] sm:text-sm xs:text-xs">{description}</div>
    </div>
    <div data-svg-wrapper className="sm:order-last xs:order-first xs:max-h-[50px] xs:max-w-[50px]">
      {icon}
    </div>
  </a>
);

const ConfigValues = ({ is_doc }) => (
  <div className="flex flex-wrap max-w-[1500px] justify-start gap-x-12 sm:flex-row sm:w-auto sm:gap-y-4 xs:flex-col xs:w-full xs:gap-y-2">
    <ConfigBox
      title="Account settings"
      description="Configure your settings right here for your account bla djeh euehr"
      icon={<Cog6ToothIcon className="w-14 h-14 text-[#3D5A80]" />}
      link="/settings"
    />
    {is_doc &&
    <>
      <ConfigBox
        title="Doctor settings"
        description="Configure your settings right here for your account bla djeh euehr"
        icon={        <div className="flex items-center">
            <Cog6ToothIcon className="w-12 h-12 text-[#3D5A80]"/>            
            <UserIcon className="w-11 h-12 text-[#3D5A80]" />
          </div>}
        link="/doctor_settings"
      />    
      <ConfigBox
        title="Availability"
        description="Configure your settings right here for your account bla djeh euehr"
        icon={<CheckCircleIcon className="w-14 h-14 text-[#3D5A80]" />}
        link="/availability"
      />      
    </>

    }

    <ConfigBox
      title="Appointments"
      description="Configure your settings right here for your account bla djeh euehr"
      icon={
        <svg width="100%" height="100%" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M42.9667 24.7432C43.9875 25.4105 44.8977 26.1673 45.6974 27.0137C46.497 27.86 47.1861 28.7878 47.7646 29.7969C48.3431 30.806 48.7684 31.8721 49.0406 32.9951C49.3128 34.1182 49.466 35.2656 49.5 36.4375C49.5 38.3743 49.1172 40.1973 48.3516 41.9062C47.5859 43.6152 46.5311 45.1045 45.187 46.374C43.8429 47.6436 42.2861 48.6445 40.5167 49.377C38.7472 50.1094 36.8417 50.4837 34.8 50.5C33.2517 50.5 31.7545 50.2803 30.3083 49.8408C28.8622 49.4014 27.5351 48.7666 26.3271 47.9365C25.1191 47.1064 24.0472 46.1136 23.1115 44.958C22.1757 43.8024 21.4526 42.5247 20.9422 41.125H0.5V3.625H7.03333V0.5H10.3V3.625H33.1667V0.5H36.4333V3.625H42.9667V24.7432ZM3.76667 6.75V13H39.7V6.75H36.4333V9.875H33.1667V6.75H10.3V9.875H7.03333V6.75H3.76667ZM20.1766 38C20.1255 37.4954 20.1 36.9746 20.1 36.4375C20.1 35.0378 20.3042 33.6787 20.7125 32.3604C21.1208 31.042 21.7418 29.7969 22.5755 28.625H20.1V25.5H23.3667V27.5996C24.0642 26.7695 24.8384 26.0371 25.6891 25.4023C26.5398 24.7676 27.4585 24.2223 28.4453 23.7666C29.4321 23.3109 30.4615 22.9691 31.5333 22.7412C32.6052 22.5133 33.6941 22.3913 34.8 22.375C36.5014 22.375 38.1347 22.6436 39.7 23.1807V16.125H3.76667V38H20.1766ZM34.8 47.375C36.3823 47.375 37.8625 47.0902 39.2406 46.5205C40.6188 45.9508 41.8267 45.1696 42.8646 44.1768C43.9024 43.1839 44.7191 42.0283 45.3146 40.71C45.9101 39.3916 46.2163 37.9674 46.2333 36.4375C46.2333 34.9238 45.9356 33.5078 45.3401 32.1895C44.7446 30.8711 43.928 29.7155 42.8901 28.7227C41.8523 27.7298 40.6443 26.9486 39.2661 26.3789C37.888 25.8092 36.3993 25.5163 34.8 25.5C33.2177 25.5 31.7375 25.7848 30.3594 26.3545C28.9813 26.9242 27.7733 27.7054 26.7354 28.6982C25.6976 29.6911 24.8809 30.8467 24.2854 32.165C23.6899 33.4834 23.3837 34.9076 23.3667 36.4375C23.3667 37.9512 23.6644 39.3672 24.2599 40.6855C24.8554 42.0039 25.672 43.1595 26.7099 44.1523C27.7477 45.1452 28.9557 45.9264 30.3339 46.4961C31.712 47.0658 33.2007 47.3587 34.8 47.375ZM36.4333 34.875H41.3333V38H33.1667V28.625H36.4333V34.875ZM7.03333 25.5H10.3V28.625H7.03333V25.5ZM13.5667 25.5H16.8333V28.625H13.5667V25.5ZM13.5667 19.25H16.8333V22.375H13.5667V19.25ZM7.03333 31.75H10.3V34.875H7.03333V31.75ZM13.5667 31.75H16.8333V34.875H13.5667V31.75ZM23.3667 22.375H20.1V19.25H23.3667V22.375ZM29.9 22.375H26.6333V19.25H29.9V22.375ZM36.4333 22.375H33.1667V19.25H36.4333V22.375Z"
            fill="#3D5A80"
          />
        </svg>
      }
      link="/appointments"
    />
    <ConfigBox
      title={is_doc ? "Recent patients" : "Fav doctors"}
      description="Configure your settings right here for your account bla djeh euehr"
      icon={
        <svg width="100%" height="100%" viewBox="0 0 52 51" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M26.2582 42.8706L26 43.1431L25.7159 42.8706C13.449 31.1267 5.33999 23.361 5.33999 15.4864C5.33999 10.0368 9.21374 5.94959 14.3787 5.94959C18.3558 5.94959 22.2295 8.67439 23.5983 12.3801H28.4017C29.7704 8.67439 33.6442 5.94959 37.6212 5.94959C42.7862 5.94959 46.66 10.0368 46.66 15.4864C46.66 23.361 38.5509 31.1267 26.2582 42.8706ZM37.6212 0.5C33.1277 0.5 28.8149 2.70708 26 6.16757C23.1851 2.70708 18.8723 0.5 14.3787 0.5C6.42464 0.5 0.174988 7.06676 0.174988 15.4864C0.174988 25.7589 8.95549 34.1785 22.2554 46.9033L26 50.5L29.7446 46.9033C43.0445 34.1785 51.825 25.7589 51.825 15.4864C51.825 7.06676 45.5753 0.5 37.6212 0.5Z"
            fill="#3D5A80"
          />
        </svg>
      }
      link="/favorite"
    />
  </div>
);

export default function MyAccountConfig() {
  const { user, loading } = useUser(); // Use the hook

  if (loading) return <LoadingComponent isLoading={loading}/>; // Show loading component while fetching user data

  return (
    <div className="w-full bg-[#98c1d1]/20 shadow-lg flex-col justify-center items-center gap-16 inline-flex md:px-9 sm:py-24 xs:py-16 xs:px-4">
      {user &&  
        <div className="flex-col justify-center items-center gap-11 flex sm:w-auto xs:w-full">
          <div className="w-full flex-col justify-center items-start gap-2 flex order-first">
            <div className="text-[#293241] text-2xl font-bold font-['Inter']">My account</div>     
            <div className="text-[#293241] text-xl font-normal font-['Inter'] break-all ">{user.email}</div>
          </div>
          <ConfigValues is_doc={user.is_doctor} />        
        </div>
      }
      <LogoutButton />
    </div>
  );
}