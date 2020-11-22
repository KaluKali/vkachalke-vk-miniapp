import React, {useRef, useState} from "react";
import {
    Epic,
    FormStatus,
    Input,
    ModalCard,
    ModalRoot,
    SimpleCell,
    Snackbar,
    Tabbar,
    TabbarItem,
    View
} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setActivePanel, setPreviousPanel} from "../../state/reducers/history/actions";
import {BOARD_PANEL, CITY_SELECTION_PANEL, FIND_PANEL, PROFILE_PANEL, RATING_PANEL} from "../../constants/Panel";
import Find from "../../Panels/Root/Find";
import Icon28UserCircleOutline from "@vkontakte/icons/dist/28/user_circle_outline";
import Profile from "../../Panels/Root/Profile";
import Rating from "../../Panels/Root/Rating";
import {MODAL_CARD_OWNER} from "../../constants/Modal";
import {sendRequest, setModalView, setVkSaidParams} from "../../state/reducers/vk/actions";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import Icon24Search from '@vkontakte/icons/dist/24/search';
import Icon24ServicesOutline from '@vkontakte/icons/dist/24/services_outline';
import Board from "../../Panels/Root/Board";
import CitySelection from "../../Panels/Root/Mimicry/CitySelection";
import Icon24StatisticsOutline from '@vkontakte/icons/dist/24/statistics_outline';

const MainView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const { activePanel, history } = useSelector((state) => state.history);
    const popout = useSelector(state=>state.vk.popout);
    const modal = useSelector((state)=>state.vk.modal);
    const groupInputRef = useRef(null);
    const [formError, setFormError] = useState(null);

    const modalPages = (
        <ModalRoot activeModal={modal} onClose={()=>dispatch(setModalView(null))}>
            <ModalCard
                id={MODAL_CARD_OWNER}
                onClose={() => dispatch(setModalView(null))}
                header="Подтверждение"
                actions={[
                    {
                        title: 'Отправить',
                        mode: 'commerce',
                        action: ()=>{
                            if (groupInputRef.current.value) {
                                dispatch(setVkSaidParams({modal:null}))
                                dispatch(sendRequest(1, {vk_group:groupInputRef.current.value}))
                                dispatch(setVkSaidParams({snackbar: (
                                        <Snackbar
                                            duration={2000}
                                            layout="vertical"
                                            onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                            before={<Icon16DoneCircle fill={'var(--accent)'} />}
                                        >Ваша заявка отправлена</Snackbar>
                                    )}))
                            } else {
                                setFormError(
                                    <FormStatus header="Некорректное заполнение формы" mode="error">
                                        Укажите ссылку на группу
                                    </FormStatus>
                                )
                            }
                        }
                    }
                ]}
            >
                {formError ? formError : null}
                <SimpleCell
                    disabled
                    multiline
                    description={<Input type={'url'} getRef={groupInputRef} placeholder={'Ссылка на группу'} onFocus={() => formError && setFormError(null)}/>}
                >
                    Для получения статуса владельца заведения вам нужно указать группу сообщества и быть в блоке контактов, чтобы нам было легче опознать вас.
                </SimpleCell>
            </ModalCard>
        </ModalRoot>
    );

    return (
        <Epic activeStory={id} tabbar={
            <Tabbar>
                <TabbarItem
                    selected={activePanel === BOARD_PANEL}
                    text="Главная"
                    onClick={()=>dispatch(setActivePanel(BOARD_PANEL, false))}
                ><Icon24ServicesOutline fill={activePanel === BOARD_PANEL ? 'var(--text_link)' : null}/>
                </TabbarItem>
                <TabbarItem
                    selected={activePanel === FIND_PANEL}
                    text="Поиск"
                    onClick={()=>dispatch(setActivePanel(FIND_PANEL))}
                ><Icon24Search fill={activePanel === FIND_PANEL ? 'var(--text_link)' : null}/></TabbarItem>
                <TabbarItem
                    selected={activePanel === RATING_PANEL}
                    text="Рейтинг"
                    onClick={()=>dispatch(setActivePanel(RATING_PANEL, true))}
                ><Icon24StatisticsOutline fill={activePanel === RATING_PANEL ? 'var(--text_link)' : null}/></TabbarItem>
                <TabbarItem
                    selected={activePanel === PROFILE_PANEL}
                    text="Профиль"
                    onClick={()=>dispatch(setActivePanel(PROFILE_PANEL))}
                ><Icon28UserCircleOutline fill={activePanel === PROFILE_PANEL ? 'var(--text_link)' : null}/></TabbarItem>
            </Tabbar>
        }>
            <View
                id={id}
                history={history}
                activePanel={activePanel}
                popout={popout}
                modal={modalPages}
                onSwipeBack={()=>dispatch(setPreviousPanel())}
                // onTransition={(obj)=>console.log(obj)}
            >
                <Find id={FIND_PANEL} />
                <Rating id={RATING_PANEL} />
                <Profile id={PROFILE_PANEL} />
                <Board id={BOARD_PANEL} />
                <CitySelection id={CITY_SELECTION_PANEL} />
            </View>
        </Epic>
    );
};

export default React.memo(MainView);
