import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Div, Panel, PanelHeader, Placeholder, PullToRefresh, SimpleCell} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';
import {setActivePanel} from "../../../state/reducers/history/actions";
import {FIND_PANEL} from "../../../constants/Panel";
import axios from "axios";

// const CommentBox = (props)=> {
//     const { comments } = props;
//     const [show, setMore] = useState(false)
//
//     return (
//         {
//             comments.length > 4 ?
//
//         }
//     )
// }

const Tape = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const [fetching, setFetching] = useState(false);
    const [feed, setFeed] = useState([])

    const fetchFeed = (cb) =>{
        axios.get('https://kalukali.pw:3000/centers/feed', { params:{vk_start_params:window.location.search}
        }).then(({data})=>{
            console.log('fetch feed')
            setFeed(data);
            if (cb) cb();
        })
    }
    useEffect(()=>{
        fetchFeed()
    },[])

    return (
        <Panel id={id}>
            <PanelHeader>Лента</PanelHeader>
            <PullToRefresh isFetching={fetching} onRefresh={()=>{
                setFetching(true);
                fetchFeed(()=>setFetching(false))
            }}>
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
                        >Лайкните любое заведение чтобы получать от него<br/>интересные новости</Button>}
                        stretched
                    >Лента пуста...</Placeholder>}
            </PullToRefresh>
        </Panel>
    );
};

Tape.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Tape);
