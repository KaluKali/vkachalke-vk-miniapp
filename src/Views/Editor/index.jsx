import React from "react";
import {View} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setPreviousPanel} from "../../state/reducers/history/actions";
import {CENTER_EDIT_PANEL} from "../../constants/Panel";
import Center from "../../Panels/Editor/Center";

const EditorView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const { activePanel, history } = useSelector((state) => state.history);
    const popout = useSelector(state=>state.vk.popout);

    return (
            <View
                id={id}
                history={history}
                activePanel={activePanel}
                popout={popout}
                onSwipeBack={() => dispatch(setPreviousPanel())}
            >
                <Center id={CENTER_EDIT_PANEL} />
            </View>
    );
};

export default EditorView;
