import React, {useState} from "react";
import PropTypes from "prop-types";
import Icon20Like from "@vkontakte/icons/dist/20/like";
import {postLiking, setCenterSaidParams} from "../../state/reducers/content/actions";
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

const PostActionsBottom = (props) => {
    const { center, isPost } = props;
    const dispatch = useDispatch()
    const platform = usePlatform();
    const [likeState, setLiked] = useState({liked:center.liked, likes:center.likes})
    const user = useSelector(state =>state.vk.user);

    return (
        <Div style={{display:'flex', alignItems:'stretch'}}>
            {/** Like **/}
            <div style={{display:'flex'}} onClick={()=>
                postLiking(center.id)
                    .then(({data})=>setLiked(data))
            }>
                {likeState.liked ? <Icon20Like fill={'var(--text_link)'} style={{alignSelf:'center', marginRight:'5px'}}/>
                    : <Icon20LikeOutline fill={'var(--dynamic_gray)'} style={{alignSelf:'center', marginRight:'5px'}}/>}
                <label style={{ color:likeState.liked ? 'var(--text_link)' : 'var(--dynamic_gray)',marginRight:'15px', alignSelf:'center' }}>{likeState.likes}</label>
            </div>
            {/** Comment **/}
            {isPost &&
            <div style={{display:'flex'}} onClick={()=>{
                dispatch(setCenterSaidParams({ center:center }));
                dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
            }}>
                <Icon20CommentOutline fill={'var(--dynamic_gray)'} style={{alignSelf:'center', marginRight:'5px'}}/>
                <label style={{ color:'var(--dynamic_gray)',marginRight:'15px', alignSelf:'center' }}>{center.comments}</label>
            </div>}
            {/** Share **/}
            <Icon28ShareOutline fill={'var(--dynamic_gray)'} width={24} height={24} style={{alignSelf:'center', marginRight:'auto'}}
                                onClick={()=>{
                                    let images_filtered = center.image ? center.image.filter(img=>img) : null
                                    if (images_filtered && images_filtered.length) {
                                        dispatch(setVkSaidParams({popout:(
                                                <Alert
                                                    actionsLayout="horizontal"
                                                    actions={[{
                                                        title: 'Отмена',
                                                        autoclose: true,
                                                        mode: 'destructive'
                                                    },{
                                                        title: 'Подтвердить',
                                                        autoclose: true,
                                                        mode: 'default',
                                                        action: () =>{
                                                            const err_fc=()=>dispatch(setVkSaidParams({popout:null}))
                                                            dispatch(setVkSaidParams({popout:<ScreenSpinner />}))
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
                                                        },
                                                    }]}
                                                    onClose={()=>dispatch(setPopoutView(null))}
                                                >
                                                    <h2>Получение прав</h2>
                                                    <p>Для размещения заведения нам нужно разрешение на фотографии и стену</p>
                                                </Alert>
                                            )}))
                                    } else appShowWallPostBox(center)
                                }}/>
            {/** More **/}
            <Icon24MoreHorizontal fill={'var(--dynamic_gray)'} style={{alignSelf:'center'}} onClick={()=>dispatch(
                setPopoutView(
                    <ActionSheet onClose={()=>dispatch(setPopoutView(null))}>
                        { center.actual===2 && center.owner !== user.id &&
                        <ActionSheetItem autoclose mode='destructive' onClick={()=>{
                            dispatch(sendRequest(0, {id:center.id}))
                            dispatch(setVkSaidParams({snackbar: (
                                    <Snackbar
                                        duration={3000}
                                        layout="vertical"
                                        onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                        before={<Icon16DoneCircle fill={'var(--accent)'} />}
                                    >Ваша жалоба отправлена, мы проверим заведение и сообщим о результатах.</Snackbar>
                                )}))
                        }}>
                            Пожаловаться
                        </ActionSheetItem>  }
                        { center.actual===0 &&
                        <ActionSheetItem autoclose mode='default' onClick={()=>dispatch(setModalView(MODAL_CARD_OWNER))}>
                            Я владелец заведения
                        </ActionSheetItem> }
                        { center.owner === user.id ?
                            <ActionSheetItem autoclose mode='default'
                                             onClick={()=>{
                                                 dispatch(setCenterSaidParams({center:center}));
                                                 dispatch(setActiveView({ panelId:CENTER_EDIT_PANEL, viewId:EDITOR_VIEW }))
                                             }}>
                                Редактировать заведение
                            </ActionSheetItem>  :
                            <ActionSheetItem autoclose mode='default'
                                             onClick={()=>{
                                                 dispatch(setCenterSaidParams({center:center}));
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
