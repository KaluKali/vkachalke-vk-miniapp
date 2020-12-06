import React, {useEffect} from "react";
import {Card, CardGrid, withModalRootContext} from "@vkontakte/vkui";
import Icon24DismissOverlay from "@vkontakte/icons/dist/24/dismiss_overlay";

const ImagesLine = (props) => {
    const { images, onImageChange, updateModalHeight } = props;

    useEffect(()=>{
        updateModalHeight()
    }, [images])

    return (
        <CardGrid>
            {images.map((img,key)=>img && (
                <Card key={key} size="m" style={key % 2 ? {
                    height: 96,

                    backgroundPosition: 'center center',
                    backgroundSize: `cover`,
                    backgroundImage:`url(${img})`,
                    backgroundRepeat: 'no-repeat',
                } : {
                    height: 96,
                    marginLeft:0,
                    backgroundPosition: 'center center',
                    backgroundSize: `cover`,
                    backgroundImage:`url(${img})`,
                    backgroundRepeat: 'no-repeat',
                }}>
                    <Icon24DismissOverlay style={{order: 999,marginLeft:'auto'}} onClick={()=>onImageChange(images.map((img,k)=>k===key ? null : img))} />
                </Card>
            ))}
        </CardGrid>
    );
};


export default withModalRootContext(ImagesLine);
