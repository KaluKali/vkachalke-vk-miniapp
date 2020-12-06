import React, {useRef, useState} from "react";
import {
    Button,
    Div,
    Epic,
    FormLayout,
    FormStatus,
    Group,
    Input,
    List,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelHeaderButton,
    Radio,
    SelectMimicry,
    SimpleCell,
    Snackbar,
    Tabbar,
    TabbarItem,
    View
} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setActivePanel, setPreviousPanel} from "../../state/reducers/history/actions";
import {
    BOARD_PANEL, CHANGED_CENTERS_PANEL,
    CITY_SELECTION_PANEL,
    FIND_PANEL,
    LIKED_CENTERS_PANEL,
    PROFILE_PANEL,
    RATING_PANEL,
    REVIEWED_CENTERS_PANEL
} from "../../constants/Panel";
import Find from "../../Panels/Root/Find";
import Icon28UserCircleOutline from "@vkontakte/icons/dist/28/user_circle_outline";
import Profile from "../../Panels/Root/Profile";
import Rating from "../../Panels/Root/Rating";
import {MODAL_CARD_OWNER, MODAL_FILTER, MODAL_FILTER_CATEGORIES} from "../../constants/Modal";
import {sendRequest, setModalView, setPreviousModal, setVkSaidParams} from "../../state/reducers/vk/actions";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import Icon24Search from '@vkontakte/icons/dist/24/search';
import Icon24ServicesOutline from '@vkontakte/icons/dist/24/services_outline';
import Board from "../../Panels/Root/Board";
import CitySelection from "../../Panels/Root/Mimicry/CitySelection";
import Icon24StatisticsOutline from '@vkontakte/icons/dist/24/statistics_outline';
import {setCenterSaidParams} from "../../state/reducers/content/actions";
import Icon24Done from "@vkontakte/icons/dist/24/done";
import Likes from "../../Panels/Root/Profile/Likes";
import Reviewed from "../../Panels/Root/Profile/Reviewed";
import {categories} from "../../Components/renderUtils";
import {ROOT_VIEW} from "../../constants/View";
import Changes from "../../Panels/Root/Profile/Changes";

const MainView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const activePanel = useSelector((state) => state.history.activePanel);
    const history = useSelector((state) => state.history.history.filter(h=>h.viewId===ROOT_VIEW).map(h=>h.panelId));
    const popout = useSelector(state=>state.vk.popout);
    const modal = useSelector((state)=>state.vk.modal);
    const groupInputRef = useRef(null);
    const [formError, setFormError] = useState(null);
    const activeCategory = useSelector(state=>state.content.activeCategory);


    const onClickCategory = (txt) => {
        window.scrollTo(0,0);
        dispatch(setCenterSaidParams({activeCategory:txt}))
    };

    const modalPages = (
        <ModalRoot activeModal={modal} onClose={()=>dispatch(setPreviousModal())}>
            <ModalPage
                id={MODAL_FILTER}
                header={<ModalPageHeader
                        right={<PanelHeaderButton onClick={()=>dispatch(setPreviousModal())}>
                            <Icon24Done />
                        </PanelHeaderButton>}>Фильтры</ModalPageHeader>}
            >
                <FormLayout Component={'div'}>
                    <List>
                        <SelectMimicry top={'Категория'} placeholder={'Выбрать категорию'}
                                       onClick={()=>dispatch(setModalView(MODAL_FILTER_CATEGORIES))}>
                            {activeCategory}
                        </SelectMimicry>
                        <div style={{paddingBottom:10}} />
                    </List>
                </FormLayout>
            </ModalPage>
            <ModalPage
                id={MODAL_FILTER_CATEGORIES}
                onClose={()=>dispatch(setPreviousModal())}
                header={<ModalPageHeader
                    right={<PanelHeaderButton onClick={()=>dispatch(setPreviousModal())}>
                        <Icon24Done />
                    </PanelHeaderButton>}>Выберите категорию</ModalPageHeader>}
            >
                <Group>
                    {activeCategory !== '' &&
                    <Div style={{display:'flex'}}>
                        <Button onClick={()=>onClickCategory('')} size={'l'} stretched mode={'destructive'}>Очистить</Button>
                    </Div>}
                    {categories.map((cat,key)=>(
                        <Radio key={key} value={cat} checked={activeCategory===cat}
                               onChange={(e)=>onClickCategory(e.target.value)}>{cat}</Radio>
                    ))}
                </Group>
            </ModalPage>
            <ModalCard
                id={MODAL_CARD_OWNER}
                header="Подтверждение"
                onClose={()=>dispatch(setPreviousModal())}
                actions={[
                    {
                        title: 'Отправить',
                        mode: 'commerce',
                        action: ()=>{
                            if (groupInputRef.current.value && /^(https:\/\/|)vk\.com\/.+/i.test(groupInputRef.current.value)) {
                                dispatch(setPreviousModal())
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
                    onClick={()=>dispatch(setActivePanel(BOARD_PANEL))}
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
                    onClick={()=>dispatch(setActivePanel(RATING_PANEL))}
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
                <Likes id={LIKED_CENTERS_PANEL} />
                <Reviewed id={REVIEWED_CENTERS_PANEL} />
                <Board id={BOARD_PANEL} />
                <CitySelection id={CITY_SELECTION_PANEL} />
                <Changes id={CHANGED_CENTERS_PANEL} />
            </View>
        </Epic>
    );
};

export default React.memo(MainView);
