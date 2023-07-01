import { Request, Response, NextFunction } from "express";
import Review from "../entity/reviewEntity";

const postReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { review, ratings, user, product } = req.body;
    const createdReview = await Review.create({
      review,
      ratings,
      user,
      product,
    });
    res.status(201).json({
      status: "success",
      data: createdReview,
    });
  } catch (err) {
    next(err);
  }
};

export { postReview };
