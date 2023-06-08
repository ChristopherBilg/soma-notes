export const generateUUID = () => {
  let dt = new Date().getTime();

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (char) => {
      const r = (dt + Math.random() * 16) % 16 | 0;

      dt = Math.floor(dt / 16);

      return (char == "x" ? r : (r & 0x3 | 0x8)).toString(16);
    },
  );
};
