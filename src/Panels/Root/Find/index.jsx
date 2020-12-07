import React, {useCallback, useEffect, useRef, useState} from "react";
import {FixedLayout, Footer, Panel, PanelHeader, Search, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector,} from "react-redux";
import FeedSnippet from "../../../Components/FeedSnippet";
import {fetchCenters, setContentSaidParams} from "../../../state/reducers/content/actions";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "../../../Components/debounce";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import {abstractVkBridgePromise, setModalView} from "../../../state/reducers/vk/actions";
import {MODAL_FILTER} from "../../../constants/Modal";


const Find = (props) => {
    const { id,isDesktop } = props;
    const dispatch = useDispatch();
    const user_city = useSelector(state =>state.vk.user_server.city);
    const snackbar = useSelector(state =>state.vk.snackbar);
    const filterSearch = useSelector(state=>state.content.filter_search);
    const categories = useSelector(state=>state.content.categories);
    const isSavedState = useSelector(state=>state.content.isSavedState)
    const searchRef = useRef(null);

    const [dataOffset, setDataOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [centers, setCenters] = useState([])
    const [fetching, setFetching] = useState(true)

    useEffect(()=>{
        if (isSavedState) {
            setCenters(JSON.parse(localStorage.getItem('centers')))
            setDataOffset(parseInt(localStorage.getItem('data_offset')))
            dispatch(setContentSaidParams({isSavedState:false}))
            setFetching(false)
            window.scrollTo(0,parseInt(localStorage.getItem('sroll-prev-find')))
        } else {
            window.scrollTo(0,0)
            fetchCenters(user_city,10,0,!!filterSearch ? filterSearch : undefined,categories)
                .then(({data})=>{
                    setCenters(data)
                    setFetching(false)
                    if (!data.length){
                        setHasMore(false)
                    }
                },(err)=>{
                    console.log(err)
                    setFetching(false)
                    setHasMore(false)
                })
        }
    }, [user_city,filterSearch,categories])

    const onChangeSearch = useCallback(
        debounce(() => {
            if (searchRef && searchRef.current) {
                if (searchRef.current.value !== '') {
                    searchRef.current.blur()
                    window.scrollTo(0,0);
                    dispatch(setContentSaidParams({filter_search:searchRef.current.value}))
                } else {
                    window.scrollTo(0,0);
                    dispatch(setContentSaidParams({filter_search:''}))
                }
            }
        }, 1600), [user_city]
    );

    return (
        <Panel id={id}>
            <PanelHeader separator={false} onClick={()=>abstractVkBridgePromise("VKWebAppScroll", {"top": 0, "speed": 600}).catch(()=>window.scrollTo(0,0))}>Поиск</PanelHeader>
            <FixedLayout filled vertical="top">
                <Search placeholder={'Название заведения'} maxLength={50} onChange={()=>{
                    onChangeSearch()
                    if (!fetching) setFetching(true)
                }} getRef={searchRef}
                        defaultValue={filterSearch}
                        icon={<Icon24Filter style={{cursor: 'pointer'}}/>}
                        onIconClick={()=>{
                            searchRef.current.blur()
                            dispatch(setModalView(MODAL_FILTER))
                        }}
                />
            </FixedLayout>
            <InfiniteScroll
                style={{paddingTop: 70}}
                dataLength={centers.length}
                scrollThreshold={0.9}
                next={()=> {
                    fetchCenters(user_city,10,dataOffset + 10,!!filterSearch ? filterSearch : undefined,categories)
                        .then(({data})=>{
                            setCenters(centers.concat(data))
                            setDataOffset(dataOffset+10)
                            !data.length && setHasMore(false)
                        }, ()=>setHasMore(false))
                }}
                hasMore={hasMore}
                loader={<Spinner />}
                // вызывается когда hasMore = false
                endMessage={<Footer>{centers.length ? fetching ? <Spinner/> : `Больше заведений в городе ${user_city} по вашему запросу нет`  : fetching ? <Spinner/> : 'По вашему запросу не найдено ни одного заведения'}</Footer>}
            >
                {centers.map((center, key)=><FeedSnippet key={center.id} isDesktop={isDesktop} id={key} center={center} centers={centers} data_offset={dataOffset}/>)}
            </InfiniteScroll>
            { snackbar ? snackbar : null }
        </Panel>
    );
};

Find.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Find);
