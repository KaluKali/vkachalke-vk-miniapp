import React from "react";
import {Panel, PanelHeader, PanelHeaderBack, PanelHeaderContent} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {handleToPreviousPanel} from "../../../core/HistoryDispatcher";
import {useDispatch, useSelector} from "react-redux";
import {Map, ObjectManager, RouteButton, YMaps} from "react-yandex-maps";
import {setPopoutView} from "../../../state/reducers/vk/actions";

const MapView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const center = useSelector(state =>state.content.center);

    return (
        <Panel id={id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>
                <PanelHeaderContent
                    status={center.data.name}
                >Карта</PanelHeaderContent>
            </PanelHeader>
            <div style={{ height: '91vh', width: '100%' }}>
                <YMaps
                    query={{
                        lang:'ru_RU',
                        apikey:'6ac153c5-5745-4a5e-b5f5-116cea185f62'
                    }}
                >
                    <Map
                        width={'100%'} height={'100%'}
                        defaultState={{ center: [center.data.map.lat, center.data.map.lng], zoom: 11 }}
                        onLoad={() =>dispatch(setPopoutView(null))}
                    >
                        <RouteButton/>
                        {/*<SearchControl*/}
                        {/*    // instanceRef={(ref) => {*/}
                        {/*    //     if (ref) {*/}
                        {/*    //         searchRef.current = ref;*/}
                        {/*    //     }*/}
                        {/*    // }}*/}
                        {/*    options={{*/}
                        {/*        // float: `right`,*/}
                        {/*        provider: `yandex#search`,*/}
                        {/*        size: `large`*/}
                        {/*    }}*/}
                        {/*/>*/}
                        <ObjectManager
                            options={{
                                clusterize: true,
                                gridSize: 32,
                            }}
                            objects={{
                                preset: `islands#redDotIcon`,
                            }}
                            clusters={{
                                preset: `islands#greenClusterIcons`,
                            }}
                            features={[{
                                "type": 'Feature',
                                "id": 0,
                                "geometry": {
                                    "type": `Point`,
                                    "coordinates": [center.data.map.lat, center.data.map.lng]
                                },
                                // "properties": {
                                //     "balloonContent": `Содержимое балуна`,
                                //     "clusterCaption": `Еще одна метка`,
                                //     "hintContent": `Текст подсказки`
                                // }
                            }]}
                        />
                        {/*<Placemark*/}
                        {/*    key={0}*/}
                        {/*    geometry={[center.data.map.lat, center.data.map.lng]}*/}
                        {/*    properties={{*/}
                        {/*        iconContent: `Что тут `,*/}
                        {/*        hintContent: `Кто тут`,*/}
                        {/*        balloonContent: `Белое всплывающие окошко с описанием`*/}
                        {/*    }}*/}
                        {/*    onClick={(e,ee) =>console.log(e,ee) }*/}
                        {/*    options={{*/}
                        {/*        // The placemark's icon will stretch to fit its contents.*/}
                        {/*        preset: `islands#blackStretchyIcon`,*/}
                        {/*        // // The placemark can be moved.*/}
                        {/*        // draggable: true,*/}
                        {/*        // // Если нужна другая картинка метки*/}
                        {/*        // // Options. You must specify this type of layout.*/}
                        {/*        // iconLayout: `default#image`,*/}
                        {/*        // // Custom image for the placemark icon.*/}
                        {/*        // iconImageHref: myIcon,*/}
                        {/*        // // The size of the placemark.*/}
                        {/*        // iconImageSize: [30, 42],*/}
                        {/*        // // The offset of the upper left corner of the icon relative*/}
                        {/*        // // to its "tail" (the anchor point).*/}
                        {/*        // iconImageOffset: [-3, -42],*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </Map>
                </YMaps>
            </div>
        </Panel>
    );
};

MapView.propTypes = {
    id: PropTypes.string.isRequired,
};

export default MapView;
