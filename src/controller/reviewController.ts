import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Review from "../entity/reviewEntity";
import AppError from "../utils/AppError";

const postReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { review, ratings, product } = req.body;
    const createdReview = await Review.create({
      review,
      ratings,
      user: res.locals.user._id,
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

const getReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne(new mongoose.Types.ObjectId(id));
    if (!review) return next(new AppError("No review found", 400));
    res.status(200).json({
      status: "success",
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

const patchReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { review, ratings } = req.body;
    const reviewDoc = await Review.findOne(new mongoose.Types.ObjectId(id));
    if (!reviewDoc) {
      return next(new AppError("No review found", 400));
    }
    if (reviewDoc.user.toString() !== res.locals.user._id.toString()) {
      return next(
        new AppError("Current user does not belong to the review", 400)
      );
    }
    const updatedReview = await Review.update(new mongoose.Types.ObjectId(id), {
      review,
      ratings,
    });
    res.status(201).json({
      status: "success",
      data: updatedReview,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne(new mongoose.Types.ObjectId(id));
    if (!review) {
      return next(new AppError("No review found", 400));
    }
    if (review.user.toString() !== res.locals.user._id.toString()) {
      return next(
        new AppError("You are not allowed to delete this review", 401)
      );
    }
    await Review.delete(new mongoose.Types.ObjectId(id));
    res.status(202).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export { postReview, getReview, patchReview, deleteReview };
