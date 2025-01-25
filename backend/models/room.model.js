import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const roomSchema = new Schema(
    {
        name: { type: String, require: true },
        members: [{ type: mongoose.Schema.ObjectId,ref:"User", require: false }],
        admin: { type: mongoose.Schema.ObjectId,ref:"User", require: true },
        messages:{ type: mongoose.Schema.ObjectId,ref:"MSG", require: false },
        createdAt:{type:Date,default:Date.now()},
        linkedPin:{type: mongoose.Schema.ObjectId,ref:"Pin", require: false },
        updatedAt:{type:Date,default:Date.now()}
        },
)

roomSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

roomSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export const Room = model("Room", roomSchema);
