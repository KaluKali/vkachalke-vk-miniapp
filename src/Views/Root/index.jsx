import React from "react";
import {Epic, Tabbar, TabbarItem, View} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setPreviousPanel} from "../../state/reducers/history/actions";
import Icon28NewsfeedOutline from "@vkontakte/icons/dist/28/newsfeed_outline";
// import Icon28ServicesOutline from "@vkontakte/icons/dist/28/services_outline";
// import Icon28MessageOutline from "@vkontakte/icons/dist/28/message_outline";
// import Icon28ClipOutline from "@vkontakte/icons/dist/28/clip_outline";
import Icon28UserCircleOutline from "@vkontakte/icons/dist/28/user_circle_outline";
import {FEED_PANEL} from "../../constants/Panel";
import Feed from "../../Panels/Root/Feed";


const MainView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const { activePanel, history } = useSelector((state) => state.history);
    const { popout } = useSelector((state)=>state.vk);

    return (
        <Epic activeStory={id} tabbar={
            <Tabbar>
                <TabbarItem
                    selected={activePanel === FEED_PANEL}
                    data-story="feed"
                    text="Главная"
                ><Icon28NewsfeedOutline /></TabbarItem>
                <TabbarItem
                    selected={activePanel === 'profile'}
                    data-story="profile"
                    text="Профиль"
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
            </View>
        </Epic>
    );
};

export default MainView;
