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

export default AverageRatingStars;