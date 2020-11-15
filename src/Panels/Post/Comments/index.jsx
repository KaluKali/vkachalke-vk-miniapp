import React, {useEffect, useRef, useState} from 'react';
import {
    ActionSheet,
    ActionSheetItem,
    Avatar,
    Button,
    Cell,
    Div,
    FixedLayout,
    Group,
    Header,
    IOS,
    List,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PullToRefresh,
    RichCell,
    Separator,
    Text,
    Title,
    usePlatform,
    WriteBar,
    WriteBarIcon
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import {handleToPreviousPanel} from '../../../core/HistoryDispatcher';
import {useDispatch, useSelector} from 'react-redux';
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon24Recent from '@vkontakte/icons/dist/24/recent';
import Icon24Dropdown from '@vkontakte/icons/dist/24/dropdown';
import {declension, socialTypes} from '../../../Components/renderUtils';
import {appendComment, deleteComment, fetchComments} from '../../../state/reducers/content/actions';
import '../../../styles/index.scss';
import {setModalView, setPopoutView} from '../../../state/reducers/vk/actions';
import {Line} from 'rc-progress';
import Stars from "../../../Components/Stars";
import {MODAL_CARD_REVIEW} from "../../../constants/Modal";
import Timetable from "../../../Components/Timetable";


function commentCell(cmt, user, key, dispatch, platform) {
    return (
        <RichCell
            multiline
            key={key}
            before={<Avatar size={38} src={cmt.photo_100} />}
            text={<div>
                {cmt.stars ? <Stars stars={cmt.stars}/> : null}
                <label>{cmt.text}</label>
            </div>}
            onClick={()=>
                dispatch(
                    setPopoutView(
                        user.id === cmt.vk_user_id
                            ? <ActionSheet onClose={()=>{dispatch(setPopoutView(null))}}>
                                <ActionSheetItem autoclose mode='destructive' onClick={()=>dispatch(deleteComment(cmt))}>
                                    Удалить
                                </ActionSheetItem>
                                {platform === IOS && <ActionSheetItem autoclose mode='cancel'>Отменить</ActionSheetItem>}
                            </ActionSheet>
                            : <ActionSheet onClose={()=>{dispatch(setPopoutView(null))}}>
                                <ActionSheetItem autoclose mode='destructive'>
                                    Пожаловаться
                                </ActionSheetItem>
                                {platform === IOS && <ActionSheetItem autoclose mode='cancel'>Отменить</ActionSheetItem>}
                            </ActionSheet>
                    )
                )
            }
        >{`${cmt.first_name} ${cmt.last_name}`}</RichCell>
    )
}

const Post = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const platform = usePlatform();
    const [isTimeTableOpened, setTimeTableOpened] = useState(false);

    const commentInputRef = useRef(null);
    const [fetching, setFetching] = useState(false);

    const center = useSelector(state =>state.content.centers[state.content.active_post_index]);
    const activePostComments = useSelector(state=>state.content.active_post_comments);
    const user = useSelector(state =>state.vk.user);

    useEffect(()=>{
        dispatch(fetchComments(center));
        return ()=>{};
    }, []);
    return (
        <Panel id={id} className={'noPaddingBottom-Panel'}>
            <PanelHeader left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>{center.data.name}</PanelHeader>
            {/** TODO убрать это дерьмо **/}
            <PullToRefresh isFetching={fetching} onRefresh={()=>{
                setFetching(true);
                dispatch(fetchComments(center, ()=>setFetching(false)))
            }}>
                {/** Image block **/}
                {center.image ?
                    <Div
                        style={{
                            backgroundPosition: 'center center',
                            backgroundSize: 'contain',
                            height:'140px',
                            backgroundImage:`url(${center.image})`,
                            backgroundRepeat: 'no-repeat',
                        }}/>
                    : null}
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
                    {isTimeTableOpened ? <Timetable hours={center.data.hours}/> : null}
                    {Object.keys(center.data.info).map((info,key)=>socialTypes(info, key, center))}
                </List>
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
                            )).reverse()
                        }
                    </List>
                    <Div style={{display: 'flex'}}>
                        <Button size={'l'} stretched mode="commerce" onClick={()=>dispatch(setModalView(MODAL_CARD_REVIEW))}>Оставить отзыв</Button>
                    </Div>
                </Group>
                {/** Блок отзывов **/}
                <Group separator={'auto'} header={<Header>Отзывы</Header>}>
                    {activePostComments.content.filter(cmt=>cmt.type).map((cmt)=>commentCell(cmt, user,cmt.id, dispatch, platform))}
                </Group>
                {/** Блок вопросов **/}
                <Group separator={'auto'} header={<Header>Вопросы/Ответы</Header>}>
                    {activePostComments.content.filter(cmt=>!cmt.type).map((cmt, key)=>commentCell(cmt, user,cmt.id, dispatch, platform))}
                </Group>
                {/** Важно: блок с { position: fixed } находится не в потоке. В примере можно увидеть, что у блока с основным контентом есть паддинги. Они там не случайны. **/}
                <Div style={{ paddingTop: 30, paddingBottom: 40 }}/>
                {/** Comment-input block **/}
                <FixedLayout filled vertical='bottom'>
                    <Separator wide={true}/>
                    <WriteBar
                        getRef={commentInputRef}
                        placeholder='Ваш вопрос'
                        after={
                            <WriteBarIcon
                                mode="send"
                                onClick={()=>{
                                    if (commentInputRef.current.value !== '') {
                                        dispatch(appendComment(user, center, commentInputRef.current.value));
                                        commentInputRef.current.value='';
                                    }
                                }}
                            />
                        }
                    />
                </FixedLayout>
            </PullToRefresh>
        </Panel>
    );
};

Post.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Post;
