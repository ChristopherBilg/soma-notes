// Copyright 2023-Present Soma Notes
import { useContext } from "preact/hooks";
import { Toast } from "../signal/ui.ts";
import { UIContext } from "./context/CommonContext.tsx";

const Toasts = () => {
  const { toasts, removeToast } = useContext(UIContext);

  const handleCallback = (toast: Toast) => () => {
    if (toast.callback) toast.callback();
    removeToast(toast.uuid);
  };

  return (
    <div class="fixed bottom-0 left-0 right-0 flex flex-col items-center">
      {toasts.value.map((toast) => (
        <div class="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-2 m-2 flex justify-between items-center">
          {toast.callback && (
            <button onClick={handleCallback(toast)}>&#9989;</button>
          )}

          <p class="text-lg font-semibold text-gray-800 mx-2">
            {toast.message}
          </p>

          <button onClick={() => removeToast(toast.uuid)}>&#10060;</button>
        </div>
      ))}
    </div>
  );
};

export default Toasts;
