import React, {Fragment, useEffect, useState} from 'react';
import {
    ActionSheet,
    ActionSheetItem,
    Avatar,
    Button,
    Cell,
    Div,
    Footer,
    Gallery,
    Group,
    Header,
    IOS,
    List,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelHeaderContent,
    Placeholder,
    PullToRefresh,
    RichCell,
    ScreenSpinner,
    Snackbar,
    Text,
    Title,
    usePlatform
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import {handleToPreviousPanel} from '../../../core/HistoryDispatcher';
import {useDispatch, useSelector} from 'react-redux';
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon24Recent from '@vkontakte/icons/dist/24/recent';
import Icon56CameraOffOutline from '@vkontakte/icons/dist/56/camera_off_outline';
import {declension, socialInfoTypes} from '../../../Components/renderUtils';
import {deleteComment, fetchComments} from '../../../state/reducers/content/actions';
import '../../../styles/index.scss';
import {
    abstractVkBridge,
    sendRequest,
    setModalView,
    setPopoutView,
    setVkSaidParams
} from '../../../state/reducers/vk/actions';
import {Line} from 'rc-progress';
import Stars from "../../../Components/Stars";
import {MODAL_CARD_REVIEW, MODAL_DETAILS} from "../../../constants/Modal";
import Timetable from "../../../Components/Timetable";
import NakedImage from "../../../Components/NakedImage";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import {setActiveView} from "../../../state/reducers/history/actions";
import {CENTER_EDIT_PANEL, MAPVIEW_PANEL} from "../../../constants/Panel";
import {EDITOR_VIEW, POST_VIEW} from "../../../constants/View";
import Icon24List from "@vkontakte/icons/dist/24/list";
import HideMore from "../../../Components/HideMore";


const Post = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const platform = usePlatform();
    const scheme = useSelector(state =>state.vk.scheme);
    const center = useSelector(state =>state.content.centers[state.content.active_post_index]);
    const postCommentState = useSelector(state=>state.content.active_post_comments);
    const user = useSelector(state =>state.vk.user);
    const snackbar = useSelector(state =>state.vk.snackbar);
    // const commentInputRef = useRef(null);
    const [fetching, setFetching] = useState(false);

    useEffect(()=>{
        dispatch(fetchComments(center));
    }, []);
    const commentCell = (cmt, key) => {
        return (
            <RichCell
                multiline
                key={key}
                before={<Avatar size={38} src={cmt.photo_100} />}
                text={<Fragment>
                    {cmt.stars ? <Stars stars={cmt.stars}/> : null}
                    <label>{cmt.text}</label>
                </Fragment>}
                onClick={()=>
                    dispatch(
                        setPopoutView(
                            <ActionSheet onClose={()=>{dispatch(setPopoutView(null))}}>
                                {user.id === cmt.vk_user_id ?
                                    <ActionSheetItem autoclose mode='destructive' onClick={()=>dispatch(deleteComment(cmt))}>
                                        Удалить
                                    </ActionSheetItem> :
                                    <ActionSheetItem autoclose mode='destructive' onClick={()=>{
                                        dispatch(sendRequest(2, {id:cmt.id}))
                                        dispatch(setVkSaidParams({snackbar: (
                                                <Snackbar
                                                    duration={2000}
                                                    layout="vertical"
                                                    onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                                    before={<Icon16DoneCircle fill={'var(--accent)'} />}
                                                >Ваша жалоба отправлена, мы проверим комментарий и сообщим о результатах.</Snackbar>
                                            )}))
                                    }}>
                                        Пожаловаться
                                    </ActionSheetItem>
                                }
                                {/*<ActionSheetItem autoclose mode='default' onClick={()=>{*/}
                                {/*    commentInputRef.current.focus()*/}
                                {/*}}>*/}
                                {/*    Ответить*/}
                                {/*</ActionSheetItem>*/}
                                {platform === IOS && <ActionSheetItem autoclose mode='cancel'>Отменить</ActionSheetItem>}
                            </ActionSheet>
                        )
                    )
                }
            >{`${cmt.first_name} ${cmt.last_name}`}</RichCell>
        )
    }
    return (
        <Panel id={id} className={'noPaddingBottom-Panel'}>
            {center && <Fragment>
                <PanelHeader left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>
                    <PanelHeaderContent
                        status={center.data.name}
                    >Отзывы</PanelHeaderContent>
                </PanelHeader>
                {/** TODO убрать это дерьмо **/}
                <PullToRefresh isFetching={fetching} onRefresh={()=>{
                    setFetching(true);
                    dispatch(fetchComments(center, ()=>setFetching(false)))
                }}>
                    {/** Image block **/}
                    {center.image ?
                        <Gallery
                            slideWidth="90%"
                            style={{ height: '180px' }}
                            align='center'
                            bullets={scheme === 'space_gray' ? 'light' : 'dark'}
                            onClick={()=>abstractVkBridge('VKWebAppShowImages', {images:center.image})}
                        >
                            { center.image.map((img_url,key)=><NakedImage key={key} url={img_url} size={160} />) }
                        </Gallery>
                        : <Placeholder
                            icon={<Icon56CameraOffOutline />}
                            header="Изображения отсутствуют"
                            action={<Button size="l" mode="tertiary"
                                            onClick={()=>dispatch(setActiveView({panelId:CENTER_EDIT_PANEL, viewId:EDITOR_VIEW}))}
                            ><label style={{textAlign:'center'}}>Вы можете добавить их в панели редактирования</label></Button>}
                        />}
                    {/** Content block **/}
                    <List>
                        <Cell multiline before={<Icon24Place fill={'var(--text_link'}/>}
                              onClick={()=>{
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
                        {/** Other content **/}
                        {Object.keys(center.data.info).map((info,key)=>socialInfoTypes(info, key, center))}
                    </List>
                    {/** Details icon **/}
                    {center.data.capabilities.length ?
                        <Cell before={<Icon24List fill={'var(--text_link'}/>}
                              onClick={()=>dispatch(setModalView(MODAL_DETAILS))}
                        >Подробнее</Cell> : null}
                    {/** Stars-block **/}
                    <Group separator={'auto'} header={<Header>Оценки пользователей</Header>}>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop:'20px' }}>
                            <Title weight={'semibold'} style={{fontSize:'32pt'}}>{center.stars.medium}</Title>
                            <Stars stars={Math.abs(center.stars.medium)} size={24}/>
                            <Title weight={'semibold'}>
                                {`${declension(center.comments, 'Отзыв', 'Отзыва', 'Отзывов')}: ${center.comments}`}
                            </Title>
                        </div>
                        <List>
                            {
                                center.stars.lines.map((star, key)=>(
                                    <Cell key={key} before={<Text style={{marginRight:'12px', color:'#7b848f'}}>{key+1}</Text>}>
                                        <Line percent={star} strokeWidth="4" strokeColor={'#fbbd00'}/>
                                    </Cell>
                                ))
                            }
                        </List>
                        {/** Кнопка оставить отзыв **/}
                        <Div style={{display: 'flex'}}>
                            <Button size={'l'} stretched mode="commerce"
                                    onClick={()=>dispatch(setModalView(MODAL_CARD_REVIEW))}>
                                {postCommentState.commented !== -1 ? 'Редактировать отзыв' : 'Оставить отзыв'}
                            </Button>
                        </Div>
                    </Group>
                    {/** Блок отзывов **/}
                    <Group separator={'auto'} header={<Header>Отзывы</Header>}>
                        { postCommentState.content.length ?
                            postCommentState.content.filter(cmt=>cmt.type).map((cmt)=>commentCell(cmt, cmt.id))
                            : <Footer>Оставьте отзыв первым</Footer>}
                    </Group>
                    {/** Блок вопросов **/}
                    {/*<Group separator={'auto'} header={<Header>Вопросы/Ответы</Header>}>*/}
                    {/*    {activePostComments.content.filter(cmt=>!cmt.type).map((cmt)=>commentCell(cmt, cmt.id))}*/}
                    {/*</Group>*/}
                    {/** Важно: блок с { position: fixed } находится не в потоке. В примере можно увидеть, что у блока с основным контентом есть паддинги. Они там не случайны. **/}
                    {/*<Div style={{ paddingTop: 30, paddingBottom: 40 }}/>*/}
                    {/** Comment-input block **/}
                    {/*<FixedLayout filled vertical='bottom'>*/}
                    {/*    <Separator wide={true}/>*/}
                    {/*    <WriteBar*/}
                    {/*        getRef={commentInputRef}*/}
                    {/*        placeholder='Ваш вопрос'*/}
                    {/*        after={*/}
                    {/*            <WriteBarIcon*/}
                    {/*                mode="send"*/}
                    {/*                onClick={()=>{*/}
                    {/*                    if (commentInputRef.current.value !== '') {*/}
                    {/*                        dispatch(appendComment(user, center, commentInputRef.current.value));*/}
                    {/*                        commentInputRef.current.value='';*/}
                    {/*                    }*/}
                    {/*                }}*/}
                    {/*            />*/}
                    {/*        }*/}
                    {/*    />*/}
                    {/*</FixedLayout>*/}
                    { snackbar ? snackbar : null}
                </PullToRefresh>
            </Fragment>}
        </Panel>
    );
};

Post.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Post;
