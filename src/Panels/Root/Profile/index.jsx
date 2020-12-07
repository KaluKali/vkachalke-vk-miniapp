import React, {useEffect, useState} from "react";
import {Avatar, Counter, Group, Panel, PanelHeader, PullToRefresh, SimpleCell, Title} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import Icon24NarrativeActiveOutline from '@vkontakte/icons/dist/24/narrative_active_outline';
import Icon24WriteOutline from '@vkontakte/icons/dist/24/write_outline';
import Icon24Article from '@vkontakte/icons/dist/24/article';
import Icon28PaletteOutline from '@vkontakte/icons/dist/28/palette_outline';
import {changeScheme, fetchServerUser, setVkUser} from "../../../state/reducers/vk/actions";
import Icon24Dropdown from '@vkontakte/icons/dist/24/dropdown';
import {setActivePanel} from "../../../state/reducers/history/actions";
import {
    CHANGED_CENTERS_PANEL,
    CITY_SELECTION_PANEL,
    LIKED_CENTERS_PANEL,
    REVIEWED_CENTERS_PANEL
} from "../../../constants/Panel";
import * as types from "../../../state/reducers/vk/types";


const Profile = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const user = useSelector(state=>state.vk.user);
    const user_server = useSelector(state=>state.vk.user_server);
    const [fetching, setFetching] = useState(false);
    const scheme = useSelector(state=>state.vk.scheme);
    const snackbar = useSelector(state =>state.vk.snackbar);

    useEffect(()=>{
        fetchServerUser()
            .then(({data})=>{
                dispatch(setVkUser(data, types.SET_SERVER_USER));
                setFetching(false)
            }, (err)=>setFetching(false))
    }, [fetching])

    return (
        <Panel id={id}>
            <PanelHeader>Профиль</PanelHeader>
            <PullToRefresh isFetching={fetching} onRefresh={()=>setFetching(true)}>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop:'20px' }}>
                    <Avatar size={100} src={user.photo_200} shadow={false}>
                        <Icon28PaletteOutline className={'withCircle'} fill={'var(--text_link)'} style={{order: 999,marginLeft:'auto', marginBottom:'auto'}}
                                           onClick={()=>dispatch(changeScheme(scheme, true))} />
                    </Avatar>
                    <Title weight={'semibold'} style={{fontSize:'16pt'}}>{`${user.first_name} ${user.last_name}`}</Title>
                    <div style={{display:'flex', alignContent:'space-around', alignItems:'center'}} onClick={()=>dispatch(setActivePanel(CITY_SELECTION_PANEL))}>
                        <Title weight={'semibold'} style={{fontSize:'12pt'}}>{user_server.city}</Title><Icon24Dropdown/>
                    </div>
                </div>
                <Group separator={'auto'}>
                    <SimpleCell
                        onClick={()=>dispatch(setActivePanel(LIKED_CENTERS_PANEL))}
                        before={<Icon24NarrativeActiveOutline fill={'var(--text_link)'}/>}
                        indicator={<Counter mode={user_server.likes ? 'primary' : 'secondary'}>{user_server.likes}</Counter>}
                    >{`Отметок "понравилось"`}</SimpleCell>
                    <SimpleCell
                        onClick={()=>dispatch(setActivePanel(REVIEWED_CENTERS_PANEL))}
                        before={<Icon24Article fill={'var(--text_link)'}/>}
                        indicator={<Counter mode={user_server.reviews ? 'primary' : 'secondary'}>{user_server.reviews}</Counter>}
                    >{`Отзывы`}</SimpleCell>
                    <SimpleCell
                        onClick={()=>dispatch(setActivePanel(CHANGED_CENTERS_PANEL))}
                        before={<Icon24WriteOutline fill={'var(--text_link)'}/>}
                        indicator={<Counter mode={user_server.changes ? 'primary' : 'secondary'}>{user_server.changes}</Counter>}
                    >{`Изменения мест`}</SimpleCell>

                    {/*<Cell*/}
                    {/*    before={<Icon24Education fill={'var(--text_link)'}/>}*/}
                    {/*    textLevel="primary"*/}
                    {/*>{`Вопросы/Ответы: ${user_server.answers_and_questions}`}</Cell>*/}
                </Group>
            </PullToRefresh>
            { snackbar ? snackbar : null }
        </Panel>
    );
};

Profile.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Profile);
