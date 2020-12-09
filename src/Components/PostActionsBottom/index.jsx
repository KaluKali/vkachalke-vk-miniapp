import React, {useState} from "react";
import PropTypes from "prop-types";
import Icon20Like from "@vkontakte/icons/dist/20/like";
import {postLiking, setContentSaidParams} from "../../state/reducers/content/actions";
import Icon20LikeOutline from "@vkontakte/icons/dist/20/like_outline";
import Icon28ShareOutline from "@vkontakte/icons/dist/28/share_outline";
import {
    abstractVkBridgePromise,
    appShowWallPostBox,
    fetchPhoto,
    sendRequest,
    setModalView,
    setPopoutView,
    setVkSaidParams
} from "../../state/reducers/vk/actions";
import {ActionSheet, ActionSheetItem, Alert, Div, IOS, ScreenSpinner, Snackbar, usePlatform} from "@vkontakte/vkui";
import Icon24MoreHorizontal from "@vkontakte/icons/dist/24/more_horizontal";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import {MODAL_CARD_OWNER} from "../../constants/Modal";
import {setActiveView} from "../../state/reducers/history/actions";
import {CENTER_EDIT_PANEL, POST_PANEL} from "../../constants/Panel";
import {EDITOR_VIEW, POST_VIEW} from "../../constants/View";
import {useDispatch, useSelector} from "react-redux";
import Icon20CommentOutline from "@vkontakte/icons/dist/24/comment_outline";
import Icon20CancelCircleFillRed from "@vkontakte/icons/dist/20/cancel_circle_fill_red";

