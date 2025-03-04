import ActiveDates from "@/components/mydates/ActiveDates";
import UnactiveDates from "@/components/mydates/UnactiveDates";
export default function MyDates() {
  return (
    <div class="w-full px-2 py-4 flex-col justify-start items-center gap-20 inline-flex
    sm:p-4">
      <div className="w-full max-w-4xl flex-col justify-start items-start gap-10 flex">
        <ActiveDates/>
        <UnactiveDates/>        
      </div>

  </div>
  );
}