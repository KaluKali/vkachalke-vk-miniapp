import React, {useState} from "react";
import {postLiking, setCenterSaidParams} from "../../state/reducers/content/actions";
import {useDispatch, useSelector} from "react-redux";
import {
    ActionSheet,
    ActionSheetItem,
    Alert,
    Avatar,
    Card,
    Cell,
    Div,
    IOS,
    List,
    RichCell,
    usePlatform
} from "@vkontakte/vkui";
import Icon20LikeOutline from "@vkontakte/icons/dist/20/like_outline";
import Icon24MoreHorizontal from "@vkontakte/icons/dist/24/more_horizontal";
import Icon28ShareOutline from '@vkontakte/icons/dist/28/share_outline';
import Icon20CommentOutline from '@vkontakte/icons/dist/24/comment_outline';
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon24Recent from '@vkontakte/icons/dist/24/recent';
import Icon24Dropdown from '@vkontakte/icons/dist/24/dropdown';
import Icon20Like from '@vkontakte/icons/dist/20/like';
import Stars from "../Stars";
import {setActiveView} from "../../state/reducers/history/actions";
import {CENTER_EDIT_PANEL, POST_PANEL} from "../../constants/Panel";
import {EDITOR_VIEW, POST_VIEW} from "../../constants/View";
import {IconViewInfoState, renderViewInfoState, socialTypes} from "../renderUtils";
import {
    abstractVkBridge,
    appShowWallPostBox,
    fetchPhoto,
    setPopoutView,
    setVkSaidParams
} from "../../state/reducers/vk/actions";
import Timetable from "../Timetable";
// todo transferal to react-table
// todo problem with redraw, when dispatch(setPopoutView(null))
const FeedSnippet = (props) => {
    const { id, center} = props;
    const dispatch = useDispatch();
    const platform = usePlatform();
    const liked = useSelector(state =>state.content.centers[id].liked);
    const user = useSelector(state =>state.vk.user);
    const [isTimeTableOpened, setTimeTableOpened] = useState(false);

    const onNameClick = () => {
        dispatch(abstractVkBridge('VKWebAppCopyText', {'text': center.data.name}))
    };

    return (
        <Div>
            <Card mode={'shadow'}>
                {/** Avatar block Math.abs(center.avg)**/}
                { center.avatar ?
                    <RichCell multiline
                              onClick={()=>onNameClick()}
                              before={<Avatar size={40} src={center.avatar} />}
                              caption={renderViewInfoState(center.actual)}
                              after={IconViewInfoState(center.actual)}
                              text={<Stars stars={Math.abs(center.stars.medium)}/>}
                    >{center.data.name}</RichCell> :
                    <RichCell multiline
                              onClick={()=>onNameClick()}
                              caption={renderViewInfoState(center.actual)}
                              after={IconViewInfoState(center.actual)}
                              text={<Stars stars={Math.abs(center.stars.medium)}/>}
                    >{center.data.name}</RichCell>}
                {/** Content block **/}
                <List>
                    <Cell multiline before={<Icon24Place />}>{`${center.data.info.address}, ${center.data.info.index ? center.data.info.index : ''}`}</Cell>
                    {center.data.hours.length ?
                        <Cell
                            before={<Icon24Recent />}
                            asideContent={<Icon24Dropdown style={{ transform: `rotate(${isTimeTableOpened ? '180deg' : '0'})` }}/>}
                            onClick={()=>(isTimeTableOpened ? setTimeTableOpened(false):setTimeTableOpened(true))}
                        >Расписание</Cell>
                        : null}
                    {isTimeTableOpened && <Timetable hours={center.data.hours}/>}
                    {Object.keys(center.data.info).map((info,key)=>socialTypes(info, key, center))}
                    {/** Image block **/}
                    {/** todo Чето сделать с referrer policy **/}
                    {center.image ?
                        <div
                            style={{
                                backgroundPosition: 'center center',
                                backgroundSize: 'contain',
                                height:'140px',
                                backgroundImage:`url(${center.image})`,
                                backgroundRepeat: 'no-repeat',
                            }}/>
                        : null}
                </List>
                {/** Action block **/}
                <Div style={{display:'flex', alignItems:'stretch'}}>
                    {/** Like **/}
                    {liked ? <Icon20Like fill={'#008dff'} style={{alignSelf:'center', marginRight:'5px'}}
                                         onClick={()=>dispatch(postLiking(center.id, id))}/>
                        : <Icon20LikeOutline fill={'#99A2AD'} style={{alignSelf:'center', marginRight:'5px'}}
                                             onClick={()=>dispatch(postLiking(center.id, id))}/>
                    }
                    <label style={{ color:center.liked ? '#008dff' : '#818C99',marginRight:'15px', alignSelf:'center' }}>{center.likes}</label>
                    {/** Comment **/}
                    <Icon20CommentOutline fill={'#99A2AD'} style={{alignSelf:'center', marginRight:'5px'}}
                                          onClick={()=>{
                                              dispatch(setCenterSaidParams({active_post_index: id}));
                                              dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                                          }}/>
                    <label style={{ color:'#818C99',marginRight:'15px', alignSelf:'center' }}>{center.comments}</label>
                    {/** Share **/}
                    <Icon28ShareOutline fill={'#99A2AD'} width={24} height={24} style={{alignSelf:'center', marginRight:'auto'}}
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
                                                                title: 'Ок',
                                                                autoclose: true,
                                                                mode: 'default',
                                                                action: () =>{
                                                                    dispatch(abstractVkBridge('VKWebAppGetAuthToken',
                                                                        {
                                                                            app_id: 7636479,
                                                                            scope: "photos"},
                                                                        (data)=>{
                                                                            dispatch(abstractVkBridge('VKWebAppCallAPIMethod',
                                                                                {
                                                                                    method:'photos.getWallUploadServer',
                                                                                    request_id:'pU1',
                                                                                    params:{
                                                                                        v:'5.126',
                                                                                        access_token:data.access_token
                                                                                    }
                                                                                },(upload_link)=>{
                                                                                    dispatch(fetchPhoto(center,data.access_token, upload_link.response,
                                                                                        (photo_params)=>{
                                                                                            dispatch(abstractVkBridge('VKWebAppCallAPIMethod',
                                                                                                {
                                                                                                    method:'photos.saveWallPhoto',
                                                                                                    request_id:'pS1',
                                                                                                    params:{
                                                                                                        v:'5.126',
                                                                                                        access_token:data.access_token,
                                                                                                        ...photo_params
                                                                                                    }
                                                                                                }, (photo_data)=>{
                                                                                                    dispatch(appShowWallPostBox(center, `photo${photo_data.response[0].owner_id}_${photo_data.response[0].id}`))
                                                                                                }))
                                                                                        }))
                                                                                }))
                                                                        }))
                                                                },
                                                            }]}
                                                            onClose={()=>dispatch(setVkSaidParams({popout:null}))}
                                                        >
                                                            <h2>Получение прав на фотографии</h2>
                                                            <p>Для загрузки фото-превью заведения нам нужно разрешение на фотографии, чтобы загрузить их на вашу стену</p>
                                                        </Alert>
                                                    )}))
                                            } else {
                                                dispatch(appShowWallPostBox(center))
                                            }
                                        }}/>
                    {/** More **/}
                    <Icon24MoreHorizontal fill={'#99A2AD'} style={{alignSelf:'center'}} onClick={()=>dispatch(
                        setPopoutView(
                            <ActionSheet onClose={()=>dispatch(setPopoutView(null))}>
                                { center.actual===2 && center.owner !== user.id &&
                                <ActionSheetItem autoclose mode='destructive'>
                                    Пожаловаться
                                </ActionSheetItem>  }
                                { center.actual===0 &&
                                <ActionSheetItem autoclose mode='default'>
                                    Я владелец заведения
                                </ActionSheetItem> }
                                { center.owner === user.id &&
                                <ActionSheetItem autoclose mode='default'
                                                 onClick={()=>{
                                                     dispatch(setCenterSaidParams({active_post_index: id}));
                                                     dispatch(setActiveView({ panelId:CENTER_EDIT_PANEL, viewId:EDITOR_VIEW }))
                                                 }}>
                                    Редактировать заведение
                                </ActionSheetItem> }
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
