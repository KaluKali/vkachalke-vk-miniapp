import React, {Fragment, useEffect, useRef, useState} from "react";
import {
    Avatar,
    FormStatus,
    List,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelHeaderButton,
    RichCell,
    Separator,
    SimpleCell,
    Textarea,
    View
} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setPreviousPanel} from "../../state/reducers/history/actions";
import Post from "../../Panels/Post/Comments";
import {MAPVIEW_PANEL, POST_PANEL} from "../../constants/Panel";
import Stars from "../../Components/Stars";
import {MODAL_CARD_REVIEW, MODAL_DETAILS} from "../../constants/Modal";
import {setModalView} from "../../state/reducers/vk/actions";
import {appendComment} from "../../state/reducers/content/actions";
import MapView from "../../Panels/Post/MapView";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import HideMore from "../../Components/HideMore";
import {capabilitiesIcons} from "../../Components/renderUtils";

const PostView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const popout = useSelector((state)=>state.vk.popout);
    const user = useSelector((state)=>state.vk.user);
    const modal = useSelector((state)=>state.vk.modal);
    const { activePanel, history } = useSelector((state) => state.history);
    const center = useSelector(state=>state.content.centers[state.content.active_post_index]);
    const postCommentsState = useSelector(state=>state.content.active_post_comments)

    const commentInputRef = useRef(null);

    const [stars, setStars] = useState(0);

    useEffect(()=>{
        if (postCommentsState.commented !== -1) {
            setStars(postCommentsState.content[postCommentsState.commented].stars)
        }
    }, [postCommentsState])

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
                            if (commentInputRef.current.value && stars) {
                                if (commentInputRef.current.value.length < 300) {
                                    dispatch(appendComment(user, center, commentInputRef.current.value,  1,stars,setModalView(null)));
                                } else {
                                    setFormError(
                                        <FormStatus header="Некорректное заполнение формы" mode="error">
                                            Слишком много текста, пожалуйста сократите до 300 символов.
                                        </FormStatus>
                                    )
                                }
                            } else {
                                setFormError(
                                    <FormStatus header="Некорректное заполнение формы" mode="error">
                                        Поставьте оценку и напишите краткий отзыв на данное заведение
                                    </FormStatus>
                                )
                            }
                        }
                    }
                ]}
            >
                {formError ? formError : null}
                <RichCell
                    disabled
                    before={<Avatar size={48} src={user.photo_100} />}
                    text={<Stars
                        stars={stars}
                        size={24} onReview={setStars} style={{marginBottom:'5px'}}/>}
                >{`${user.first_name} ${user.last_name}`}</RichCell>
                <Textarea
                    defaultValue={postCommentsState.commented !== -1 ? postCommentsState.content[postCommentsState.commented].text : ''}
                    getRef={commentInputRef} placeholder={'Расскажите о заведении'} onFocus={() => formError && setFormError(null)}/>
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
            <Post id={POST_PANEL}/>
            <MapView id={MAPVIEW_PANEL} />
        </View>
    );
};

export default PostView;
