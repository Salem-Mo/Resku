import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Room } from '../models/room.model.js';

export const createRoom = async (req, res, next) => {
    try {
        const { name, members, userID } = req.body;
        const admin = await User.findById(userID);
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Admin not found' });
        }
        const memberIds = members.map((member) => {
            if (!mongoose.Types.ObjectId.isValid(member)) {
                throw new Error(`Invalid ObjectId: ${member}`);
            }
            return new mongoose.Types.ObjectId(member);
        });
        
        // const validMembers = await User.find({ _id: { $in: memberIds } });
        // if (validMembers.length !== members.length) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Some members are invalid or do not exist',
        //     });
        // }
        const newRoom = await Room.create({
            name,
            members: memberIds,
            admin: userID,
        });
        return res.status(201).json({
            success: true,
            message: 'Room created successfully',
            room: newRoom,
        });
    } catch (error) {
        console.error('Error in createRoom', error);
        return res.status(400).json({ success: false, message: error.message });
    }
};
export const getUserRooms = async (req, res, next) => {
    try {

    const userId = new mongoose.Types.ObjectId(req.userId);
        const rooms = await Room.find(
        {$or: 
            [
                {admin: userId }, 
                { members: userId }]
        }).sort({ updatedAt: -1 });
        console.log(rooms)
        return res.status(201).json({ success: true, rooms });
    }catch (error) {
        console.error('Error in getUserRooms', error);
        return res.status(400).json({ success: false, message: error.message });
    }
};