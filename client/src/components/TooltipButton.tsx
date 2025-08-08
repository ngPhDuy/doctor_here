import React, { ReactNode } from "react";

interface TooltipButtonProps {
  text: string;
  children: ReactNode;
  className?: string;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  text,
  children,
  className = "",
}) => {
  return (
    <div className={`relative group inline-block ${className}`}>
      {children}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 hidden group-hover:block bg-gray-800 text-white text-xs whitespace-nowrap rounded py-1 px-2 shadow-lg">
        {text}
      </div>
    </div>
  );
};

export default TooltipButton;
