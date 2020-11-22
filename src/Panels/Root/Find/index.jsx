import React, {useCallback, useRef} from "react";
import {Div, FixedLayout, Footer, Panel, PanelHeader, Search, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {useDispatch, useSelector,} from "react-redux";
import FeedSnippet from "../../../Components/FeedSnippet";
import {appendCenters, fetchCenters} from "../../../state/reducers/content/actions";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash/debounce";
import {categories} from "../../../Components/renderUtils";
import Select from 'react-select';


const Find = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const user_city = useSelector(state =>state.vk.user_server.city);
    const snackbar = useSelector(state =>state.vk.snackbar);
    const centers = useSelector(state =>state.content.centers);
    const dataOffset = useSelector(state =>state.content.item_offset);
    const hasMore = useSelector(state=>state.content.hasMore);
    const activeCategory = useSelector(state=>state.content.activeCategory);
    const searchRef = useRef(null);

    const onChangeSearch = useCallback(
        debounce(() => {
            if (searchRef) {
                if (searchRef.current.value !== '') {
                    // console.log('Find field work');
                    window.scrollTo(0,0);
                    dispatch(fetchCenters(user_city,10,0,searchRef.current.value,activeCategory))
                } else {
                    window.scrollTo(0,0);
                    dispatch(fetchCenters(user_city,10,0,'',activeCategory))
                }
            }
        }, 1600), [user_city,searchRef]
    );

    const onClickCategory = (txt) => {
        window.scrollTo(0,0);
        if (txt !== activeCategory) {
            dispatch(fetchCenters(user_city,10,0,searchRef.current.value,txt))
        } else {
            dispatch(fetchCenters(user_city,10,0,searchRef.current.value,''))
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader separator={false}><Search placeholder={'Название заведения'} onChange={onChangeSearch} getRef={searchRef}/></PanelHeader>
            <FixedLayout filled vertical="top">
                <Div>
                    <Select
                        value={activeCategory === '' ? null : {value:activeCategory, label:activeCategory}}
                        className="basic-single"
                        classNamePrefix="select"
                        name="categories"
                        isClearable
                        isSearchable
                        onChange={(category, action)=>{
                            switch (action.action) {
                                case 'clear':
                                    onClickCategory('')
                                    break;
                                case 'select-option':
                                    onClickCategory(category.value)
                                    break;
                            }
                        }}
                        options={categories}
                        placeholder={'Категория'}
                        styles={{
                            control: styles => ({
                                ...styles,
                                borderWidth: 0
                            }),
                            input: styles => ({
                                ...styles,
                                color:'var(--text_primary)'
                            }),
                            singleValue: styles => ({
                                ...styles,
                                color:'var(--text_primary)'
                            }),
                            placeholder: styles => ({
                                ...styles,
                                color:'var(--header_search_field_tint)'
                            }),
                        }}
                        theme={(theme)=>({
                            ...theme,
                            borderRadius: 10,
                            colors:{
                                ...theme.colors,
                                neutral0:'var(--header_search_field_background)',
                                primary:'var(--accent)',
                                primary25:'var(--header_search_field_background)',
                                primary50:'var(--accent)',
                            }
                        })}
                    />
                </Div>
            </FixedLayout>
            <InfiniteScroll
                style={{paddingTop: 70, paddingBottom: 60}}
                dataLength={centers.length}
                scrollThreshold={0.9}
                next={()=>dispatch(appendCenters(user_city, 10, dataOffset+10,searchRef.current.value,activeCategory))}
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

Find.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Find);
