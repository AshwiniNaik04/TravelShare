const Map = props => {

  const address = props.address;

  return (
    <iframe
      width="100%"
      height="300"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`}
    ></iframe>
  );
};

export default Map;