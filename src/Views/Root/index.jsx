import React, {useRef, useState} from "react";
import {
    Button,
    Checkbox,
    Epic,
    FormLayout,
    FormStatus,
    Input,
    List,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelHeaderButton,
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
    BOARD_PANEL,
    CHANGED_CENTERS_PANEL,
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
import Icon24Done from "@vkontakte/icons/dist/24/done";
import Likes from "../../Panels/Root/Profile/Likes";
import Reviewed from "../../Panels/Root/Profile/Reviewed";
import {categories} from "../../Components/renderUtils";
import {ROOT_VIEW} from "../../constants/View";
import Changes from "../../Panels/Root/Profile/Changes";
import {setContentSaidParams} from "../../state/reducers/content/actions";
import Icon20CancelCircleFillRed from "@vkontakte/icons/dist/20/cancel_circle_fill_red";

const MainView = (props) => {
    const { id, isDesktop } = props;
    const dispatch = useDispatch();
    const activePanel = useSelector((state) => state.history.activePanel);
    const center = useSelector(state=>state.content.center)
    const history = useSelector((state) => state.history.history.filter(h=>h.viewId===ROOT_VIEW).map(h=>h.panelId));
    const popout = useSelector(state=>state.vk.popout);
    const modal = useSelector((state)=>state.vk.modal);
    const groupInputRef = useRef(null);
    const [formError, setFormError] = useState(null);
    const [formChecked, setFormChecked] = useState(useSelector(state=>state.content.categories))

    const modalPages = (
        <ModalRoot activeModal={modal} onClose={()=>dispatch(setPreviousModal())}>
            <ModalPage
                id={MODAL_FILTER}
                header={<ModalPageHeader
                    right={<PanelHeaderButton onClick={()=>dispatch(setPreviousModal())}>
                        <Icon24Done fill={'var(--accent)'} onClick={()=>dispatch(setPreviousModal())}/>
                    </PanelHeaderButton>}>Фильтры</ModalPageHeader>}
            >
                <FormLayout Component={'div'}>
                    <List>
                        <SelectMimicry top={'Категория'} placeholder={'Выбрать категорию'}
                                       onClick={()=>dispatch(setModalView(MODAL_FILTER_CATEGORIES))}>
                            {formChecked.join(', ')}
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
                        <Icon24Done fill={'var(--accent)'} onClick={()=>{
                            dispatch(setContentSaidParams({categories:formChecked}))
                            dispatch(setPreviousModal())
                        }}/>
                    </PanelHeaderButton>}>Выберите категории</ModalPageHeader>}
            >
                <FormLayout Component={'div'}>
                    {formChecked.length === 0 ? <div style={{display:'flex'}}><Button disabled size={'l'} stretched mode={'destructive'}>Очистить</Button></div> :
                        <div style={{display:'flex'}}>
                            <Button onClick={()=>{
                                setFormChecked([])
                            }} size={'l'} stretched mode={'destructive'}>Очистить</Button>
                        </div>}
                    {categories.map((cat,key)=>(
                        formChecked.some(item=>item===cat) ?
                            <Checkbox key={key} checked={true} value={cat}
                                      onChange={(e)=>setFormChecked(formChecked.filter(item=>item!==e.target.value))}>{cat}</Checkbox> :
                            <Checkbox key={key} value={cat} checked={false}
                                      onChange={(e)=>setFormChecked([...formChecked,e.target.value])}>{cat}</Checkbox>
                    ))}
                </FormLayout>
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
                                sendRequest(1, {vk_group:groupInputRef.current.value,id:center.id},(data,err)=>{
                                    if (!err) {
                                        dispatch(setVkSaidParams({snackbar: (
                                                <Snackbar
                                                    duration={2000}
                                                    layout="vertical"
                                                    onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                                    before={<Icon16DoneCircle fill={'var(--accent)'} />}
                                                >Ваша заявка отправлена</Snackbar>
                                            )}))
                                    } else {
                                        dispatch(setVkSaidParams({snackbar: (
                                                <Snackbar
                                                    duration={2000}
                                                    layout="vertical"
                                                    onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                                    before={<Icon20CancelCircleFillRed />}
                                                >{err.response ? err.response.data : err.message==='Network Error' ? 'Сетевая ошибка, повторите попытку' : err.message}</Snackbar>
                                            )}))
                                    }
                                })
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
                    selected={[CITY_SELECTION_PANEL,PROFILE_PANEL,REVIEWED_CENTERS_PANEL,LIKED_CENTERS_PANEL,CHANGED_CENTERS_PANEL].some(pnl=>pnl===activePanel)}
                    text="Профиль"
                    onClick={()=>dispatch(setActivePanel(PROFILE_PANEL))}
                ><Icon28UserCircleOutline fill={[PROFILE_PANEL,REVIEWED_CENTERS_PANEL,LIKED_CENTERS_PANEL,CHANGED_CENTERS_PANEL,CITY_SELECTION_PANEL].some(pnl=>pnl===activePanel) ? 'var(--text_link)' : null}/></TabbarItem>
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
                <Find id={FIND_PANEL} categories={formChecked} isDesktop={isDesktop} />
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
