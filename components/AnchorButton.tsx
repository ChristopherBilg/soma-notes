// Copyright 2023-Present Soma Notes
import { JSX } from "preact/jsx-runtime";

type AnchorButtonProps = {
  title: string;
  href?: string;
  rounded?: boolean;
  roundedLeft?: boolean;
  roundedRight?: boolean;
  svgIcon?: JSX.Element;
  onClick?: (e: MouseEvent) => void;
  variant?: "danger" | "success" | "primary";
  minimal?: boolean;
  lighter?: boolean;
  monospaced?: boolean;
};

const AnchorButton = (
  {
    rounded,
    href,
    roundedLeft,
    roundedRight,
    svgIcon,
    title,
    onClick,
    variant,
    minimal,
    lighter,
    monospaced,
  }: AnchorButtonProps,
) => {
  return (href || onClick)
    ? (
      <div
        class={`
          select-none
          ${svgIcon ? "flex flex-col w-48" : ""}
        `}
      >
        <a
          href={href}
          onClick={onClick}
          class={`
            no-underline inline-flex items-center py-1
            ${variant === "danger" ? "bg-red-500 hover:bg-red-400" : ""}
            ${variant === "success" ? "bg-green-500 hover:bg-green-400" : ""}
            ${variant === "primary" ? "bg-blue-500 hover:bg-blue-400" : ""}
            ${
            lighter
              ? "bg-gray-200 hover:bg-gray-300 text-gray-600"
              : "text-white"
          }
            ${(!lighter && !variant) ? "bg-gray-900 hover:bg-gray-700" : ""}
            ${roundedLeft ? "rounded-l" : ""}
            ${roundedRight ? "rounded-r" : ""}
            ${rounded ? "rounded" : ""}
            ${onClick ? "cursor-pointer" : ""}
            ${(!svgIcon && minimal) ? "px-1" : ""}
            ${(!svgIcon && !minimal) ? "px-4" : ""}
            ${monospaced ? "font-mono" : ""}
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
