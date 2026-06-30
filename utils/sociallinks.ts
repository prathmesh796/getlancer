import { FaTwitter, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

export const getSocialIcon = (link: string) => {
    const iconProps = { size: 20, className: "" };
    if (link.toLowerCase().includes("twitter") || link.toLowerCase().includes("x.com")) {
        return (<FaTwitter { ...iconProps } />);
    }
    if (link.toLowerCase().includes("linkedin")) {
        return (<FaLinkedin { ...iconProps } />);
    }
    if (link.toLowerCase().includes("github")) {
        return (<FaGithub { ...iconProps } />);
    }
    return (<FaGlobe { ...iconProps } />);
};

export const getSocialName = (link: string): string => {
    if (link.toLowerCase().includes("twitter") || link.toLowerCase().includes("x.com")) {
        return "Twitter";
    }
    if (link.toLowerCase().includes("linkedin")) {
        return "LinkedIn";
    }
    if (link.toLowerCase().includes("github")) {
        return "GitHub";
    }
    return link;
};