import React from "react";
import {View} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";


import {setPreviousPanel} from "../../../src/state/reducers/history/actions";

const ExampleView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const { activePanel, history } = useSelector((state) => state.history);

    return (
            <View
                id={id}
                history={history}
                activePanel={activePanel}
                onSwipeBack={() => dispatch(setPreviousPanel())}
            >
            </View>
    );
};

export default ExampleView;
