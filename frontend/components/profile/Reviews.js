import Star from "./components/Star";
import TotalRating from "./components/TotalRatings";
import LeaveAReview from "./components/LeaveAReview";

const Review = ({ review }) => {
  const { user, rating, headline, body, created_at } = review;
  const formattedDate = new Date(created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const stars = Array(5).fill(false).map((_, index) => index < rating);

  return (
    <div className="w-full flex-col justify-start items-start gap-2 flex">
      <div className="justify-start items-start gap-1 inline-flex sm:flex-row xs:flex-col">
        <div className="flex gap-2 items-center">
        {stars.map((filled, index) => (<div key={index}><Star filled={filled} /></div>))}
          <div data-svg-wrapper>
          <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 0C1.46957 0 0.96086 0.210714 0.585787 0.585787C0.210714 0.96086 0 1.46957 0 2C0 2.53043 0.210714 3.03914 0.585787 3.41421C0.96086 3.78929 1.46957 4 2 4C3.11 4 4 3.11 4 2C4 1.46957 3.78929 0.96086 3.41421 0.585787C3.03914 0.210714 2.53043 0 2 0Z"
              fill="gray"
            />
          </svg>
        </div>
          <div className="text-black/50 font-['Inter'] tracking-wide text-xs">
            {user.first_name} {user.last_name}
          </div>          
        </div>
      </div>
      <div className="w-full break-words whitespace-pre-wrap text-[#293241] font-['Inter'] font-semibold tracking-wide xs:text-base">
          {headline}
      </div>
      <div className="w-full break-words whitespace-pre-wrap text-[#3d5a80] font-['Inter'] tracking-wide text-sm">
        {body}
      </div>
      <div className="justify-start items-center gap-2 inline-flex">
        <div className="text-center text-black/50 font-extralight font-['Inter'] tracking-wide text-xs">
          {formattedDate}
        </div>
      </div>
    </div>
  );
};

export default function Reviews({
  reviews,
  totalReviews,
  currentPage,
  totalPages,
  loadMoreReviews,
  averageRating,
  reviewCount,
  ratingDistribution,
}) {
  const reviewsToShow = reviews.length;
  const canLoadMore = currentPage < totalPages;

  return (
    <div className="flex-col justify-center items-center gap-12 flex">
      <div className="w-full justify-start items-center gap-2.5 inline-flex border-b border-black/50 mt-16">
        <div className="text-center text-[#293241] font-['Inter'] tracking-wide text-2xl">
          Reviews
        </div>
        <div data-svg-wrapper className="relative">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12.975L13.9 14.125C14.0833 14.2417 14.2667 14.2377 14.45 14.113C14.6333 13.9883 14.7 13.8173 14.65 13.6L14.15 11.425L15.85 9.95C16.0167 9.8 16.0667 9.621 16 9.413C15.9333 9.205 15.7833 9.09233 15.55 9.075L13.325 8.9L12.45 6.85C12.3667 6.65 12.2167 6.55 12 6.55C11.7833 6.55 11.6333 6.65 11.55 6.85L10.675 8.9L8.45 9.075C8.21667 9.09167 8.06667 9.20433 8 9.413C7.93333 9.62167 7.98333 9.80067 8.15 9.95L9.85 11.425L9.35 13.6C9.3 13.8167 9.36667 13.9877 9.55 14.113C9.73334 14.2383 9.91667 14.2423 10.1 14.125L12 12.975ZM6 18.5L3.7 20.8C3.38334 21.1167 3.02067 21.1877 2.612 21.013C2.20333 20.8383 1.99933 20.5257 2 20.075V4.5C2 3.95 2.196 3.47933 2.588 3.088C2.98 2.69667 3.45067 2.50067 4 2.5H20C20.55 2.5 21.021 2.696 21.413 3.088C21.805 3.48 22.0007 3.95067 22 4.5V16.5C22 17.05 21.8043 17.521 21.413 17.913C21.0217 18.305 20.5507 18.5007 20 18.5H6ZM5.15 16.5H20V4.5H4V17.625L5.15 16.5Z"
              fill="#293241"
            />
          </svg>
        </div>
      </div>
      <div className="w-full px-1 items-center mb-8 gap-12 inline-flex lg:justify-start sm:px-2 flex-wrap xs:justify-center">
        <TotalRating
          averageRating={averageRating}
          reviewCount={reviewCount}
          ratingDistribution={ratingDistribution}
        />
        <LeaveAReview />
      </div>
      <div className="w-full px-2 flex-col justify-start items-start gap-10 flex">
        <div className="w-full flex-col justify-start items-start gap-6 flex">
          {reviews.map((review) => (
            <Review key={review.id} review={review} />
          ))}          
        </div>
        <div className="text-[#293241] font-['Inter'] tracking-wide flex flex-col gap-2 sm:text-sm xs:text-xs">
          Showing {reviewsToShow} of {totalReviews} reviews
          {canLoadMore && (
            <button
              onClick={loadMoreReviews}
              className="px-2.5 py-1 bg-[#ee6c4d] rounded-[5px] border border-[#ee6c4d] justify-center items-center gap-2.5 inline-flex text-center text-white font-['Inter'] tracking-wide sm:text-lg xs:text-md"
            >
              Load More
            </button>
          )}
        </div>

      </div>
    </div>
  );
}