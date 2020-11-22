import React, {useCallback, useRef, useState} from "react";
import {Cell, Footer, Group, List, Panel, PanelHeader, PanelHeaderBack, Search, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {handleToPreviousPanel} from "../../../../core/HistoryDispatcher";
import {useDispatch} from "react-redux";
import debounce from "lodash/debounce";
import {fetchCities, sendUserChanges, setVkUser} from "../../../../state/reducers/vk/actions";
import * as types from "../../../../state/reducers/vk/types";
import {fetchCenters} from "../../../../state/reducers/content/actions";

const CitySelection = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const searchRef = useRef(null);

    const [cities, setCities] = useState([])
    const [loadState, setLoadState] = useState(false);

    const onChangeSearch = useCallback(
        debounce(() => {
            if (searchRef) {
                if (searchRef.current.value !== '') {
                    fetchCities(searchRef.current.value, (data)=>{
                        setLoadState(false)
                        setCities(data)
                    })
                    window.scrollTo(0,0);
                } else {
                    window.scrollTo(0,0);
                }
            }
        }, 1600), [searchRef]
    );


    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>Выбор города</PanelHeader>
            <Search placeholder={'Начните вводить текст'} onChange={()=>{
                setLoadState(true)
                onChangeSearch()
            }} getRef={searchRef}/>
            <Group>
                {loadState ? <Spinner/> :
                    <List>
                        {!cities.length && searchRef.current ? <Footer>Ничего не найдено</Footer> : null}
                        {cities.map((city,key)=>(
                            <Cell key={key}
                                  onClick={()=>{
                                      sendUserChanges({city:city})
                                      dispatch(setVkUser({city:city}, types.SET_SERVER_USER))
                                      dispatch(fetchCenters(city));
                                      handleToPreviousPanel(dispatch)
                                  }}
                            >{city}</Cell>
                        ))}
                    </List>
                }
            </Group>
        </Panel>
    );
};

CitySelection.propTypes = {
    id: PropTypes.string.isRequired,
};

export default CitySelection;
