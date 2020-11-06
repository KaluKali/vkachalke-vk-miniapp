import React from "react";
import {Epic, Tabbar, TabbarItem, View} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setActivePanel, setPreviousPanel} from "../../state/reducers/history/actions";
import {FEED_PANEL, PROFILE_PANEL} from "../../constants/Panel";
import Feed from "../../Panels/Root/Feed";
import Icon28UserCircleOutline from "@vkontakte/icons/dist/28/user_circle_outline";
import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
import Profile from "../../Panels/Root/Profile";


const MainView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const { activePanel, history } = useSelector((state) => state.history);
    const popout = useSelector(state=>state.vk.popout);

    return (
        <Epic activeStory={id} tabbar={
            <Tabbar>
                <TabbarItem
                    selected={activePanel === FEED_PANEL}
                    text="Главная"
                    onClick={()=>dispatch(setActivePanel(FEED_PANEL))}
                ><Icon28NewsfeedOutline /></TabbarItem>
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
                <Feed id={FEED_PANEL} />
                <Profile id={PROFILE_PANEL} />
            </View>
        </Epic>
    );
};

export default MainView;
