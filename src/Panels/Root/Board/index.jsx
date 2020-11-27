import React, {useState} from "react";
import {
    Avatar,
    Banner,
    Button,
    Card,
    Div,
    Group,
    Panel,
    PanelHeader,
    Placeholder,
    PullToRefresh,
    SimpleCell
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {setActivePanel} from "../../../state/reducers/history/actions";
import {FIND_PANEL} from "../../../constants/Panel";
import {fetchFeed} from "../../../state/reducers/content/actions";
import Icon56InboxOutline from "@vkontakte/icons/dist/56/inbox_outline";
import Link from "@vkontakte/vkui/dist/components/Link/Link";

const Board = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const [fetching, setFetching] = useState(false);
    const feed = useSelector(state=>state.content.feed)
    const user_server = useSelector(state=>state.vk.user_server)

    return (
        <Panel id={id}>
            <PanelHeader>Главная</PanelHeader>
            <PullToRefresh isFetching={fetching} onRefresh={()=>{
                setFetching(true);
                dispatch(fetchFeed(()=>setFetching(false)))
            }}>
                <Group separator={'hide'}>
                    <Link href={'https://vk.com/write-198013296'} target={'_blank'}>
                    <Banner
                        mode="image"
                        size="m"
                        asideMode={'expand'}
                        header={<span>Вы владелец бизнеса?</span>}
                        subheader="Добавьте профиль заведения в каталог"
                        background={<div style={{backgroundImage: 'linear-gradient(152deg, rgba(34,195,150,0.9) 0%, rgba(192,253,45,0.9) 100%)'}}/>}
                    /></Link>
                    <Banner
                        mode="image"
                        size="m"
                        header={<span>Поиск спортивных заведений</span>}
                        subheader="Ищите спорт в вашем городе"
                        background={<div className={'find'}/>}
                        actions={<Button
                            mode="overlay_primary"
                            size="l"
                            onClick={()=>dispatch(setActivePanel(FIND_PANEL))}
                        >Смотреть</Button>}
                    />
                </Group>
                {feed.length
                    ? feed.map(post=>(
                        <Div key={post.id}>
                            <Card mode={'shadow'}>
                                <SimpleCell before={<Avatar size={40} src={post.avatar}/>}>{post.name}</SimpleCell>
                                <Div>{post.text}</Div>
                            </Card>
                        </Div>
                    ))
                    : <Placeholder
                        icon={<Icon56InboxOutline />}
                        action={<Button size="l" mode="tertiary"
                                        onClick={()=>dispatch(setActivePanel(FIND_PANEL))}
                        ><label style={{textAlign:'center'}}>
                            {user_server.likes <= 0 ? 'Лайкните любое заведение чтобы получать от него интересные новости'
                                : 'Заведения не разместили каких либо новостей'}
                        </label></Button>}
                    >Лента пуста...</Placeholder>}
            </PullToRefresh>
        </Panel>
    );
};

Board.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Board);
