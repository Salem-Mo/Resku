import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
    {   
        userName: { type: String, require: true },
        userEmail: { type: String, require: true },
        title: { type: String, require: true },
        description: { type: String, require: true },
        type: { type: String},
        dangerRate: { type: Number, require: true, min: 0, max: 5 },
        lat:{type: Number, require: true},
        long:{type: Number, require: true},
        linkedRoom:{type: mongoose.Schema.ObjectId,ref:"Room", require: false },
        
        
    },
    { timestamps: true }
);

export const Pin = mongoose.model("Pin", pinSchema);
