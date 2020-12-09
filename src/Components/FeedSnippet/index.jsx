import React from "react";
import {setContentSaidParams} from "../../state/reducers/content/actions";
import {useDispatch} from "react-redux";
import {Card, Div, List, ScreenSpinner, SimpleCell} from "@vkontakte/vkui";
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon24Recent from '@vkontakte/icons/dist/24/recent';
import {setActiveView} from "../../state/reducers/history/actions";
import {MAPVIEW_PANEL, POST_PANEL} from "../../constants/Panel";
import {POST_VIEW} from "../../constants/View";
import {abstractVkBridge, setPopoutView} from "../../state/reducers/vk/actions";
import Timetable from "../Timetable";
import NakedImage from "../NakedImage";
import CenterHeader from "../CenterHeader";
import HideMore from "../HideMore";
import PostActionsBottom from "../PostActionsBottom";
import PhotoViewer from "../PhotoViewer";
// todo transferal to react-table
const FeedSnippet = (props) => {
    const { isDesktop, center,centers,data_offset } = props;
    const dispatch = useDispatch();

    return (
        <Div>
            <Card mode={'shadow'}>
                {/** Avatar block Math.abs(center.avg)**/}
                <CenterHeader
                    stars={Math.abs(center.stars.medium)}
                    actual={center.actual}
                    avatar={center.avatar}
                    onClickNative={()=>{
                        localStorage.setItem('data_offset',data_offset)
                        localStorage.setItem('centers',JSON.stringify(centers))
                        localStorage.setItem('sroll-prev-find', window.scrollY)
                        dispatch(setContentSaidParams({ center:center,isSavedState: true}));
                        dispatch(setActiveView({ panelId:POST_PANEL, viewId:POST_VIEW }))
                    }}
                >{center.data.name}</CenterHeader>
                {/** Content block **/}
                <List>
                    {/** Map icon **/}
                    <SimpleCell style={{cursor: 'pointer'}} multiline before={<Icon24Place fill={'var(--text_link'}/>}
                          onClick={()=>{
                              localStorage.setItem('data_offset',data_offset)
                              localStorage.setItem('centers',JSON.stringify(centers))
                              localStorage.setItem('sroll-prev-find', window.scrollY)
                              dispatch(setContentSaidParams({center:center,isSavedState: true}));
                              dispatch(setActiveView({panelId:MAPVIEW_PANEL,viewId:POST_VIEW}))
                              dispatch(setPopoutView(<ScreenSpinner />))
                          }}
                    ><label style={{color:'var(--accent)'}}>{`${center.data.info.address}${center.data.info.index ? `, ${center.data.info.index}` : ''}`}</label>
                    </SimpleCell>
                    {/** Timetable icon **/}
                    {center.data.hours.length ?
                        <HideMore icon={<Icon24Recent fill={'var(--text_link'}/>} text={'Расписание'}>
                            <Timetable hours={center.data.hours}/>
                        </HideMore>
                        : null}
                    {/** Image block **/}
                    {/** todo Чето сделать с referrer policy **/}
                    {center.image && <NakedImage url={center.image[0]} size={180} contain onClick={()=>
                        isDesktop ?
                            dispatch(setPopoutView(<PhotoViewer images={center.image} />)) :
                            abstractVkBridge('VKWebAppShowImages', {images:center.image})}/>}
                </List>
                {/** Action block **/}
                <PostActionsBottom center={center} centers={centers} data_offset={data_offset} isPost isDesktop={isDesktop} />
            </Card>
        </Div>
    );
};


export default React.memo(FeedSnippet);
