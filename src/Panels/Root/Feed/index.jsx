import React, {useEffect, useState} from "react";
import {FixedLayout, Panel, PanelHeader, Separator, Tabs, TabsItem} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector,} from "react-redux";
import FeedSnippet from "../../../Components/FeedSnippet";
import {fetchCenters} from "../../../state/reducers/content/actions";
import {useLazyLoading} from "../../../Components/useLazyLoading";
import {useLayoutEffect} from "react/cjs/react.production.min";

const OFFSET_DATA = 10;

const Feed = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const user = useSelector(state =>state.vk.user);
    const centers = useSelector(state =>state.content.centers);
    const [dataOffset, setOffset] = useState(0);


    const appendItems = () =>{
        setOffset(dataOffset+OFFSET_DATA);
        dispatch(fetchCenters(user.city.title, OFFSET_DATA, dataOffset+OFFSET_DATA+1));
    };

    useLazyLoading({
        onIntersection: appendItems,
        delay: 1200,
        marginFromBottom:20
    });

    useEffect(()=>{
        dispatch(fetchCenters(user.city.title, OFFSET_DATA));
        return ()=>{};
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader separator={false}>Главная</PanelHeader>
            {centers.map((center, key)=><FeedSnippet key={key} id={key} center={center}/>)}
        </Panel>
    );
};

Feed.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Feed;
