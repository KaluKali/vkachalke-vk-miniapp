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
    const all_centers = useSelector(state =>state.content.centers);
    const snackbar = useSelector(state =>state.vk.snackbar);
    const [dataOffset, setDataOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [centers, setCenters] = useState([])

    useEffect(()=>{
        fetchRatingCenters(user_city,10,0,({data})=>{
            setCenters(data)
            !data.length && setHasMore(false)
        })
    },[])

    return (
        <Panel id={id}>
            <PanelHeader>Рейтинг</PanelHeader>
            <InfiniteScroll
                scrollThreshold={0.9}
                dataLength={centers.length}
                next={()=>fetchRatingCenters(user_city,10,dataOffset+10,({data})=>{
                    setDataOffset(dataOffset+10)
                    if (data.length) {
                        setCenters([...centers, ...data])
                    } else setHasMore(false)
                })}
                hasMore={hasMore}
                loader={<Spinner size="large"/>}
                // вызывается когда hasMore = false
                endMessage={<Footer>{`Не удалось найти заведения с отзывами для города ${user_city}`}</Footer>}
            >
                {centers && centers.map((center)=>
                    <CenterHeader
                        key={center.id}
                        stars={Math.abs(center.stars.medium)}
                        actual={center.actual}
                        avatar={center.avatar}
                        caption={center.data.info.address}
                        onClick={()=>{
                            let idx = all_centers.findIndex(cntr=>cntr.id===center.id)
                            if (idx!==-1) {
                                dispatch(setCenterSaidParams({ active_post_index:idx}));
                                dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                            } else {
                                dispatch(setCenterSaidParams({ centers:all_centers.concat(center), active_post_index:all_centers.length }));
                                dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                            }
                        }}
                    >{center.data.name}</CenterHeader>)}
            </InfiniteScroll>
            { snackbar ? snackbar : null }
        </Panel>
    );
};

Rating.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Rating);
