import mongoose, { Schema, Types, ObjectId } from "mongoose";

interface IProperty {
  postalCode: string;
  streetName: string;
  streetNumber: number;
  landlordId: Types.ObjectId;
}

const propertySchema = new Schema<IProperty>({
  postalCode: { type: String, required: true },
  streetName: { type: String, required: true },
  streetNumber: { type: Number, required: true },
  landlordId: { type: Schema.ObjectId, required: true, ref: "Landlord" }
});

export default mongoose.model<IProperty>('Property', propertySchema);