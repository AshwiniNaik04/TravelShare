import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (!props.items || props.items.length === 0) {
    return <h2 className="center">No places found.</h2>;
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          location={place.location}
          creatorId={place.creator}
          likes={place.likes}
          onDelete={props.onDeletePlace}

        />
      ))}
    </ul>
  );
};

export default PlaceList;