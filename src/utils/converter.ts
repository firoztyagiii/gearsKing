import { Types } from "mongoose";

export const mongoIdToMillis = (id: Types.ObjectId): number =>
  id.getTimestamp().getTime();