const PostActionsBottom = (props) => {
    const { center, centers, data_offset, isPost, isDesktop } = props;
    const dispatch = useDispatch()
    const platform = usePlatform();
    const [likeState, setLiked] = useState({liked:center.liked, likes:center.likes})
    const user = useSelector(state =>state.vk.user);


    const showSharePostDialog = (images_filtered) =>{
        let err_fc = ()=>dispatch(setPopoutView(null))
        dispatch(setPopoutView(<ScreenSpinner />))
        abstractVkBridgePromise('VKWebAppGetAuthToken', {app_id: 7636479, scope: "photos,wall"})
            .then(data=>{
                abstractVkBridgePromise('VKWebAppCallAPIMethod',
                    {
                        method:'photos.getWallUploadServer',
                        request_id:'pU1',
                        params:{
                            v:'5.126',
                            access_token:data.access_token
                        }
                    })
                    .then(upload_link=>{
                        fetchPhoto(images_filtered[0], upload_link.response)
                            .then(({data:photo_params})=>{
                                abstractVkBridgePromise('VKWebAppCallAPIMethod',
                                    {
                                        method:'photos.saveWallPhoto',
                                        request_id:'pS1',
                                        params:{
                                            v:'5.126',
                                            access_token:data.access_token,
                                            ...photo_params
                                        }
                                    })
                                    .then((photo_data)=>{
                                        dispatch(setPopoutView(null))
                                        appShowWallPostBox(center, `photo${photo_data.response[0].owner_id}_${photo_data.response[0].id}`)
                                    },err_fc)
                            },err_fc)
                    },err_fc)
            },err_fc)
    }

    return (
        <Div style={{display:'flex', alignItems:'stretch'}}>
            {/** Like **/}
            <div style={{display:'flex',cursor: 'pointer'}} onClick={()=>
                postLiking(center.id)
                    .then(({data})=>setLiked(data))
            }>
                {likeState.liked ? <Icon20Like fill={'var(--text_link)'} style={{alignSelf:'center', marginRight:'5px'}}/>
                    : <Icon20LikeOutline fill={'var(--dynamic_gray)'} style={{alignSelf:'center', marginRight:'5px'}}/>}
                <label style={{ color:likeState.liked ? 'var(--text_link)' : 'var(--dynamic_gray)',marginRight:'15px', alignSelf:'center' }}>{likeState.likes}</label>
            </div>
            {/** Comment **/}
            {isPost &&
            <div style={{display:'flex',cursor: 'pointer'}} onClick={()=>{
                localStorage.setItem('data_offset',data_offset)
                localStorage.setItem('centers',JSON.stringify(centers))
                localStorage.setItem('sroll-prev-find', window.scrollY)
                dispatch(setContentSaidParams({ center:center,isSavedState: true }));
                dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
            }}>
                <Icon20CommentOutline fill={'var(--dynamic_gray)'} style={{alignSelf:'center', marginRight:'5px'}}/>
                <label style={{ color:'var(--dynamic_gray)',marginRight:'15px', alignSelf:'center' }}>{center.comments}</label>
            </div>}
            {/** SharePost **/}
            <Icon28ShareOutline fill={'var(--dynamic_gray)'} width={24} height={24} style={{alignSelf:'center', marginRight:'auto',cursor: 'pointer'}}
                                onClick={()=>{
                                    dispatch(setPopoutView(
                                        <ActionSheet onClose={()=>dispatch(setPopoutView(null))}>
                                            <ActionSheetItem autoclose onClick={()=>{
                                                let images_filtered = center.image ? center.image.filter(img=>img) : null
                                                if (images_filtered && images_filtered.length) {
                                                    if (window.location.search.indexOf('vk_access_token_settings=photos,wall')===-1) {
                                                        dispatch(setVkSaidParams({popout:(
                                                                <Alert
                                                                    actionsLayout="horizontal"
                                                                    actions={[{
                                                                        title: 'Отмена',
                                                                        autoclose: true,
                                                                        mode: 'cancel'
                                                                    },{
                                                                        title: 'Подтвердить',
                                                                        autoclose: true,
                                                                        mode: 'destructive',
                                                                        action: () =>showSharePostDialog(images_filtered),
                                                                    }]}
                                                                    onClose={()=>dispatch(setPopoutView(null))}
                                                                >
                                                                    <h2>Получение прав</h2>
                                                                    <p>Для размещения заведения нам нужно разрешение на фотографии и стену</p>
                                                                </Alert>
                                                            )}))
                                                    } else showSharePostDialog(images_filtered)
                                                } else appShowWallPostBox(center)
                                            }}>На стену</ActionSheetItem>
                                            {isDesktop ?
                                                <ActionSheetItem autoclose
                                                                 onClick={()=>
                                                                     abstractVkBridgePromise("VKWebAppCopyText", {text:`https://vk.com/app7636479#c${center.id}`})}
                                                >Скопировать ссылку</ActionSheetItem> :
                                                <ActionSheetItem autoclose
                                                                 onClick={()=>
                                                                     abstractVkBridgePromise("VKWebAppShare", {link:`https://vk.com/app7636479#c${center.id}`})}
                                                >В диалог</ActionSheetItem>}
                                            {platform === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                                        </ActionSheet>
                                    ))
                                }}/>
            {/** More **/}
            <Icon24MoreHorizontal fill={'var(--dynamic_gray)'} style={{alignSelf:'center',cursor: 'pointer'}} onClick={()=>dispatch(
                setPopoutView(
                    <ActionSheet onClose={()=>dispatch(setPopoutView(null))}>
                        { center.actual===2 && center.owner !== user.id &&
                        <ActionSheetItem autoclose mode='destructive' onClick={()=>{
                            sendRequest(0, {id:center.id},(data,err)=>{
                                if (!err) {
                                    dispatch(setVkSaidParams({snackbar: (
                                            <Snackbar
                                                duration={3000}
                                                layout="vertical"
                                                onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                                before={<Icon16DoneCircle fill={'var(--accent)'} />}
                                            >Ваша жалоба отправлена, мы проверим заведение и сообщим о результатах.</Snackbar>
                                        )}))
                                } else {
                                    dispatch(setVkSaidParams({snackbar: (
                                            <Snackbar
                                                duration={3000}
                                                layout="vertical"
                                                onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                                before={<Icon20CancelCircleFillRed fill={'var(--accent)'} />}
                                            >{err.response.data}</Snackbar>
                                        )}))
                                }
                            })
                        }}>
                            Пожаловаться
                        </ActionSheetItem>  }
                        { center.actual===0 &&
                        <ActionSheetItem autoclose mode='default' onClick={()=>{
                            dispatch(setContentSaidParams({center:center}))
                            dispatch(setModalView(MODAL_CARD_OWNER))
                        }}>
                            Я владелец заведения
                        </ActionSheetItem> }
                        { center.owner === user.id ?
                            <ActionSheetItem autoclose mode='default'
                                             onClick={()=>{
                                                 dispatch(setContentSaidParams({center:center}));
                                                 dispatch(setActiveView({ panelId:CENTER_EDIT_PANEL, viewId:EDITOR_VIEW }))
                                             }}>
                                Редактировать заведение
                            </ActionSheetItem>  :
                            <ActionSheetItem autoclose mode='default'
                                             onClick={()=>{
                                                 dispatch(setContentSaidParams({center:center}));
                                                 dispatch(setActiveView({ panelId:CENTER_EDIT_PANEL, viewId:EDITOR_VIEW }))
                                             }}>
                                Предложить исправление
                            </ActionSheetItem>}
                        {platform === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                    </ActionSheet>
                )
            )}/>
        </Div>
    );
};

PostActionsBottom.propTypes = {
    center: PropTypes.object
};

export default PostActionsBottom;
