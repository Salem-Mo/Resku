import { Pin } from "../models/pin.model.js";

// Post Requests
export const savePin = async (req, res) => {
    const newPin = new Pin(req.body)
    console.log(newPin)
    try {
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    } catch (err) {
        res.status(500).json(err);
    }
}



// Get Requests
export const getPins =async (req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    }catch (err) {
        res.status(500).json(err);
    }
}

// Delete Requests
export const delPin =async (req, res) => {
    try {
        const {selectedPin} = req.body;
        const pin = await Pin.findByIdAndDelete(selectedPin);
        res.status(200).json(pin);
    }catch (err) {
        res.status(500).json(err);
    }
}