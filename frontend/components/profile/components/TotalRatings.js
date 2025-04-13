// components/profile/TotalRating.js
import Star from "./Star";

const StarBar = ({ star, count, totalReviews }) => {
  // Calculate the width of the bar as a percentage (avoid division by zero)
  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

  return (
    <div className="w-full justify-start items-center gap-4 inline-flex">
      <div className="w-[95%] justify-start items-center gap-4 flex">
        <div className="flex items-center gap-2">
          <span className="w-[60px] text-black text-sm font-['Inter'] tracking-wide">
            {star} star{star !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{backgroundColor: 'oklch(80% 0.022 261.325)'}} className="w-full max-w-xl rounded-[15px] border border-gray-200 overflow-hidden sm:h-3.5 xs:h-3">
          <div
            className="h-full bg-[#ee6c4d]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs font-normal font-['Inter'] tracking-wide text-nowrap">
        {count} reviews
      </div>
    </div>
  );
};

const AverageRatingStars = ({ averageRating }) => {
  // Split averageRating into whole and fractional parts (e.g., 3.7 -> 3 and 0.7)
  const wholeStars = Math.floor(averageRating || 0);
  const fractionalPart = (averageRating || 0) - wholeStars; // e.g., 0.7
  const starPath ="M8.5,0 L10.6,6.4 L17,6.4 L12.8,10.2 L14.2,16.4 L8.5,12.8 L2.8,16.4 L4.2,10.2 L0,6.4 L6.4,6.4 Z"
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starIndex = index + 1;
        let fill = "oklch(75% 0.022 261.325)"; // Default to empty star
        let gradientId = null;

        if (starIndex <= wholeStars) {
          // Full star
          fill = "#ee6c4d";
        } else if (starIndex === wholeStars + 1 && fractionalPart > 0) {
          // Partial star with gradient
          gradientId = `partial-fill-${index}`;
          fill = `url(#${gradientId})`;
        } else {
          // Empty star
          fill = "oklch(75% 0.022 261.325)";
        }

        return (
          <svg
            key={index}
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {gradientId && (
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop
                    offset={`${fractionalPart * 100}%`}
                    style={{ stopColor: "#ee6c4d", stopOpacity: 1 }}
                  />
                  <stop
                    offset={`${fractionalPart * 100}%`}
                    style={{ stopColor: "oklch(75% 0.022 261.325)", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
            )}
            <path d={starPath} fill={fill} stroke={fill} />
          </svg>
        );
      })}
    </div>
  );
};

const TotalRating = ({ averageRating, reviewCount, ratingDistribution }) => {
  return (
    <div className="w-full p-4 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] flex-col justify-start items-start gap-6 inline-flex lg:min-w-[450px] lg:max-w-[450px]">
      <div className="w-full justify-start gap-2 inline-flex flex-col">
        <div>
          <div className="text-3xl text-black xs:text-2xl">Customer reviews.</div>
        </div>
        <div className="justify-start items-center gap-4 flex flex-row">
          <div className="text-black text-lg font-['Inter'] tracking-wide flex gap-2">
            <AverageRatingStars averageRating={averageRating} />
            {averageRating ? averageRating.toFixed(1) : "0.0"} out of 5
          </div>
        </div>
        <div className="text-black font-['Inter'] tracking-wide text-xs">
          ( {reviewCount} {reviewCount === 1 ? "review" : "reviews"} )
        </div>
      </div>
      
      <div className="w-full flex-col justify-start items-start gap-4 flex">
        {[5, 4, 3, 2, 1].map((star) => (
          <StarBar
            key={star}
            star={star}
            count={ratingDistribution[star] || 0}
            totalReviews={reviewCount}
          />
        ))}
      </div>
    </div>
  );
};

export default TotalRating;