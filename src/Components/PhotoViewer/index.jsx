import React from "react";
import {Gallery, PopoutWrapper} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import NakedImage from "../NakedImage";
import {useDispatch} from "react-redux";
import {setPopoutView} from "../../state/reducers/vk/actions";

const PhotoViewer = (props) => {
    const {images} = props;
    const dispatch = useDispatch();

    return (
        <PopoutWrapper
            alignX={'center'}
            alignY={'center'}
            onClick={()=>dispatch(setPopoutView(null))}
        >
            <Gallery
                onClick={(e)=>e.stopPropagation()}
                align={'center'}
                style={{ height: 300,width:'100%'}}
            >
                {
                    images.map((image,key)=>
                        image && <NakedImage key={key} url={image} contain />
                    )
                }
            </Gallery>
        </PopoutWrapper>
    );
};

PhotoViewer.propTypes = {
    images: PropTypes.array.isRequired
};

export default PhotoViewer;
