import React from "react";
import {postLiking, setCenterSaidParams} from "../../state/reducers/content/actions";
import {useDispatch, useSelector} from "react-redux";
import {
    ActionSheet,
    ActionSheetItem,
    Alert,
    Card,
    Cell,
    Div,
    IOS,
    List,
    ScreenSpinner,
    Snackbar,
    usePlatform
} from "@vkontakte/vkui";
import Icon20LikeOutline from "@vkontakte/icons/dist/20/like_outline";
import Icon24MoreHorizontal from "@vkontakte/icons/dist/24/more_horizontal";
import Icon28ShareOutline from '@vkontakte/icons/dist/28/share_outline';
import Icon20CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon24Recent from '@vkontakte/icons/dist/24/recent';
import Icon20Like from '@vkontakte/icons/dist/20/like';
import {setActiveView} from "../../state/reducers/history/actions";
import {CENTER_EDIT_PANEL, MAPVIEW_PANEL, POST_PANEL} from "../../constants/Panel";
import {EDITOR_VIEW, POST_VIEW} from "../../constants/View";
import {socialInfoTypes} from "../renderUtils";
import {
    abstractVkBridge,
    appShowWallPostBox,
    fetchPhoto,
    sendRequest,
    setModalView,
    setPopoutView,
    setVkSaidParams
} from "../../state/reducers/vk/actions";
import Timetable from "../Timetable";
import NakedImage from "../NakedImage";
import {MODAL_CARD_OWNER} from "../../constants/Modal";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import CenterHeader from "../CenterHeader";
import HideMore from "../HideMore";
// todo transferal to react-table
const FeedSnippet = (props) => {
    const { id, center } = props;
    const dispatch = useDispatch();
    const platform = usePlatform();
    const liked = useSelector(state =>state.content.centers[id].liked);
    const user = useSelector(state =>state.vk.user);

    return (
        <Div>
            <Card mode={'shadow'}>
                {/** Avatar block Math.abs(center.avg)**/}
                <CenterHeader
                    stars={Math.abs(center.stars.medium)}
                    actual={center.actual}
                    avatar={center.avatar}
                    onClick={() => abstractVkBridge('VKWebAppCopyText', {'text': center.data.name})}
                >
                    {center.data.name}
                </CenterHeader>
                {/** Content block **/}
                <List>
                    {/** Map icon **/}
                    <Cell multiline before={<Icon24Place fill={'var(--text_link'}/>}
                          onClick={()=>{
                              dispatch(setCenterSaidParams({active_post_index: id}));
                              dispatch(setActiveView({panelId:MAPVIEW_PANEL,viewId:POST_VIEW}))
                              dispatch(setPopoutView(<ScreenSpinner />))
                          }}
                    >
                        {`${center.data.info.address}${center.data.info.index ? `, ${center.data.info.index}` : ''}`}
                    </Cell>
                    {/** Timetable icon **/}
                    {center.data.hours.length ?
                        <HideMore icon={<Icon24Recent fill={'var(--text_link'}/>} text={'Расписание'}>
                            <Timetable hours={center.data.hours}/>
                        </HideMore>
                        : null}
                    {/** Other info **/}
                    {Object.keys(center.data.info).map((info,key)=>socialInfoTypes(info, key, center))}
                    {/** Image block **/}
                    {/** todo Чето сделать с referrer policy **/}
                    {center.image && <NakedImage url={center.image[0]} size={140} onClick={()=>abstractVkBridge('VKWebAppShowImages', {images:center.image})}/>}
                </List>
                {/** Action block **/}
                <Div style={{display:'flex', alignItems:'stretch'}}>
                    {/** Like **/}
                    {liked ? <Icon20Like fill={'var(--text_link)'} style={{alignSelf:'center', marginRight:'5px'}}
                                         onClick={()=>dispatch(postLiking(center.id, id))}/>
                        : <Icon20LikeOutline fill={'var(--dynamic_gray)'} style={{alignSelf:'center', marginRight:'5px'}}
                                             onClick={()=>dispatch(postLiking(center.id, id))}/>
                    }
                    <label style={{ color:center.liked ? 'var(--text_link)' : 'var(--dynamic_gray)',marginRight:'15px', alignSelf:'center' }}>{center.likes}</label>
                    {/** Comment **/}
                    <Icon20CommentOutline fill={'var(--dynamic_gray)'} style={{alignSelf:'center', marginRight:'5px'}}
                                          onClick={()=>{
                                              dispatch(setCenterSaidParams({active_post_index: id}));
                                              dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                                          }}/>
                    <label style={{ color:'var(--dynamic_gray)',marginRight:'15px', alignSelf:'center' }}>{center.comments}</label>
                    {/** Share **/}
                    <Icon28ShareOutline fill={'var(--dynamic_gray)'} width={24} height={24} style={{alignSelf:'center', marginRight:'auto'}}
                                        onClick={()=>{
                                            if (center.image) {
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
                                                                    dispatch(setVkSaidParams({popout:<ScreenSpinner />}))
                                                                    abstractVkBridge('VKWebAppGetAuthToken',
                                                                        {
                                                                            app_id: 7636479,
                                                                            scope: "photos"},
                                                                        (data)=>{
                                                                            abstractVkBridge('VKWebAppCallAPIMethod',
                                                                                {
                                                                                    method:'photos.getWallUploadServer',
                                                                                    request_id:'pU1',
                                                                                    params:{
                                                                                        v:'5.126',
                                                                                        access_token:data.access_token
                                                                                    }
                                                                                },(upload_link)=>{
                                                                                    fetchPhoto(center.image[0], upload_link.response,
                                                                                        (photo_params)=>{
                                                                                            abstractVkBridge('VKWebAppCallAPIMethod',
                                                                                                {
                                                                                                    method:'photos.saveWallPhoto',
                                                                                                    request_id:'pS1',
                                                                                                    params:{
                                                                                                        v:'5.126',
                                                                                                        access_token:data.access_token,
                                                                                                        ...photo_params
                                                                                                    }
                                                                                                }, (photo_data)=>{
                                                                                                    dispatch(setPopoutView(null))
                                                                                                    appShowWallPostBox(center, `photo${photo_data.response[0].owner_id}_${photo_data.response[0].id}`)
                                                                                                })
                                                                                        })
                                                                                })
                                                                        })
                                                                },
                                                            }]}
                                                            onClose={()=>dispatch(setPopoutView(null))}
                                                        >
                                                            <h2>Получение прав на фотографии</h2>
                                                            <p>Для загрузки фото-превью заведения нам нужно разрешение на фотографии, чтобы разместить их на вашу стену</p>
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
                                                     dispatch(setCenterSaidParams({active_post_index: id}));
                                                     dispatch(setActiveView({ panelId:CENTER_EDIT_PANEL, viewId:EDITOR_VIEW }))
                                                 }}>
                                    Редактировать заведение
                                </ActionSheetItem>  :
                                    <ActionSheetItem autoclose mode='default'
                                                     onClick={()=>{
                                                         dispatch(setCenterSaidParams({active_post_index: id}));
                                                         dispatch(setActiveView({ panelId:CENTER_EDIT_PANEL, viewId:EDITOR_VIEW }))
                                                     }}>
                                        Предложить исправление
                                    </ActionSheetItem>}
                                {platform === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                            </ActionSheet>
                        )
                    )}/>
                </Div>
            </Card>
        </Div>
    );
};


export default React.memo(FeedSnippet);
