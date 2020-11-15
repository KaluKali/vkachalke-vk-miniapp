import React from "react";
import {Epic, Tabbar, TabbarItem, View} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setActivePanel, setPreviousPanel} from "../../state/reducers/history/actions";
import {FIND_PANEL, PROFILE_PANEL, TAPE_PANEL} from "../../constants/Panel";
import Feed from "../../Panels/Root/Feed";
import Icon28UserCircleOutline from "@vkontakte/icons/dist/28/user_circle_outline";
import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
import Profile from "../../Panels/Root/Profile";
import Icon24Newsfeed from '@vkontakte/icons/dist/24/newsfeed';
import Tape from "../../Panels/Root/Tape";

const MainView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const { activePanel, history } = useSelector((state) => state.history);
    const popout = useSelector(state=>state.vk.popout);

    return (
        <Epic activeStory={id} tabbar={
            <Tabbar>
                <TabbarItem
                    selected={activePanel === FIND_PANEL}
                    text="Поиск"
                    onClick={()=>dispatch(setActivePanel(FIND_PANEL))}
                ><Icon28NewsfeedOutline /></TabbarItem>
                <TabbarItem
                    selected={activePanel === TAPE_PANEL}
                    text="Лента"
                    onClick={()=>dispatch(setActivePanel(TAPE_PANEL))}
                ><Icon24Newsfeed /></TabbarItem>
                <TabbarItem
                    selected={activePanel === PROFILE_PANEL}
                    text="Профиль"
                    onClick={()=>dispatch(setActivePanel(PROFILE_PANEL))}
                ><Icon28UserCircleOutline /></TabbarItem>
            </Tabbar>
        }>
            <View
                id={id}
                history={history}
                activePanel={activePanel}
                popout={popout}
                onSwipeBack={() => dispatch(setPreviousPanel())}
            >
                <Feed id={FIND_PANEL} />
                <Tape id={TAPE_PANEL} />
                <Profile id={PROFILE_PANEL} />
            </View>
        </Epic>
    );
};

export default MainView;
