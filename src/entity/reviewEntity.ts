import ReviewModel from "../model/reviewModel";

const postReview = async (
  rev: IReview.Review
): Promise<IReview.ReviewDocument> => {
  const createdReview = await ReviewModel.create(rev);
  return createdReview;
};

export { postReview };
