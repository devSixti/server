import { Califications } from '../types/Califications.type';
import { Schema, model } from 'mongoose';

const calificationsSchema = new Schema({
  trip_id: {
    type: Schema.Types.ObjectId,
    ref: 'Trips',
    required: true
  },
  from_user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  to_user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
},
  { timestamps: true }
);

export const CalificationsModel = model<Califications>('Califications', calificationsSchema);
