import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {Avatar, RichCell} from "@vkontakte/vkui";
import {IconViewInfoState, renderViewInfoState} from "../renderUtils";
import Stars from "../Stars";

const CenterHeader = (props) => {
    const { children, stars,starSize=16, avatar, actual, onClick, onClickAvatar,caption } = props;

    return (
        <Fragment>
            <RichCell
                disabled multiline
                      before={<Avatar onClick={onClickAvatar} size={40} src={avatar} />}
                      caption={caption ? caption : renderViewInfoState(actual)}
                      after={IconViewInfoState(actual)}
                      text={<Stars size={starSize} stars={stars}/>}
            ><div onClick={onClick}>
                {children}
            </div></RichCell>
        </Fragment>
    );
};

CenterHeader.propTypes = {
    stars: PropTypes.number.isRequired,
    avatar: PropTypes.string,
    actual: PropTypes.number,
    onClick: PropTypes.func
};

export default CenterHeader;
