import "../styles/reviews.css";
import { FaStar } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

import { useEffect, useState } from "react";

const emoji = (emoji) => {
  const emojiReview = ["😢", "😟", "😐", "🙂", "😎"];
  return emojiReview[emoji - 1] || "😐";
};

// function to calculate the date
const timeSince = (date) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const difference = now - reviewDate;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectReviews, setSelectReviews] = useState("overall");
  const [selectedStarRatings, setSelectedStarRatings] = useState(5);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState(null);
  const [activeAmenity, setActiveAmenity] = useState("overall");

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem("apartmentRatings"));
    if (storedRatings) {
      setReviews(storedRatings);
    }
  }, []);

  // stars function
  const showStars = (rating, clickable = false, onClick = () => {}) => (
    <div className="flex">
      {/* creating a array of 5 stars */}
      {[...Array(5)].map((star, index) => {
        const currentRating = index + 1;
        return (
          <FaStar
            className="star flex"
            key={index}
            size={clickable ? 14 : 18}
            color={currentRating <= rating ? "#FFDE4D" : "black"}
            style={{ cursor: clickable ? "pointer" : "default" }}
            onClick={() => clickable && onClick(currentRating)}
          />
        );
      })}
    </div>
  );

  // function to calculate the total average ratings
  const averageStarRating = () => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) return 1;

    let totalSum = 0;
    let totalCount = 0;

    reviews.forEach((review) => {
      const defaultRating = 1;
      const ratings = [
        review.overallStarRating || defaultRating,
        review.amenitiesRating?.["Fitness Center"] || defaultRating,
        review.amenitiesRating?.["Parking"] || defaultRating,
        review.amenitiesRating?.["Playground"] || defaultRating,
        review.amenitiesRating?.["Spa"] || defaultRating,
        review.amenitiesRating?.["Pools"] || defaultRating,
      ];
      ratings.forEach((rating) => {
        if (rating !== undefined) {
          totalSum += rating;
          totalCount++;
        }
      });
      // console.log(overallStarRating.length);
    });

    return (totalSum / totalCount).toFixed(2);
  };

  // function to calculate each amenity average rating
  const calculateAverageRatings = (reviews) => {
    const amenities = [
      "Fitness Center",
      "Parking",
      "Playground",
      "Spa",
      "Pools",
    ];
    const totals = {
      amenities: {},
    };

    amenities.forEach((amenity) => {
      totals.amenities[amenity] = { sum: 0, count: 0 };
    });

    let overallSum = 0;
    let overallCount = 0;

    reviews.forEach((review) => {
      const defaultRating = 1;
      const overallRating = review.overallStarRating || defaultRating;
      overallSum += overallRating;
      overallCount++;

      // Check if overallStarRating is a valid number
      amenities.forEach((amenity) => {
        const amenityRating = review.amenitiesRating?.[amenity];
        // Check if amenityRating is a valid number
        if (amenityRating !== undefined && !isNaN(amenityRating)) {
          totals.amenities[amenity].sum += amenityRating;
          totals.amenities[amenity].count += 1;
        }
      });
    });

    const averageRatings = {
      overall:
        overallCount > 0 ? (overallSum / overallCount).toFixed(1) : "N/A",
      overallCount,
      amenities: {},
    };

    amenities.forEach((amenity) => {
      const { sum, count } = totals.amenities[amenity];
      averageRatings.amenities[amenity] =
        count > 0 ? (sum / count).toFixed(1) : "N/A";
    });

    // console.log("Average Ratings:", averageRatings);

    return averageRatings;
  };
  const averageRatings = calculateAverageRatings(reviews);

  const handleStarClick = (rating) => {
    setSelectedStarRatings(rating);
  };

  const filterReviews = reviews.filter((review) => {
    console.log(review);
    return true;
  });

  //if button is clicked, then all reviews is displayed, else only 2 is displayed.
  const reviewsToShow = showAllReviews
    ? filterReviews.slice(0, 2)
    : filterReviews;

  const handleAmenityClick = (amenity) => {
    setActiveAmenity(amenity);
    selectReviews(amenity);  
  }

  console.log(activeAmenity);
  return (
    <>
      <section className="relative mt-20 px-10 py-[40px] flex items-center justify-center bg-[#131842]">
        <h2 className="text-[#FBF6E2] text-2xl font-montserrat">Reviews</h2>
      </section>
      <section className="p-[10px] mx-20 mt-4 flex items-start justify-center border-[#80808053] h-[80vh]">
        {/* LEFT SIDE CONTENT */}
        <section className="section-left w-[30vw] mr-4 h-[70vh]">
          {/* OVERALL RATINGS CONTENT */}
          <div className={`p-2 text-white flex-col items-center justify-center bg-[#808080bb] ${activeAmenity === 'overall' ? "active" : ""}`} onClick={() => handleAmenityClick("overall")}>
            {/* <p>Overall Ratings</p> */}
            <button
              onClick={() => setSelectReviews("overall")}
              className="overall-btn text-black text-[20px] font-serif font-bold"
            >
              Overall Ratings
            </button>
            <p className="text-[20px] font-mono text-black font-bold">
              {averageStarRating(reviews)}
            </p>
            {/* {showStars(selectReviews, true)} */}
            <p className="hidden">
              {showStars(selectedStarRatings || 0, false, handleStarClick)}
            </p>
            <p className="text-[15px] font-mono mt-2 text-black font-bold">
              {averageRatings.overallCount} Reviews
            </p>
          </div>

          {/* AMENITIES RATINGS CONTENT */}
          <div className="px-2 pt-3 mt-4 py-2 bg-[#e7e7e7] font-mono">
            {/* Fitness Center */}
            <div className={`mb-4 py-2 flex justify-between items-center px-2 rounded-[5px] amenity-button ${activeAmenity === "Fitness Center" ? "active" : ""}`} onClick={() => handleAmenityClick("Fitness Center")}>
              <p className="flex items-center justify-start text-[20px]">
                <button
                  className="flex"
                  onClick={() => setSelectReviews("Fitness Center")}
                >
                  Fitness Center
                </button>
              </p>
              <p className="text-xl">
                {averageRatings.amenities["Fitness Center"]}
              </p>
            </div>

            {/* Parking */}
            <div className={`mb-4 py-2 flex justify-between items-center px-2 rounded-[5px] amenity-button ${activeAmenity === "Parking" ? "active" : ""}`} onClick={() => handleAmenityClick("Parking")}>
              <p className="flex items-center justify-start text-[20px]">
                {/* <FaParking className="text-[gray] text-[30px] mr-10" /> */}
                <button onClick={() => setSelectReviews("Parking")}>
                  Parking Garage
                </button>
              </p>
              <p className="text-xl">{averageRatings.amenities["Parking"]}</p>
            </div>

            {/* Playground */}
            <div className={`mb-4 py-2 flex justify-between items-center px-2 rounded-[5px] amenity-button ${activeAmenity === "Playground" ? "active" : ""}`} onClick={() => handleAmenityClick("Playground")}>
              <p className="flex items-center justify-start text-[20px]">
                {/* <MdSportsFootball className="text-[gray] text-[30px] mr-10" /> */}
                <button onClick={() => setSelectReviews("Playground")}>
                  Playground
                </button>
              </p>
              <p className="text-xl">
                {averageRatings.amenities["Playground"]}
              </p>
            </div>

            {/* Spa */}
            <div className={`mb-4 py-2 flex justify-between items-center px-2 rounded-[5px] amenity-button ${activeAmenity === "Spa" ? "active" : ""}`} onClick={() => handleAmenityClick("Spa")}>
              <p className="flex items-center justify-start text-[20px]">
                {/* <FaPerson className="text-[gray] text-[30px] mr-10" /> */}
                <button onClick={() => setSelectReviews("Spa")}>Spa</button>
              </p>
              <p className="text-xl">{averageRatings.amenities["Spa"]}</p>
            </div>

            {/* Swimming Pool */}
            <div className={`mb-4 py-2 flex justify-between items-center px-2 rounded-[5px] amenity-button ${activeAmenity === "Pools" ? "active" : ""}`} onClick={() => handleAmenityClick("Pools")}>
              <p className="flex items-center justify-start text-[20px]">
                {/* <MdOutlinePool className="text-[gray] text-[30px] mr-10" /> */}
                <button onClick={() => setSelectReviews("Pools")}>
                  Swimming Pool
                </button>
              </p>
              <p className="text-xl">{averageRatings.amenities["Pools"]}</p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE CONTENT */}
        <section className="section-right p-2 max-h-[75vh] w-full overflow-y-scroll bg-[#eeededc5]">
          <section className="overall-reviews flex flex-wrap justify-between">
            {selectReviews !== "overall" && (
              <div className="flex items-center justify-center">
                <p className="text-[20px] font-bold mr-4">
                  {selectReviews} Ratings
                </p>
                <p className="text-[20px] font-bold">
                  {averageRatings.amenities[selectReviews]}&nbsp;⭐
                </p>
                
                {/* setShowAllReviews "THIS IS USELESS BUTTON" */}
                <button className="hidden" onClick={() => setShowAllReviews(true)}>SHOW ALL REVIEWS</button>
              </div>
            )}
            {reviewsToShow.map((review, index) => (
              <div
                key={index}
                className="w-full p-2 rounded-xl mb-2 review-item border-2 border-transparent"
              >
                <div className="flex flex-col">
                  <h3 className="flex items-center text-lg capitalize font-semibold">
                    <CgProfile className="text-[gray] text-[29px] mr-1" />
                    {review.name}
                  </h3>
                  {selectReviews === "overall" && (
                    <>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <p className="mr-6">
                            {showStars(review.overallStarRating)}
                          </p>
                          <p>{timeSince(review.date)}</p>
                        </div>
                        <button
                          className="view-more-btn text-black text-serif font-bold capitalize"
                          onClick={() => {
                            setShowPopup(true);
                            setSelectedReviews(review); // Set the selected review
                          }}
                        >
                          view more
                        </button>
                      </div>
                      <p className="text-md font-mono capitalize mt-2">
                        {review.overallRating}
                      </p>
                      <div className="flex w-full mt-4 justify-between">
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Fitness</p>
                          <p className="mr-1">
                            {review.amenitiesRating["Fitness Center"].toFixed(
                              1
                            )}
                          </p>
                          <p>
                            {emoji(review.amenitiesRating["Fitness Center"])}
                          </p>
                        </div>
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Parking</p>
                          <p className="mr-1">
                            {review.amenitiesRating["Parking"].toFixed(1)}
                          </p>
                          <p>{emoji(review.amenitiesRating["Parking"])}</p>
                        </div>
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Playground</p>
                          <p className="mr-1">
                            {review.amenitiesRating["Playground"]}.0
                          </p>
                          <p>{emoji(review.amenitiesRating["Playground"])}</p>
                        </div>
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Spa</p>
                          <p className="mr-1">
                            {review.amenitiesRating["Spa"].toFixed(1)}
                          </p>
                          <p>{emoji(review.amenitiesRating["Spa"])}</p>
                        </div>
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Pools</p>
                          <p className="mr-1">
                            {review.amenitiesRating["Pools"]}.0
                          </p>
                          <p>{emoji(review.amenitiesRating["Pools"])}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {selectReviews !== "overall" && (
                  <>
                    <div className="mt-1 flex items-center">
                      <p className="mr-2">
                        {showStars(review.amenitiesRating[selectReviews])}
                      </p>
                      <p>{timeSince(review.date)}</p>
                    </div>
                    <p className="text-md capitalize mt-2 font-mono">
                      {review.amenitiesOpinion[selectReviews]}
                    </p>
                  </>
                )}
              </div>
            ))}
            {showPopup && selectedReviews && (
              <div className="popup-box w-full h-[100vh] absolute left-0 right-0 top-[132vh] ml-auto mr-auto bg-[#808080a1] p-[50px] flex justify-center items-center">
                <div className="popup-modal-inside w-full h-[70vh] p-4 bg-[#e8e7e7] overflow-y-scroll m-20 transition-all border-2">
                  <h3 className="flex items-center text-lg capitalize font-semibold">
                    <CgProfile className="text-[gray] text-[29px] mr-1" />
                    {selectedReviews.name}
                  </h3>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-[140px] right-[160px] border-2 px-2 font-bold bg-white"
                  >
                    X
                  </button>
                  <h3>{selectedReviews.username}</h3>
                  <p>{selectedReviews.review}</p>
                  <div>
                    <div>
                      <div className="flex items-center mt-1">
                        <p className="mr-2">
                          {showStars(selectedReviews.overallStarRating)}
                        </p>
                        <p>{timeSince(selectedReviews.date)}</p>
                      </div>
                      <p className="text-md font-mono capitalize mt-2">
                        {selectedReviews.overallRating}
                      </p>
                    </div>
                    {/* fitness center */}
                    <div className="mt-2 mb-2">
                      <div className="flex items-center">
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Fitness Center</p>
                          <p>
                            {emoji(
                              selectedReviews.amenitiesRating["Fitness Center"]
                            )}
                          </p>
                        </div>
                        <div className="ml-3">
                          {showStars(
                            selectedReviews.amenitiesRating?.["Fitness Center"]
                          )}
                        </div>
                      </div>
                      <p className="font-mono capitalize mt-2">
                        {selectedReviews.amenitiesOpinion?.["Fitness Center"]}
                      </p>
                    </div>
                    {/* parking */}
                    <div className="mt-2 mb-2">
                      <div className="flex items-center">
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Parking</p>
                          <p>
                            {emoji(
                              selectedReviews.amenitiesRating["Parking"]
                            )}
                          </p>
                        </div>
                        <div className="ml-3">
                          {showStars(
                            selectedReviews.amenitiesRating?.["Parking"]
                          )}
                        </div>
                      </div>
                      <p className="font-mono capitalize mt-2">
                        {selectedReviews.amenitiesOpinion?.["Parking"]}
                      </p>
                    </div>
                    {/* Playground */}
                    <div className="mt-2 mb-2">
                      <div className="flex items-center">
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Playground</p>
                          <p>
                            {emoji(
                              selectedReviews.amenitiesRating["Playground"]
                            )}
                          </p>
                        </div>
                        <div className="ml-3">
                          {showStars(
                            selectedReviews.amenitiesRating?.["Playground"]
                          )}
                        </div>
                      </div>
                      <p className="font-mono capitalize mt-2">
                        {selectedReviews.amenitiesOpinion?.["Playground"]}
                      </p>
                    </div>
                    
                    {/* spa */}
                    <div className="mt-2 mb-2">
                      <div className="flex items-center">
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Spa</p>
                          <p>
                            {emoji(
                              selectedReviews.amenitiesRating["Spa"]
                            )}
                          </p>
                        </div>
                        <div className="ml-3">
                          {showStars(
                            selectedReviews.amenitiesRating?.["Spa"]
                          )}
                        </div>
                      </div>
                      <p className="font-mono capitalize mt-2">
                        {selectedReviews.amenitiesOpinion?.["Spa"]}
                      </p>
                    </div>

                    {/* pools */}
                    <div className="mt-2 mb-2">
                      <div className="flex items-center">
                        <div className="flex p-2 rounded-[40px] bg-[#d3d3d3] font-bold">
                          <p className="mr-1">Pools</p>
                          <p>
                            {emoji(
                              selectedReviews.amenitiesRating["Pools"]
                            )}
                          </p>
                        </div>
                        <div className="ml-3">
                          {showStars(
                            selectedReviews.amenitiesRating?.["Pools"]
                          )}
                        </div>
                      </div>
                      <p className="font-mono capitalize mt-2">
                        {selectedReviews.amenitiesOpinion?.["Pools"]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>
      </section>
    </>
  );
};

export default Reviews;