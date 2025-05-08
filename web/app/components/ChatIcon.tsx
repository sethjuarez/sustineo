import { type SVGProps } from 'react';

interface IMicIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function MicIcon({ className, ...props }: IMicIconProps) {
  return (
    <svg
      width="206"
      height="206"
      viewBox="0 0 206 206"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g opacity="0.2">
        <path
          d="M103 7.70898C155.628 7.70898 198.291 50.372 198.291 103C198.291 155.628 155.628 198.291 103 198.291C50.372 198.291 7.70898 155.628 7.70898 103C7.70898 50.372 50.372 7.70898 103 7.70898Z"
          stroke="#192D21"
          strokeWidth="14.5829"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M191 103C191 54.6767 151.323 15 103 15C54.6767 15 15 54.6767 15 103C15 151.323 54.6767 191 103 191C151.323 191 191 151.323 191 103Z"
        fill="white"
      />
      <path d="M54,2H6C2.748,2,0,4.748,0,8v33c0,3.252,2.748,6,6,6h28.558l9.702,10.673C44.453,57.885,44.724,58,45,58
	c0.121,0,0.243-0.022,0.36-0.067C45.746,57.784,46,57.413,46,57V47h8c3.252,0,6-2.748,6-6V8C60,4.748,57.252,2,54,2z M12,15h15
	c0.553,0,1,0.448,1,1s-0.447,1-1,1H12c-0.553,0-1-0.448-1-1S11.447,15,12,15z M46,33H12c-0.553,0-1-0.448-1-1s0.447-1,1-1h34
	c0.553,0,1,0.448,1,1S46.553,33,46,33z M46,25H12c-0.553,0-1-0.448-1-1s0.447-1,1-1h34c0.553,0,1,0.448,1,1S46.553,25,46,25z"
        fill="black" />
    </svg>
  );
}
