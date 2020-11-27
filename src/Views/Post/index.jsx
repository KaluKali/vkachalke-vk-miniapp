import React, {Fragment, useEffect, useRef, useState} from "react";
import {
    Avatar,
    FormStatus, Input,
    List,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelHeaderButton,
    RichCell,
    Separator,
    SimpleCell, Snackbar,
    Textarea,
    View
} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setPreviousPanel} from "../../state/reducers/history/actions";
import Comment from "../../Panels/Post/Comments";
import {MAPVIEW_PANEL, POST_PANEL} from "../../constants/Panel";
import Stars from "../../Components/Stars";
import {MODAL_CARD_OWNER, MODAL_CARD_REVIEW, MODAL_DETAILS} from "../../constants/Modal";
import {sendRequest, setModalView, setVkSaidParams} from "../../state/reducers/vk/actions";
import {appendComment} from "../../state/reducers/content/actions";
import MapView from "../../Panels/Post/MapView";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import HideMore from "../../Components/HideMore";
import {capabilitiesIcons} from "../../Components/renderUtils";
import {POST_VIEW} from "../../constants/View";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";

const PostView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const popout = useSelector((state)=>state.vk.popout);
    const user = useSelector((state)=>state.vk.user);
    const modal = useSelector((state)=>state.vk.modal);
    const activePanel = useSelector((state) => state.history.activePanel);
    const history = useSelector((state) => state.history.history.filter(h=>h.viewId===POST_VIEW).map(h=>h.panelId));
    const center = useSelector(state=>state.content.center);
    const comment_state = useSelector(state=>state.content.active_post_comments)
    const groupInputRef = useRef(null);
    const [commentInputValue, setCommentInputValue] = useState('')

    const [stars, setStars] = useState(0);

    useEffect(()=>{
        if (comment_state.commented !== -1) {
            setStars(comment_state.content[comment_state.commented].stars)
            setCommentInputValue(comment_state.content[comment_state.commented].text)
        }
    }, [comment_state])


    const [formError, setFormError] = useState(null);

    const modalPages = (
        <ModalRoot activeModal={modal} onClose={()=>dispatch(setModalView(null))}>
            <ModalPage
                id={MODAL_DETAILS}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={<PanelHeaderButton onClick={()=>dispatch(setModalView(null))}><Icon24Dismiss /></PanelHeaderButton>}
                    >Подробности</ModalPageHeader>
                }
            >
                <List>
                    {
                        center ? center.data.capabilities.map((item,key)=>{
                            let keys = Object.keys(item);
                            return (
                                <Fragment key={`details-${key}`}>
                                    <Separator/>
                                    {item[keys[0]].length > 2 ? <HideMore icon={capabilitiesIcons(keys[0])} text={keys[0]}>
                                        {item[keys[0]].map((option,key2)=>(
                                            <SimpleCell style={{padding:'0 0 0 36px'}} key={`options-details-${key2}`}>{option}</SimpleCell>
                                        ))}
                                    </HideMore> : <Fragment>
                                        <SimpleCell before={capabilitiesIcons(keys[0])}>{keys[0]}</SimpleCell>
                                        {item[keys[0]].map((option,key2)=>(
                                            <SimpleCell style={{padding:'0 0 0 36px'}} key={`options-details-${key2}`}>{option}</SimpleCell>
                                        ))}
                                    </Fragment>}
                                </Fragment>
                            )
                        }) : null
                    }
                </List>
            </ModalPage>
            <ModalCard
                id={MODAL_CARD_REVIEW}
                onClose={() => dispatch(setModalView(null))}
                header="Отзыв"
                actions={[
                    {
                        title: 'Отправить',
                        mode: 'commerce',
                        action: ()=>{
                            if (commentInputValue!=='' && stars) {
                                dispatch(appendComment(user, center, commentInputValue,  1,stars,setModalView(null)));
                            } else {
                                setFormError(
                                    <FormStatus style={{paddingTop:'10px'}} header="Некорректное заполнение формы" mode="error">
                                        Поставьте оценку и напишите краткий отзыв на данное заведение
                                    </FormStatus>
                                )
                            }
                        }
                    }
                ]}
            >
                <Fragment>
                    {formError ? formError : null}
                </Fragment>
                <RichCell
                    disabled
                    before={<Avatar size={48} src={user.photo_100} />}
                    text={<Stars
                        stars={stars}
                        size={24} onReview={setStars} style={{marginBottom:'5px'}}/>}
                >{`${user.first_name} ${user.last_name}`}</RichCell>
                <Textarea
                    value={commentInputValue} onChange={(e)=>{
                        if (e.target.value.length > 300) {
                            setFormError(
                                <FormStatus style={{paddingTop:'10px'}} header="Некорректное заполнение формы" mode="error">
                                    Слишком много текста, пожалуйста, сократите до 300 символов.
                                </FormStatus>
                            )
                            setCommentInputValue(e.target.value.substring(0, 299))
                        } else setCommentInputValue(e.target.value)
                }} placeholder={'Расскажите о заведении'} onFocus={() => formError && setFormError(null)}/>
            </ModalCard>
            <ModalCard
                id={MODAL_CARD_OWNER}
                header="Подтверждение"
                onClose={()=>dispatch(setModalView(null))}
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
        <View
            id={id}
            history={history}
            activePanel={activePanel}
            popout={popout}
            modal={modalPages}
            onSwipeBack={() => dispatch(setPreviousPanel())}
        >
            <Comment id={POST_PANEL}/>
            <MapView id={MAPVIEW_PANEL} />
        </View>
    );
};

export default PostView;
