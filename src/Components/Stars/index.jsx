import React from "react";
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24FavoriteOutline from '@vkontakte/icons/dist/24/favorite_outline';
import PropTypes from "prop-types";

const Stars = (props) => {
    const { stars, onReview, size, style } = props;

    return (
        <div
            style={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                ...style
            }}
        >
            {
                onReview ?
                    [1,2,3,4,5].map(num=>{
                        if (num <= stars) {
                            return <Icon24Favorite width={size ? size : 16} height={size ? size : 16} fill={'#fbbd00'} key={num} onClick={()=>onReview(num)}/>
                        } else {
                            return <Icon24FavoriteOutline width={size ? size : 16} height={size ? size : 16} fill={'#fbbd00'} key={num} onClick={()=>onReview(num)}/>
                        }
                    }) :
                    [1,2,3,4,5].map(num=>{
                        if (num <= stars) {
                            return <Icon24Favorite width={size ? size : 16} height={size ? size : 16} fill={'#fbbd00'} key={num}/>
                        } else {
                            return <Icon24FavoriteOutline  width={size ? size : 16} height={size ? size : 16} fill={'#fbbd00'} key={num} />
                        }
                    })
            }
        </div>
    );
};

Stars.propTypes = {
    stars: PropTypes.number.isRequired
};

export default Stars;
