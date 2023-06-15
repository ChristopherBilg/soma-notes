interface Error500Props {
  error: Error;
}

const Error500 = ({ error }: Error500Props) => {
  return <p>Error 500: Internal server error - {error.message}</p>;
};

export default Error500;
