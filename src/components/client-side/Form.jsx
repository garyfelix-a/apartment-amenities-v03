import "../styles/form.css";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";
import { IoIosCloseCircleOutline } from "react-icons/io";

//array of amenities for the form
const amenities = ["Fitness Center", "Parking", "Playground", "Spa", "Pools"];

//child component for star rating system. It takes rating, setRating, hover, and setHover as props
const StarRating = ({ rating, setRating, hover, setHover, onRate }) => (
  <div className="flex">
    {/* creating a array of 5 stars */}
    {[...Array(5)].map((star, index) => {
      const currentRating = index + 1;
      return (
        <label key={index} className="text-[#c0c0c0]">
          <input
            type="radio"
            value={index}
            className="radio"
            onClick={() => {
              setRating(currentRating);
              onRate();
            }}
            required={true}
          />
          <FaStar
            className="star"
            size={18}
            color={
              currentRating === 1 ||
              (currentRating <= (hover || rating) && currentRating > 1)
                ? "black"
                : "#c0c0c0"
            }
            onMouseEnter={() => setHover(currentRating)}
            onMouseLeave={() => setHover(null)}
          />
        </label>
      );
    })}
  </div>
);

//validation for props - defining its type and mentioning required or not
StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  hover: PropTypes.number,
  setHover: PropTypes.func.isRequired,
  onRate: PropTypes.func.isRequired,
};

