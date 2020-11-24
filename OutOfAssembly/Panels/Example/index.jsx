import React from "react";
import {Panel, PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {handleToPreviousPanel} from "../../../src/core/HistoryDispatcher";
import {useDispatch} from "react-redux";

const Example = (props) => {
    const { id } = props;
    const dispatch = useDispatch();

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>Text</PanelHeader>
        </Panel>
    );
};

Example.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Example;
