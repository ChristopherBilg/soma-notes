// Copyright 2023-Present Soma Notes

type NetworkRequestLoadingIconProps = {
  hidden: boolean;
};

const NetworkRequestLoadingIcon = (
  { hidden }: NetworkRequestLoadingIconProps,
) => {
  return hidden ? null : (
    <div class="absolute top-4 right-4
        flex items-center justify-center
        w-10 h-10
        bg-gray-100 rounded-full
        border-2 border-gray-300
        animate-spin">
      <div class="w-4 h-4 bg-gray-300 rounded-full"></div>
    </div>
  );
};

export default NetworkRequestLoadingIcon;
