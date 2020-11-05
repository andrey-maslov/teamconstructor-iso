import React from 'react';
import {FaFacebookF, FaLinkedinIn, FaVk, FaTelegramPlane, FaTwitter} from "react-icons/fa";
import {
    FacebookShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    TwitterShareButton,
    VKShareButton,
} from "react-share";

const SocialSharing: React.FC = () => {

    const url: string = 'https://salary2.me';

    return (
        <div>
            <div>
                <FacebookShareButton url={url}>
                    <FaFacebookF/>
                </FacebookShareButton>
            </div>
            <div>
                <LinkedinShareButton url={url}>
                    <FaLinkedinIn/>
                </LinkedinShareButton>
            </div>
            <div>
                <TelegramShareButton url={url}>
                    <FaTelegramPlane/>
                </TelegramShareButton>
            </div>
            <div>
                <TwitterShareButton url={url}>
                    <FaTwitter/>
                </TwitterShareButton>
            </div>
            <div>
                <VKShareButton url={url}>
                    <FaVk/>
                </VKShareButton>
            </div>
        </div>
    )
};

export default SocialSharing;