//parent funtion contains reviews form
const Form = () => {
  //useState hooks for ratings, hover, opinions, popup, current amenity, new opinion, edit option
  const [currentName, setCurrentName] = useState("");
  const [ratings, setRatings] = useState({});
  const [overallRating, setOverallRating] = useState("");
  const [overallStarRating, setOverallStarRating] = useState(1);
  const [overallHover, setOverallHover] = useState("");
  const [hoverState, setHoverState] = useState({});
  const [opinions, setOpinions] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [currentAmenity, setCurrentAmenity] = useState("");
  const [newOpinion, setNewOpinion] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [apartmentRatings, setApartmentRatings] = useState([]);
  const [showAddBtn, setShowAddBtn] = useState({});

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem("apartmentRatings"));
    if (storedRatings) {
      setApartmentRatings(storedRatings);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const allRated = amenities.every((amenity) => ratings[amenity]);
    if (!allRated) {
      alert("Please fill out all ratings before submission.");
      return;
    }

    let newData = {
      name: currentName,
      overallRating,
      overallStarRating,
      amenitiesRating: ratings,
      amenitiesOpinion: opinions,
      date: new Date().toISOString(),
    };

    const updatedRatings = [...apartmentRatings, newData];
    setApartmentRatings(updatedRatings);
    localStorage.setItem("apartmentRatings", JSON.stringify(updatedRatings));

    console.log("apartment data: " + apartmentRatings);
    setCurrentName("");
    setOverallStarRating("");
    setOverallRating("");
    setOverallHover("");
    setRatings({});
    setOpinions({});
    setHoverState({});
    setShowAddBtn({});
  };

  const handleAddOpinion = (amenity) => {
    setCurrentAmenity(amenity);
    setShowPopup(true);
    setIsEditable(false);
  };

  const handleEditOpinion = (amenity) => {
    setCurrentAmenity(amenity);
    setNewOpinion(opinions[amenity]);
    setShowPopup(true);
    setIsEditable(true);
  };

  const handleSaveOpinion = () => {
    setOpinions({ ...opinions, [currentAmenity]: newOpinion });
    setShowPopup(false);
    setNewOpinion("");
    setIsEditable(false);
  };

  const handleStarRating = (amenity) => {
    setShowAddBtn({ ...showAddBtn, [amenity]: true });
  };

  return (
    <section className="reviews">
      <h2 className="bg-[#131842] w-full text-center p-10 text-xl">
        Feel Free To Share Your Experience
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex border-2 border-black h-auto max-lg:w-[90vw] max-lg:p-4"
      >
        <div className="form w-full pr-4 max-lg:w-full max-xl:w-full pb-2">
          <div className="overall-rating">
            <h2 className="text-black font-bold text-2xl font-mono capitalize">
              Give your ratings
            </h2>
            <div className="complete-rating flex items-center">
              <p className="font-mono text-[gray] capitalize">Ratings</p>
              <StarRating
                rating={overallStarRating}
                setRating={setOverallStarRating}
                hover={overallHover}
                setHover={setOverallHover}
              />
            </div>
            <div className="overall-rating-input mt-3 flex-col">
              <input
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setCurrentName(e.target.value)}
                value={currentName}
                className="w-[40%] font-mono border-2 border-black mb-2 rounded-[5px] p-2"
              />
              <p className="font-mono text-[gray]">Write a feedback</p>
              <textarea
                className="overall-rating-text border-2 w-[40%] border-black pl-2 pt-2 pb-4 rounded-[5px] max-lg:w-full font-mono"
                placeholder="Please Share Your Experience"
                value={overallRating}
                onChange={(e) => setOverallRating(e.target.value)}
              />
            </div>
          </div>

          {/* amenities ratings area */}
          <div className="amenities max-lg:w-full">
            <h4 className="text-black font-bold font-mono text-[22px]">
              Amenities
            </h4>
            {amenities.map((amenity) => (
              <div key={amenity} className="amenity w-full mb-4">
                <div className="each-amenity flex justify-between items-center mb-2">
                  <label className="font-mono font-extralight text-[gray] max-lg:text-[18px]">
                    {amenity}
                  </label>
                  <StarRating
                    rating={ratings[amenity]}
                    setRating={(rating) =>
                      setRatings({ ...ratings, [amenity]: rating })
                    }
                    hover={hoverState[amenity] || 0}
                    setHover={(hover) => {
                      setHoverState({ ...hoverState, [amenity]: hover });
                    }}
                    onRate={() => handleStarRating(amenity)}
                  />
                  {showAddBtn[amenity] &&
                    (opinions[amenity] ? (
                      <>
                        <div className="popup-result ml-4 flex items-center justify-between w-full">
                          <span className="edit-text border-2 p-3 mr-2 rounded-[5px] text-[18px] capitalize max-lg:w-[80%] max-lg:max-h-[100px] w-full">
                            {opinions[amenity]}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEditOpinion(amenity)}
                            className="edit-btn border-2 border-[gray] font-palanquin font-extralight hover:text-black max-lg:text-[18px] p-2 rounded-[7px] text-[#219419] hover:bg-[#dcffdc]"
                          >
                            Edit Opinion
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddOpinion(amenity)}
                        className="add-btn ml-4 w-[40vw] border-2 border-[gray] font-palanquin font-extralight hover:text-black max-lg:text-[20px] p-2 rounded-[7px] text-[#219419] hover:bg-[#dcffdc]"
                      >
                        Add Opinion
                      </button>
                    ))}
                </div>

                {/* Add New Opinion Section */}
                {/*  */}
                {/*  */}
              </div>
            ))}
          </div>

          {/* Form Submit Button */}
          <div className="btn-submit">
            <button type="submit" className="font-mono">
              Submit
            </button>
          </div>
        </div>
      </form>
      {showPopup && (
        <div className="popup border-2 flex justify-center items-center flex-col absolute bg-[#8080809d] w-full h-full top-0 left-0 bottom-0 ml-auto mr-auto max-lg:px-2">
          <div className="popup-modal flex justify-center items-center border-2 px-2 py-10 bg-white max-lg:h-[50vh] max-lg:w-full max-lg:mx-2 rounded-[]">
            <div className="max-lg:w-full max-lg:flex-col justify-between items-center max-lg:p-10 ">
              <IoIosCloseCircleOutline
                className="close-icon max-lg:absolute max-lg:top-[10px] max-lg:right-[20px] max-lg:h-[55vh] text-[30px] cursor-pointer"
                onClick={() => setShowPopup(false)}
              />
              <label className="text-[24px]">
                Few Words About {currentAmenity}:
              </label>
              <textarea
                value={newOpinion}
                onChange={(e) => setNewOpinion(e.target.value)}
                placeholder="Enter your opinion..."
                className="border-2 border-black mt-2 px-2 py-4 mr-2 rounded-[10px] w-full capitalize"
              />
              <button
                type="button"
                onClick={handleSaveOpinion}
                className="border-2 border-black text-[18px] py-2 px-6 mt-2 rounded-[5px] hover:bg-[#94ff94]"
              >
                {isEditable ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Form;
