import React, {Fragment, useState} from "react";
import PropTypes from "prop-types";
import {SimpleCell, withModalRootContext} from "@vkontakte/vkui";
import Icon24Dropdown from "@vkontakte/icons/dist/24/dropdown";

const HideMore = (props) => {
    const { children, text, icon, updateModalHeight } = props;

    const [showMore, setShowMore] = useState(false)

    return (
        <Fragment>
            <SimpleCell
                before={icon}
                after={<Icon24Dropdown style={{ transform: `rotate(${showMore ? '180deg' : '0'})` }}/>}
                onClick={()=>{
                    showMore ? setShowMore(false) : setShowMore(true)
                    updateModalHeight()
                }}
            >{text}</SimpleCell>
            {showMore && children}
        </Fragment>
    );
};

HideMore.propTypes = {
    text: PropTypes.string,
    icon: PropTypes.element,
};

export default withModalRootContext(HideMore);
