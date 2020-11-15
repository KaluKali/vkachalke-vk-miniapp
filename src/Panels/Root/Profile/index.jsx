import React, {useState} from "react";
import {Avatar, Group, MiniInfoCell, Panel, PanelHeader, PullToRefresh, Title} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import Icon24NarrativeActiveOutline from '@vkontakte/icons/dist/24/narrative_active_outline';
import Icon24WriteOutline from '@vkontakte/icons/dist/24/write_outline';
import Icon24Education from '@vkontakte/icons/dist/24/education';
import Icon24Article from '@vkontakte/icons/dist/24/article';
import Icon28PaletteOutline from '@vkontakte/icons/dist/28/palette_outline';
import {changeScheme, fetchServerUser} from "../../../state/reducers/vk/actions";

const Profile = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const user = useSelector(state=>state.vk.user);
    const user_server = useSelector(state=>state.vk.user_server);
    const [fetching, setFetching] = useState(false);
    const scheme = useSelector(state=>state.vk.scheme);

    return (
        <Panel id={id}>
            <PanelHeader>Профиль</PanelHeader>
            <PullToRefresh isFetching={fetching} onRefresh={()=>{
                setFetching(true);
                dispatch(fetchServerUser(()=>setFetching(false)))
            }}>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop:'20px' }}>
                    <Avatar shadow size={100} src={user.photo_100} >
                        <Icon28PaletteOutline className={'withCircle'} fill={'#008dff'} style={{order: 999,marginLeft:'auto', marginBottom:'auto'}}
                                           onClick={()=>dispatch(changeScheme(scheme, true))} />
                    </Avatar>
                    <Title weight={'semibold'} style={{fontSize:'16pt'}}>{`${user.first_name} ${user.last_name}`}</Title>
                    <Title weight={'semibold'} style={{fontSize:'12pt'}}>{user.city.title}</Title>
                </div>
                <Group separator={'auto'}>
                    <MiniInfoCell
                        before={<Icon24NarrativeActiveOutline />}
                        textLevel="primary"
                    >{`Отметок "понравилось": ${user_server.likes}`}</MiniInfoCell>
                    <MiniInfoCell
                        before={<Icon24Article />}
                        textLevel="primary"
                    >{`Отзывы: ${user_server.reviews}`}</MiniInfoCell>
                    <MiniInfoCell
                        before={<Icon24WriteOutline />}
                        textLevel="primary"
                    >{`Изменение мест: ${user_server.changes}`}</MiniInfoCell>
                    <MiniInfoCell
                        before={<Icon24Education />}
                        textLevel="primary"
                    >{`Вопросы/Ответы: ${user_server.answers_and_questions}`}</MiniInfoCell>
                </Group>
            </PullToRefresh>
        </Panel>
    );
};

Profile.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Profile);
