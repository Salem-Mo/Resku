import Lottie from 'react-lottie'
import animationData from '@/assets/ChatAnimation.json'
const ChatLoading = () => {
    return (
        <>
            <Lottie
                isClickToPauseDisabled={true}
                options={{
                    animationData: animationData,
                    loop: true,
                    autoplay: true,
                }}
                height={200}
                width={200}
            />

        </>
    )
}

export default ChatLoading