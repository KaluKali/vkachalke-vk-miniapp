import React from "react";
import PropTypes from "prop-types";

const NakedImage = (props) => {
    const { children, url, size, style, onClick, contain } = props;
    let styles = {
        backgroundPosition: 'center center',
        backgroundSize: contain ? 'contain' : 'cover',
        backgroundImage:`url(${url})`,
        backgroundRepeat: 'no-repeat',
        ...style
    }
    if (size) styles.height=typeof size === 'number' ? `${size}px` : size
    return (
        <div
            onClick={onClick}
            style={styles}>{children}</div>
    );
};

NakedImage.propTypes = {
    url: PropTypes.string.isRequired,
    style: PropTypes.object
};

export default NakedImage;
