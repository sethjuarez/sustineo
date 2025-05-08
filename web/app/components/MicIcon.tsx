import { type SVGProps } from 'react';

interface IMicIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function MicIcon({ className, ...props }: IMicIconProps) {
  return (
    <svg
      width="142"
      height="142"
      viewBox="0 0 142 142"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M121 71C121 43.3858 98.6142 21 71 21C43.3858 21 21 43.3858 21 71C21 98.6142 43.3858 121 71 121C98.6142 121 121 98.6142 121 71Z"
        fill="white"
      />
      <path
        d="M84.2393 70.6652C85.1913 70.6653 85.9627 71.4146 85.9629 72.339C85.9629 80.0941 79.929 86.4814 72.1709 87.3146L72.1699 90.754C72.1699 91.6785 71.3983 92.4287 70.4463 92.4289C69.5537 92.4289 68.8189 91.77 68.7305 90.9259L68.7217 90.754L68.7227 87.3146C60.9639 86.482 54.9287 80.0945 54.9287 72.339C54.9289 71.4147 55.7004 70.6654 56.6523 70.6652C57.6045 70.6652 58.3768 71.4146 58.377 72.339C58.377 78.8111 63.7808 84.0578 70.4463 84.0578C77.1116 84.0576 82.5146 78.811 82.5146 72.339C82.5148 71.4146 83.2871 70.6652 84.2393 70.6652ZM70.4463 49.5714C74.6359 49.5716 78.0322 52.8696 78.0322 56.9376V71.6701C78.032 75.738 74.6358 79.0352 70.4463 79.0353C66.2567 79.0353 62.8596 75.738 62.8594 71.6701V56.9376C62.8594 52.8695 66.2565 49.5714 70.4463 49.5714Z"
        fill="black"
      />
      <circle
        cx="71"
        cy="71"
        r="61"
        stroke="url(#paint0_linear_1_3)"
        strokeWidth="20"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_3"
          x1="30.104"
          y1="10.792"
          x2="117.008"
          y2="133.48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FBD1E1" />
          <stop offset="0.483011" stopColor="#E2ECE7" />
          <stop offset="1" stopColor="#3B61C0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
