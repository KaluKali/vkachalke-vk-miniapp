import React, {useEffect, useState} from "react";
import {ConfigProvider, Root} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "../state/reducers/vk/actions";
import MainView from "../Views/Root";

import {POST_VIEW, ROOT_VIEW} from "../constants/View";

import {setPreviousPanel} from "../state/reducers/history/actions";

import "../styles/index.scss";
import "@vkontakte/vkui/dist/vkui.css";
import PostView from "../Views/Post";

const DARK_THEME_IDS = ['client_dark', 'space_gray'];
const DEFAULT_COLOR_SCHEME = 'bright_light';

const isDark = scheme => {
    return !(typeof scheme === 'string') ? false : DARK_THEME_IDS.indexOf(scheme) !== -1;
};


const App = () => {
    const dispatch = useDispatch();
    const {activeView} = useSelector((state) => state.history);
    const [colorScheme, setColorScheme] = useState(DEFAULT_COLOR_SCHEME);

    // const VKWebAppUpdateConfig = scheme => {
    //     if (!isDark(scheme)) {
    //         bridge.send('VKWebAppSetViewSettings', {
    //             status_bar_style: 'light',
    //             action_bar_color: '#8b44f7',
    //         });
    //     }
    //
    //     setColorScheme(scheme);
    //
    //     const schemeAttribute = document.createAttribute('scheme');
    //     schemeAttribute.value = scheme;
    //     document.body.attributes.setNamedItem(schemeAttribute);
    // };
    useEffect(() => {
        window.addEventListener("popstate", () => dispatch(setPreviousPanel()));
        dispatch(getUser());
        return ()=> window.removeEventListener("popstate", () => dispatch(setPreviousPanel()));
    }, []);

    // useEffect(() => {
    //     const vkEvents = bridge.subscribe(e => {
    //         switch(e.detail.type) {
    //             case 'VKWebAppUpdateConfig':
    //                 // const scheme = get(e, 'detail.data.scheme', DEFAULT_COLOR_SCHEME);
    //                 VKWebAppUpdateConfig(scheme);
    //                 console.log(e);
    //                 break;
    //             default:
    //                 console.log(e.detail.type, e.detail.data);
    //                 break;
    //         }
    //     });
    //
    //     return () => {
    //         bridge.unsubscribe(vkEvents);
    //     };
    // }, []);

    return (
        <ConfigProvider isWebView={true}>
            <Root id="APP" activeView={activeView}>
                <MainView id={ROOT_VIEW}/>
                <PostView id={POST_VIEW}/>
            </Root>
        </ConfigProvider>
    );
};

export default App;
