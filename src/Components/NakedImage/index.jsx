import React from "react";
import PropTypes from "prop-types";

const NakedImage = (props) => {
    const { children, url, size, style, onClick } = props;

    return (
        <div
            onClick={onClick}
            style={{
                backgroundPosition: 'center center',
                backgroundSize: `cover`,
                height:`${size}px`,
                backgroundImage:`url(${url})`,
                backgroundRepeat: 'no-repeat',
                ...style
            }}>{children}</div>
    );
};

NakedImage.propTypes = {
    url: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    style: PropTypes.object
};

export default NakedImage;
