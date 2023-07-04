// Copyright 2023 Soma Notes
import { JSX } from "preact/jsx-runtime";

interface AnchorButtonProps {
  title: string;
  href?: string;
  rounded?: boolean;
  roundedLeft?: boolean;
  roundedRight?: boolean;
  icon?: JSX.Element;
  onClick?: () => void;
  lighter?: boolean;
}

const AnchorButton = (
  {
    rounded,
    href,
    roundedLeft,
    roundedRight,
    icon,
    title,
    onClick,
    lighter,
  }: AnchorButtonProps,
) => {
  return (href || onClick)
    ? (
      <div
        class={icon ? "flex flex-col" : ""}
        style={icon ? "width: 195px" : ""}
      >
        <a
          href={href}
          onClick={onClick}
          class={`
          text-white no-underline py-1 inline-flex items-center
          ${
            lighter
              ? "bg-gray-500 hover:bg-gray-400"
              : "bg-gray-900 hover:bg-gray-700"
          }
          ${roundedLeft ? "rounded-l" : ""}
          ${roundedRight ? "rounded-r" : ""}
          ${rounded ? "rounded" : ""}
          ${!icon ? "px-4" : ""}
          ${onClick ? "cursor-pointer" : ""}
        `}
        >
          {icon && (
            <div class="m-0.5 p-auto">
              {icon}
            </div>
          )}
          <span class={icon ? "ml-1.5" : ""}>{title}</span>
        </a>
      </div>
    )
    : null;
};

export default AnchorButton;
