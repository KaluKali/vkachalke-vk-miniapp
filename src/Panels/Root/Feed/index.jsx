import React, {useEffect} from "react";
import {Panel, PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {handleToPreviousPanel} from "../../../core/HistoryDispatcher";
import {useDispatch} from "react-redux";

const Feed = (props) => {
    const { id } = props;
    const dispatch = useDispatch();

    // useEffect()

    return (
        <Panel id={id}>
            <PanelHeader>Главная</PanelHeader>

        </Panel>
    );
};

Feed.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Feed;
