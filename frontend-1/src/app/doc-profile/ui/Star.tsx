const Star = ({ filled, size = 17 }:{filled: boolean, size?: number}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 17" // Keep viewBox to maintain shape proportions
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5,0 L10.6,6.4 L17,6.4 L12.8,10.2 L14.2,16.4 L8.5,12.8 L2.8,16.4 L4.2,10.2 L0,6.4 L6.4,6.4 Z"
        fill={filled ? "#ee6c4d" : "oklch(75% 0.022 261.325)"}
        stroke={filled ? "#ee6c4d" : "oklch(75% 0.022 261.325)"}
      />
    </svg>
  );
};

export default Star;