import React, {Fragment, useEffect, useRef, useState} from "react";
import {
    Alert,
    Avatar,
    File,
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
    RichCell,
    ScreenSpinner,
    Separator,
    SimpleCell,
    Snackbar,
    View,
    WriteBar,
    WriteBarIcon
} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setPreviousPanel} from "../../state/reducers/history/actions";
import Comment from "../../Panels/Post/Comments";
import {MAPVIEW_PANEL, POST_PANEL} from "../../constants/Panel";
import Stars from "../../Components/Stars";
import {MODAL_CARD_OWNER, MODAL_CARD_REVIEW, MODAL_DETAILS, MODAL_SELECT_IMAGES} from "../../constants/Modal";
import {sendRequest, setModalView, setPopoutView, setVkSaidParams} from "../../state/reducers/vk/actions";
import {appendComment} from "../../state/reducers/content/actions";
import MapView from "../../Panels/Post/MapView";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import HideMore from "../../Components/HideMore";
import {capabilitiesIcons} from "../../Components/renderUtils";
import {POST_VIEW} from "../../constants/View";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import Icon24Done from "@vkontakte/icons/dist/24/done";
import ImagesLine from "../../Components/ImagesLine";


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
    const [images, setImages] = useState({content:[null,null,null,null,null,null]})

    useEffect(()=>{
        if (comment_state.commented !== -1) {
            setStars(comment_state.content[comment_state.commented].stars)
            if (comment_state.content[comment_state.commented].image) {
                setImages({content: [null,null,null,null,null,null].map((img,key)=>comment_state.content[comment_state.commented].image[key] ? comment_state.content[comment_state.commented].image[key] : null),
                    count: comment_state.content[comment_state.commented].image.length
                })
            } else {
                setImages({content: [null,null,null,null,null,null]})
            }
            setCommentInputValue(comment_state.content[comment_state.commented].text)
        } else {
            setStars(0)
            setCommentInputValue('')
            setImages({content: [null,null,null,null,null,null]})
        }
    }, [comment_state])

    const [formError, setFormError] = useState(null);

    const onImageInputChange = (e)=>{
        const { files } = e.target;

        if (files.length){
            if (files[0].size/1024/1000<5) {
                if (/^image\/(?!gif).*/.test(files[0].type)) {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => {
                        let arr_temp = [...images.content]
                        for (let i=0;arr_temp.length>i;i++) {
                            if (arr_temp[i] === null) {
                                arr_temp[i]=fileReader.result
                                break;
                            }
                        }
                        setImages({content: arr_temp})
                    }
                    fileReader.readAsDataURL(files[0]);
                } else {
                    dispatch(setPopoutView(
                        <Alert
                            onClose={()=>dispatch(setPopoutView(null))}
                            actionsLayout='horizontal'
                            actions={[{
                                title: 'Ок',
                                autoclose: true,
                                mode: 'default',
                                action: () => dispatch(setPopoutView(null)),
                            }]}
                        >
                            <h2>Неверный тип файла</h2>
                            <p>Файл должен быть изображением</p>
                        </Alert>))
                }
            } else {
                dispatch(setPopoutView(
                    <Alert
                        actionsLayout='horizontal'
                        actions={[{
                            title: 'Ок',
                            autoclose: true,
                            mode: 'default',
                            action: () => dispatch(setPopoutView(null)),
                        }]}
                        onClose={()=>dispatch(setPopoutView(null))}
                    >
                        <h2>Лимит размера файлов</h2>
                        <p>Общий размер файлов не должен превышать 5 мегабайт</p>
                    </Alert>))
            }
        }
    }

    const modalPages = (
        <ModalRoot activeModal={modal} onClose={()=>dispatch(setPreviousPanel())}>
            <ModalPage
                id={MODAL_SELECT_IMAGES}
                dynamicContentHeight
                onClose={()=>dispatch(setPreviousPanel())}
                header={<ModalPageHeader
                    right={<PanelHeaderButton onClick={()=>dispatch(setPreviousPanel())}>
                        <Icon24Done />
                    </PanelHeaderButton>}>Изображения</ModalPageHeader>}
            >
                <FormLayout>
                    <Group>
                        <ImagesLine images={images.content} onImageChange={(imgs)=>setImages({content: imgs})} />
                    </Group>
                    <div style={{display:'flex'}}>
                        {images.content.some((img)=>img===null) ?
                            <File accept={'image/*'} align={'center'} stretched controlSize="l"
                                  onChange={onImageInputChange}>Добавить изображение</File> :
                            <File disabled align={'center'} stretched controlSize="l">Добавить изображение</File>
                        }
                    </div>
                </FormLayout>
            </ModalPage>
            <ModalPage
                id={MODAL_DETAILS}
                dynamicContentHeight={true}
                header={
                    <ModalPageHeader
                        right={<PanelHeaderButton onClick={()=>{dispatch(setPreviousPanel())}
                        }><Icon24Dismiss /></PanelHeaderButton>}
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
                                            <SimpleCell disabled style={{padding:'0 0 0 36px'}} key={`options-details-${key2}`}>{option}</SimpleCell>
                                        ))}
                                    </HideMore> : <Fragment>
                                        <SimpleCell disabled before={capabilitiesIcons(keys[0])}>{keys[0]}</SimpleCell>
                                        {item[keys[0]].map((option,key2)=>(
                                            <SimpleCell disabled style={{padding:'0 0 0 36px'}} key={`options-details-${key2}`}>{option}</SimpleCell>
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
                onClose={() => dispatch(setPreviousPanel())}
                header={'Отзыв'}
                actions={[
                    {
                        title: 'Отправить',
                        mode: 'commerce',
                        action: ()=>{
                            if (commentInputValue!=='' && stars) {
                                dispatch(setPopoutView(<ScreenSpinner/>))
                                dispatch(appendComment(user, center, commentInputValue, images.content.filter(img=>img), 1,stars,(err,data)=>{
                                    if (err) {
                                        dispatch(setPopoutView(
                                            <Alert
                                                actionsLayout='horizontal'
                                                actions={[{
                                                    title: 'Ок',
                                                    autoclose: true,
                                                    mode: 'default',
                                                    action: () => dispatch(setPopoutView(null)),
                                                }]}
                                                onClose={()=>dispatch(setPopoutView(null))}
                                            >
                                                <h2>{err.request.status=== 413 ? 'Лимит размера файлов' : 'Ошибка запроса'}</h2>
                                                <p>{err.request.response}</p>
                                            </Alert>))
                                    } else {dispatch(setVkSaidParams({modal:null,popout:null}))}
                                }));
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
                {formError ? formError : null}
                <RichCell
                    disabled
                    before={<Avatar size={48} src={user.photo_100} />}
                    text={<Stars
                        stars={stars}
                        size={24} onReview={setStars} style={{marginBottom:'5px'}}/>}
                >{`${user.first_name} ${user.last_name}`}</RichCell>
                <WriteBar
                    style={{background:'var(--modal_card_background)'}}
                    before={<Fragment>
                        <WriteBarIcon mode={'attach'} count={images.content.filter(cc=>cc).length} onClick={()=>dispatch(setModalView(MODAL_SELECT_IMAGES))} />
                    </Fragment>}
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
                onClose={()=>dispatch(setPreviousPanel())}
                actions={[
                    {
                        title: 'Отправить',
                        mode: 'commerce',
                        action: ()=>{
                            if (groupInputRef.current.value) {
                                dispatch(setPreviousPanel())
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
