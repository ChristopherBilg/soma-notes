// Copyright 2023-Present Soma Notes
import { ComponentChild } from "preact";
import { useState } from "preact/hooks";

type TooltipProps = {
  children: ComponentChild;
  text: string;
};

const Tooltip = ({ children, text }: TooltipProps) => {
  const [timer, setTimer] = useState<number | null>(null);
  const [show, setShow] = useState(false);

  const handleMouseEnter = () => {
    setTimer(setTimeout(() => setShow(true), 500));
  };

  const handleMouseLeave = () => {
    if (timer) {
      clearTimeout(timer);
    }
    setShow(false);
  };

  return (
    <div
      class="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        class={`
          absolute bg-gray-500 text-white text-xs rounded-md p-1 m-1 z-10 bottom-full left-1/2 transform -translate-x-1/2 w-max
          ${show ? "block" : "hidden"}
        `}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
