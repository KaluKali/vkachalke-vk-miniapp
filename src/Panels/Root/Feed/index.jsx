import React, {useEffect, useState, } from "react";
import {Panel, PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {handleToPreviousPanel} from "../../../core/HistoryDispatcher";
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import FeedSnippet from "../../../Components/FeedSnippet";

const Feed = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const user = useSelector(state =>state.vk.user);

    useEffect(()=>{
        axios.get('http://192.168.1.64:3000/centers', { params: {
                city:user.city.title,
                limit:10
            }
        }).then(data=>setData(data.data))
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Главная</PanelHeader>
            {data.map((center, key)=><FeedSnippet key={key} center={center.data} likes={0} comments={0} />)}
        </Panel>
    );
};

Feed.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Feed;
