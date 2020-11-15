import React, {lazy, useEffect} from 'react';
import {ConfigProvider, Root, Snackbar, Avatar} from '@vkontakte/vkui';
import {useDispatch, useSelector} from 'react-redux';
import {changeScheme, fetchServerUser, fetchVkUser, setVkSaidParams} from '../state/reducers/vk/actions';
import MainView from '../Views/Root';

import {EDITOR_VIEW, POST_VIEW, ROOT_VIEW} from '../constants/View';
import Icon16DoneCircle from '@vkontakte/icons/dist/16/done_circle';
import {setPreviousPanel} from '../state/reducers/history/actions';

import '../styles/index.scss';
import '@vkontakte/vkui/dist/vkui.css';
import PostView from '../Views/Post';
import {fetchCenters} from '../state/reducers/content/actions';
import bridge from '@vkontakte/vk-bridge';
import EditorView from "../Views/Editor";

const App = () => {
    const dispatch = useDispatch();
    const {activeView} = useSelector((state) => state.history);
    const user = useSelector(state =>state.vk.user);
    const colorScheme = useSelector(state=>state.vk.scheme);

    useEffect(() => {
        dispatch(fetchVkUser());
        dispatch(fetchServerUser());
        window.addEventListener('popstate', () => dispatch(setPreviousPanel()));
        return ()=> window.removeEventListener('popstate', () => dispatch(setPreviousPanel()));
    }, []);
    useEffect(()=>{
        if (user.city.title) dispatch(fetchCenters(user.city.title));
        return ()=>{};
    }, [user]);
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
                    dispatch(changeScheme(e.detail.data.scheme));
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
        >
            <Root id='APP' activeView={activeView}>
                <MainView id={ROOT_VIEW}/>
                <PostView id={POST_VIEW}/>
                <EditorView id={EDITOR_VIEW}/>
            </Root>
        </ConfigProvider>
    );
};

export default App;
