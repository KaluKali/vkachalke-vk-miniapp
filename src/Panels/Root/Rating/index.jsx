import React, {useEffect, useState} from "react";
import {Footer, Panel, PanelHeader, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchRatingCenters, setCenterSaidParams} from "../../../state/reducers/content/actions";
import CenterHeader from "../../../Components/CenterHeader";
import {setActiveView} from "../../../state/reducers/history/actions";
import {POST_PANEL} from "../../../constants/Panel";
import {POST_VIEW} from "../../../constants/View";


const Rating = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const user_city = useSelector(state =>state.vk.user_server.city);
    const [dataOffset, setDataOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [centers, setCenters] = useState([])

    useEffect(()=>{
        fetchRatingCenters(user_city,10,0,({data}, err)=>{
            if (!err) {
                setCenters(data)
                !data.length && setHasMore(false)
            } else {
                setHasMore(false)
            }
        })
    },[])

    return (
        <Panel id={id}>
            <PanelHeader>Рейтинг</PanelHeader>
            <InfiniteScroll
                scrollThreshold={1}
                dataLength={centers.length}
                next={()=>fetchRatingCenters(user_city,10,dataOffset+10,({data})=>{
                    setDataOffset(dataOffset+10)
                    if (data.length) {
                        setCenters([...centers, ...data])
                    } else setHasMore(false)
                })}
                hasMore={hasMore}
                loader={<Spinner style={{paddingTop: 20}}/>}
                // вызывается когда hasMore = false
                endMessage={<Footer>{`Не удалось найти больше заведений с отзывами для города ${user_city}`}</Footer>}
            >
                {centers && centers.map((center)=>
                    <CenterHeader
                        key={center.id}
                        stars={Math.abs(center.stars.medium)}
                        actual={center.actual}
                        avatar={center.avatar}
                        starSize={20}
                        caption={center.data.info.address}
                        onClick={()=>{
                            dispatch(setCenterSaidParams({ center:center }));
                            dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                        }}
                        onClickAvatar={()=>{
                            dispatch(setCenterSaidParams({ center:center }));
                            dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                        }}
                    >{center.data.name}</CenterHeader>)}
            </InfiniteScroll>
        </Panel>
    );
};

Rating.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Rating);
