import React, {useEffect, useState} from "react";
import {Footer, Panel, PanelHeader, PanelHeaderBack, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {handleToPreviousPanel} from "../../../../core/HistoryDispatcher";
import {useDispatch} from "react-redux";
import {fetchReviewedCenters, setCenterSaidParams} from "../../../../state/reducers/content/actions";
import CenterHeader from "../../../../Components/CenterHeader";
import {setActiveView} from "../../../../state/reducers/history/actions";
import {POST_PANEL} from "../../../../constants/Panel";
import {POST_VIEW} from "../../../../constants/View";

const Reviewed = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const [centers, setCenters] = useState([])
    const [fetching, setFetching] = useState(true)

    useEffect(()=>{
        fetchReviewedCenters()
            .then(({data})=>{
                setCenters(data)
                setFetching(false)
            })
    },[])

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>Отзывы</PanelHeader>
            {centers.length ? centers.map((center)=>
                <CenterHeader
                    key={center.id}
                    stars={Math.abs(center.stars.medium)}
                    actual={center.actual}
                    avatar={center.avatar}
                    caption={center.data.info.address}
                    onClick={()=>{
                        dispatch(setCenterSaidParams({ center:center }));
                        dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                    }}
                >{center.data.name}</CenterHeader>) : <Footer>{fetching ? <Spinner/>  : 'Вы не написали отзыв ни на одно заведение'}</Footer>}
        </Panel>
    );
};

Reviewed.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Reviewed;
