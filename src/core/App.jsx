import React, {useEffect} from 'react';
import {Appearance, ConfigProvider, Root, Snackbar} from '@vkontakte/vkui';
import {useDispatch, useSelector} from 'react-redux';
import {fetchServerUser, setVkSaidParams, setVkUser} from '../state/reducers/vk/actions';
import MainView from '../Views/Root';

import {EDITOR_VIEW, POST_VIEW, ROOT_VIEW} from '../constants/View';
import Icon16DoneCircle from '@vkontakte/icons/dist/16/done_circle';
import {setPreviousPanel} from '../state/reducers/history/actions';

import PostView from '../Views/Post';
import {fetchCenters, fetchFeed} from '../state/reducers/content/actions';
import bridge from '@vkontakte/vk-bridge';
import EditorView from "../Views/Editor";
import * as types from "../state/reducers/vk/types";

const App = () => {
    const dispatch = useDispatch();
    const {activeView} = useSelector((state) => state.history);
    const colorScheme = useSelector(state=>state.vk.scheme);

    useEffect(() => {
        bridge.send('VKWebAppGetUserInfo')
            .then(data=>{
                dispatch(setVkUser(data, types.SET_VK_USER))
                dispatch(fetchServerUser((user_server)=>{
                    dispatch(fetchCenters(user_server.city ? user_server.city : data.city.title));
                    dispatch(fetchFeed());
                }));
            });
        window.addEventListener('popstate', () => dispatch(setPreviousPanel()));
        return ()=> window.removeEventListener('popstate', () => dispatch(setPreviousPanel()));
    }, []);

    useEffect(() => {
        const vkEvents = bridge.subscribe(e => {
            switch(e.detail.type) {
                case 'VKWebAppCopyTextResult':
                    if (e.detail.data.result) {
                        dispatch(setVkSaidParams({snackbar: (
                                <Snackbar
                                    duration={2000}
                                    layout="vertical"
                                    onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                    before={<Icon16DoneCircle fill={'var(--accent)'} />}
                                >Название скопировано</Snackbar>
                            )}))
                    }
                    break;
                case 'VKWebAppUpdateConfig':
                    if (!(e.detail.data.scheme==='bright_light' || e.detail.data.scheme==='client_light')) {
                        dispatch(setVkSaidParams({scheme:'space_gray'}))
                    }
                    console.log(e);
                    break;
                default:
                    console.log(e.detail.type, e.detail.data);
                    break;
            }
        });
        return () => {
            bridge.unsubscribe(vkEvents);
        };
    }, []);

    return (
        <ConfigProvider
            isWebView={bridge.isWebView()}
            scheme={colorScheme}
            appearance={colorScheme === 'space_gray' ? Appearance.DARK : Appearance.LIGHT}
            transitionMotionEnabled={false}
        >
            <Root id='APP' activeView={activeView}>
                <MainView id={ROOT_VIEW}/>
                <PostView id={POST_VIEW}/>
                <EditorView id={EDITOR_VIEW}/>
            </Root>
        </ConfigProvider>
    );
};

export default React.memo(App);
