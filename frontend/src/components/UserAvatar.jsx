import Cookies from 'js-cookie';
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {ServerUrl} from '../utils/constants';


const UserAvatar = (currentUser, type) => {
    const Host = `${ServerUrl}/`;
    const colors = [
        "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
        "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
        "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
        "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]"
    ];
    // const [user, setUser] = useState(currentUser.currentUser);

    // const [userImg, setUserImg] = useState(user.userImage || null);
    // const [selectedColor, setSelectedColor] = useState(user.color);
    const user = currentUser.currentUser;
    const userImg = user.userImage || null;
    const selectedColor = user.color;
    const getColor = (index) => {
        return index !== undefined ? colors[index] : Cookies.get('selectedColor') || colors[0];
    };

    return (
        <Avatar>
            {userImg ? (

                <>
                    <AvatarImage
                        src={Host + userImg} alt={`${user?.name || 'User'}'s avatar`}
                        style={{
                            objectFit: 'contain',
                            backgroundImage: `url(${Host + userImg})`
                        }}
                    // Blur the bg image
                    />
                    <AvatarImage
                        className={`${getColor(selectedColor)}`}
                        src={user.userImg}
                        alt={`${user?.name || 'User'}'s avatar`}
                    />
                </>
            ) : (

                <AvatarFallback className={`${getColor(selectedColor || 0)}`}>
                    {user?.name ? user.name[0] : 'U'}
                </AvatarFallback>
            )
            }
        </Avatar>
    )
}

export default UserAvatar



export const RoomAvatar = () => {
    return (
        <Avatar>
            <AvatarFallback className="bg-[#4a4a4a] text-[#e0e0e0] text-2xl border-[1px] border-[#757575]">
                {'#'}
            </AvatarFallback>
        </Avatar>
    )
}