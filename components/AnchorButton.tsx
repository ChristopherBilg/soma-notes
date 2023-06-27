import { JSX } from "preact/jsx-runtime";

interface AnchorButtonProps {
  title: string;
  href?: string;
  rounded?: boolean;
  roundedLeft?: boolean;
  roundedRight?: boolean;
  svgIcon?: JSX.Element;
  onClick?: () => void;
}

const AnchorButton = (
  { rounded, href, roundedLeft, roundedRight, svgIcon, title, onClick }:
    AnchorButtonProps,
) => {
  return (href || onClick)
    ? (
      <div
        class={svgIcon ? "flex flex-col" : ""}
        style={svgIcon ? "width: 195px" : ""}
      >
        <a
          href={href}
          onClick={onClick}
          class={`
          bg-gray-900 hover:bg-gray-700 text-white no-underline py-1 inline-flex items-center
          ${roundedLeft ? "rounded-l" : ""}
          ${roundedRight ? "rounded-r" : ""}
          ${rounded ? "rounded" : ""}
          ${!svgIcon ? "px-4" : ""}
          ${onClick ? "cursor-pointer" : ""}
        `}
        >
          {svgIcon && (
            <div class="m-0.5 p-auto">
              {svgIcon}
            </div>
          )}
          <span class={svgIcon ? "ml-1.5" : ""}>{title}</span>
        </a>
      </div>
    )
    : null;
};

export default AnchorButton;
