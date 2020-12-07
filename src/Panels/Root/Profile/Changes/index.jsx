import React, {useEffect, useState} from "react";
import {Footer, Panel, PanelHeader, PanelHeaderBack, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {handleToPreviousPanel} from "../../../../core/HistoryDispatcher";
import {useDispatch} from "react-redux";
import CenterHeader from "../../../../Components/CenterHeader";
import {fetchChangedCenters, setContentSaidParams} from "../../../../state/reducers/content/actions";
import {setActiveView} from "../../../../state/reducers/history/actions";
import {POST_PANEL} from "../../../../constants/Panel";
import {POST_VIEW} from "../../../../constants/View";

const Changes = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const [centers, setCenters] = useState([])
    const [fetching, setFetching] = useState(true)

    useEffect(()=>{
        fetchChangedCenters()
            .then(({data})=>{
                setCenters(data)
                setFetching(false)
            })
    },[])

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>Изменения мест</PanelHeader>
            {centers.length ? centers.map((center)=>
                <CenterHeader
                    key={center.id}
                    stars={Math.abs(center.stars.medium)}
                    actual={center.actual}
                    avatar={center.avatar}
                    caption={center.data.info.address}
                    onClickNative={()=>{
                        dispatch(setContentSaidParams({ center:center }));
                        dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                    }}
                >{center.data.name}</CenterHeader>) : <Footer>{fetching ? <Spinner/>  : 'У вас нет подтвержденных изменений заведения'}</Footer>}
        </Panel>
    );
};

Changes.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Changes;
