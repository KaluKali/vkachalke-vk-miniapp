import React, {useEffect, Suspense} from 'react';
import {
    Alert,
    Appearance,
    ConfigProvider,
    Div,
    Placeholder,
    PopoutWrapper,
    Root,
    Scheme,
    Snackbar,
    Spinner
} from '@vkontakte/vkui';
import {useDispatch, useSelector} from 'react-redux';
import {fetchServerUser, setPopoutView, setVkSaidParams} from '../state/reducers/vk/actions';
import MainView from '../Views/Root';
import Icon56WifiOutline from '@vkontakte/icons/dist/56/wifi_outline';
import {EDITOR_VIEW, POST_VIEW, ROOT_VIEW} from '../constants/View';
import Icon16DoneCircle from '@vkontakte/icons/dist/16/done_circle';
import {setActivePanel, setPreviousPanel} from '../state/reducers/history/actions';

import PostView from '../Views/Post';
import bridge from '@vkontakte/vk-bridge';
import EditorView from "../Views/Editor";
import {CITY_SELECTION_PANEL} from "../constants/Panel";


const App = (props) => {
    const { user_info } = props
    const user_object = user_info.read()
    const dispatch = useDispatch();
    const {activeView} = useSelector((state) => state.history);
    const colorScheme = useSelector(state=>state.vk.scheme);

    useEffect(() => {
        dispatch(setVkSaidParams(user_object))
        bridge.send('VKWebAppInit')
        if (!user_object.user_server.isCitySupport) {
            dispatch(setPopoutView(
                <Alert
                    onClose={()=>dispatch(setPopoutView(null))}
                    actionsLayout={'horizontal'}
                    actions={[{
                        title: 'Нет',
                        autoclose: true,
                        mode: 'default',
                        action: () => dispatch(setPopoutView(null)),
                    },{
                        title: 'Да',
                        autoclose: true,
                        mode: 'destructive',
                        action: () => dispatch(setActivePanel(CITY_SELECTION_PANEL)),
                    }]}
                >
                    <h2>Ваш город не поддерживается приложением</h2>
                    <p>Хотите сменить его?</p>
                </Alert>))
        }

        const online = ()=>{
            dispatch(setPopoutView(null))
        }
        const offline = ()=> {
            dispatch(setPopoutView(
                <PopoutWrapper alignY={'center'} alignX={'center'}>
                    <Div style={{
                        background: 'var(--background_content)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Placeholder
                            icon={<Icon56WifiOutline fill={'var(--accent)'}/>}
                            header={'Вы оффлайн'}
                        >Подключитесь к интернету чтобы продолжить работу</Placeholder>
                    </Div>
                </PopoutWrapper>
            ))
        }
        const popstate = () => {
            if (window.navigator.onLine) dispatch(setPreviousPanel())
        }
        window.addEventListener('online', online)
        window.addEventListener('offline', offline)
        window.addEventListener('popstate', popstate);
        return ()=>{
            window.removeEventListener('popstate', popstate)
            window.removeEventListener('online', online)
            window.removeEventListener('offline', offline)
        };
    }, []);

    useEffect(() => {
        const vkEvents = e => {
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
                    console.log(e);
                    if (e.detail.data.scheme===Scheme.SPACE_GRAY) {
                        dispatch(setVkSaidParams({scheme:Scheme.SPACE_GRAY}))
                        bridge.send('VKWebAppSetViewSettings', {
                            'status_bar_style': 'light',
                            'action_bar_color': '#191919'
                        });
                    }
                    break;
                default:
                    console.log(e.detail.type, e.detail.data);
                    break;
            }
        }
        bridge.subscribe(vkEvents);
        return () => {
            bridge.unsubscribe(vkEvents);
        };
    }, []);
    return (
        <ConfigProvider
            // isWebView={true}
            scheme={colorScheme}
            appearance={colorScheme === Scheme.SPACE_GRAY ? Appearance.DARK : Appearance.LIGHT}
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
