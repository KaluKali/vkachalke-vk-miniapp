import React, {useState} from "react";
import {Gallery} from "@vkontakte/vkui";
import PropTypes from "prop-types";

const GalleryOnClick = (props) => {
    const {onPhotoClick,children,...restProps} = props;
    const [dragClick, setDragClick] = useState(false);
    const [currImage, setCurrImage] = useState(0)

    return (
        <Gallery
            {...restProps}
            onChange={(i)=>setCurrImage(i)}
            onDragStart={()=>setDragClick(true)}
            onDragEnd={()=>!dragClick ? onPhotoClick(currImage) : setDragClick(false)}
        >{children}</Gallery>
    );
};

GalleryOnClick.propTypes = {
    onPhotoClick: PropTypes.func,
};

export default GalleryOnClick;
