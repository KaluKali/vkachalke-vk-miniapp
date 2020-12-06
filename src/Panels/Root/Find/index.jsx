import React, {useCallback, useEffect, useRef, useState} from "react";
import {FixedLayout, Footer, Panel, PanelHeader, Search, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector,} from "react-redux";
import FeedSnippet from "../../../Components/FeedSnippet";
import {fetchCenters, setCenterSaidParams} from "../../../state/reducers/content/actions";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "../../../Components/debounce";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import {setModalView} from "../../../state/reducers/vk/actions";
import {MODAL_FILTER} from "../../../constants/Modal";


const Find = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const user_city = useSelector(state =>state.vk.user_server.city);
    const snackbar = useSelector(state =>state.vk.snackbar);
    const filterSearch = useSelector(state=>state.content.filter_search);
    const activeCategory = useSelector(state=>state.content.activeCategory);
    const searchRef = useRef(null);

    const [dataOffset, setDataOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [centers, setCenters] = useState([])
    const [fetching, setFetching] = useState(true)

    useEffect(()=>{
        fetchCenters(user_city,10,0,!!filterSearch ? filterSearch : null,!!activeCategory ? activeCategory : null, ({data})=>{
            setCenters(data)
            setFetching(false)
            if (!data.length){
                setHasMore(false)
            }
        })
    }, [user_city,filterSearch,activeCategory])

    const onChangeSearch = useCallback(
        debounce(() => {
            if (searchRef) {
                if (searchRef.current.value !== '') {
                    searchRef.current.blur()
                    window.scrollTo(0,0);
                    dispatch(setCenterSaidParams({filter_search:searchRef.current.value}))
                } else {
                    window.scrollTo(0,0);
                    dispatch(setCenterSaidParams({filter_search:''}))
                }
            }
        }, 1600), [user_city,activeCategory]
    );

    return (
        <Panel id={id}>
            <PanelHeader separator={false}>Поиск</PanelHeader>
            <FixedLayout filled vertical="top">
                <Search placeholder={'Название заведения'} maxLength={50} onChange={()=>{
                    onChangeSearch()
                    if (!fetching) setFetching(true)
                }} getRef={searchRef}
                        defaultValue={filterSearch}
                        icon={<Icon24Filter />}
                        onIconClick={()=>dispatch(setModalView(MODAL_FILTER))}
                />
            </FixedLayout>

            <InfiniteScroll
                style={{paddingTop: 70}}
                dataLength={centers.length}
                scrollThreshold={0.9}
                next={()=> {
                    fetchCenters(user_city,10,dataOffset + 10,!!filterSearch ? filterSearch : null,!!activeCategory ? activeCategory : null,({data})=>{
                        setCenters(centers.concat(data))
                        setDataOffset(dataOffset+10)
                        !data.length && setHasMore(false)
                    })
                }}
                hasMore={hasMore}
                loader={<Spinner />}
                // вызывается когда hasMore = false
                endMessage={<Footer>{centers.length ? fetching ? <Spinner/> : `Больше заведений в городе ${user_city} по вашему запросу нет`  : fetching ? <Spinner/> : 'По вашему запросу не найдено ни одного заведения'}</Footer>}
            >
                {centers.map((center, key)=><FeedSnippet key={center.id} id={key} center={center} />)}
            </InfiniteScroll>
            { snackbar ? snackbar : null }
        </Panel>
    );
};

Find.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Find);
