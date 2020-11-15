import React, {useCallback, useRef} from "react";
import {Button, Div, FixedLayout, Footer, HorizontalScroll, Panel, PanelHeader, Search, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector,} from "react-redux";
import FeedSnippet from "../../../Components/FeedSnippet";
import {appendCenters, fetchCenters} from "../../../state/reducers/content/actions";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash/debounce";
import {categories} from "../../../Components/renderUtils";

const itemStyle = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    paddingRight:6,
};

const Feed = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const user = useSelector(state =>state.vk.user);
    const snackbar = useSelector(state =>state.vk.snackbar);
    const centers = useSelector(state =>state.content.centers);
    const dataOffset = useSelector(state =>state.content.item_offset);
    const hasMore = useSelector(state=>state.content.hasMore);
    const activeCategory = useSelector(state=>state.content.activeCategory);
    const searchRef = useRef(null);

    console.log('Feed rerender')
    // useSelector(state=>console.log(state));

    const onChangeSearch = useCallback(
        debounce(() => {
            if (searchRef) {
                if (searchRef.current.value !== '') {
                    console.log('Feed field work');
                    window.scrollTo(0,0);
                    dispatch(fetchCenters(user.city.title,10,0,searchRef.current.value,activeCategory))
                } else {
                    window.scrollTo(0,0);
                    dispatch(fetchCenters(user.city.title,10,0,'',activeCategory))
                }
            }
        }, 1600), [user,searchRef]
    );

    const onClickCategory = (txt) => {
        window.scrollTo(0,0);
        if (txt !== activeCategory) {
            dispatch(fetchCenters(user.city.title,10,0,searchRef.current.value,txt))
        } else {
            dispatch(fetchCenters(user.city.title,10,0,searchRef.current.value,''))
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader separator={false}><Search onChange={onChangeSearch} getRef={searchRef}/></PanelHeader>
            <FixedLayout filled vertical="top">
                <HorizontalScroll>
                    <Div style={{display:'flex'}}>
                        {categories.map((txt,key)=>(
                            <div key={key} style={itemStyle}>
                                <Button mode={txt === activeCategory ? 'primary' : 'secondary'}
                                        onClick={()=>onClickCategory(txt)}
                                >{txt}</Button>
                            </div>
                        ))}
                    </Div>
                </HorizontalScroll>
            </FixedLayout>
            <InfiniteScroll
                style={{paddingTop: 60, paddingBottom: 60}}
                dataLength={centers.length}
                next={()=>dispatch(appendCenters(user.city.title, 10, dataOffset+10,searchRef.current.value,activeCategory))}
                hasMore={hasMore}
                loader={<Spinner size="large"/>}
                // вызывается когда hasMore = false
                endMessage={<Footer>Записей о заведениях в городе больше нет</Footer>}
            >
                {centers.map((center, key)=><FeedSnippet key={center.id} id={key} center={center} />)}
            </InfiniteScroll>
            { snackbar ? snackbar : null }
        </Panel>
    );
};

Feed.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Feed);
