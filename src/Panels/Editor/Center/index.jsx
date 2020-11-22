import React, {Fragment, useCallback, useState} from "react";
import {
    ActionSheet,
    ActionSheetItem,
    Button,
    Cell,
    Div,
    File,
    Gallery,
    Group,
    Header,
    Input,
    IOS,
    List,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    ScreenSpinner,
    Snackbar,
    usePlatform
} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import {handleToPreviousPanel} from "../../../core/HistoryDispatcher";
import {useDispatch, useSelector} from "react-redux";
import {setPopoutView, setVkSaidParams} from "../../../state/reducers/vk/actions";
import {capabilitiesFieldsAllowTypes, fieldType, socialAllowTypes, socialIcons} from "../../../Components/renderUtils";
import {ErrorMessage, Field, FieldArray, Form, Formik} from 'formik';
import Icon24Gallery from '@vkontakte/icons/dist/24/gallery';
import Icon24DismissOverlay from "@vkontakte/icons/dist/24/dismiss_overlay";
import {sendCenterChanges} from "../../../state/reducers/content/actions";
import {setActiveView} from "../../../state/reducers/history/actions";
import {FIND_PANEL} from "../../../constants/Panel";
import {ROOT_VIEW} from "../../../constants/View";

import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import NakedImage from "../../../Components/NakedImage";
import Icon24Add from "@vkontakte/icons/dist/24/add";


const Center = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const center = useSelector(state =>state.content.centers[state.content.active_post_index]);
    const snackbar = useSelector(state =>state.vk.snackbar);
    const scheme = useSelector(state =>state.vk.scheme);
    const user = useSelector(state =>state.vk.user);
    const platform = usePlatform();
    const [images, setImages] = useState(center.image ?
        [null,null,null,null,null,null].map((img,key)=>center.image[key] ? center.image[key] : null) :
        [null,null,null,null,null,null])

    const onImageInputChange = useCallback((e, key)=>{
        const { files } = e.target;
        if (files.length){
            const fileReader = new FileReader();
            fileReader.onloadend = () => setImages(images.map((img,k)=>k===key ? fileReader.result : img));
            fileReader.readAsDataURL(files[0]);
        }
    }, [images])


    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>Редактор</PanelHeader>
            <Formik
                initialValues={{
                    hours:center.data.hours,
                    info:Object.entries(center.data.info).filter(ent=>!['station','refference_point'].includes(ent[0])),
                    capabilities: center.data.capabilities
                }}
                onSubmit={ (values) => {
                    dispatch(setPopoutView(<ScreenSpinner />))
                    dispatch(sendCenterChanges(center.id, images, {
                        hours: values.hours,
                        capabilities:values.capabilities,
                        info: values.info.reduce((acc, [k, v]) => ({...acc, [k]: v}), {})
                    },()=>dispatch(setVkSaidParams({
                        snackbar: (
                            <Snackbar
                                duration={2000}
                                layout="vertical"
                                onClose={() => {
                                    dispatch(setVkSaidParams({snackbar: null, popout: null}))
                                    dispatch(setActiveView({panelId: FIND_PANEL, viewId: ROOT_VIEW}))
                                }}
                                before={<Icon16DoneCircle fill={'var(--accent)'}/>}
                            >{center.owner === user.id ? 'Изменения применены' : 'Запрос на исправление отправлен'}</Snackbar>
                        )
                    }))))

                }}
            >{({ values }) => (
                <Form>
                    <Group mode={'auto'} header={<Header mode="secondary">Картинки</Header>}>
                        <Gallery
                            slideWidth="90%"
                            align={'center'}
                            style={{ height: '180px' }}
                            bullets={scheme === 'space_gray' ? 'light' : 'dark'}
                        >
                            {
                                images.map((image,key)=>
                                    image ?
                                        <NakedImage key={key} url={image} size={180}>
                                            <Icon24DismissOverlay style={{order: 999,marginLeft:'auto'}} onClick={()=>setImages(images.map((img,k)=>k===key ? null : img))} />
                                        </NakedImage> :
                                        <div key={key} style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            <File accept="image/*" controlSize="m" mode={'outline'}
                                                  style={{border: "0.5px solid var(--accent)", borderRadius: "10px",
                                                      height:'99%', width:'70%', display:'flex', alignItems:'center', justifyContent:'center', alignSelf:'center'}}
                                                  onChange={(e)=>onImageInputChange(e,key)}>
                                                <Icon24Gallery />
                                            </File>
                                        </div>
                                )
                            }
                        </Gallery>
                    </Group>

                    <FieldArray name="info">
                        {({ remove, push }) => (
                            <Group mode={'auto'} header={<Header mode="secondary" aside={<Icon24Add onClick={()=>
                                dispatch(setPopoutView(
                                    <ActionSheet onClose={()=>dispatch(setPopoutView(null))}>
                                        <ActionSheetItem autoclose>
                                            <List>
                                                {socialAllowTypes.map((type, key)=>(
                                                    <Cell key={key} before={socialIcons(type.type)}
                                                          onClick={()=>push([type.type,''])}
                                                    >{type.text}</Cell>
                                                ))}
                                            </List>
                                        </ActionSheetItem>
                                        {platform === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                                    </ActionSheet>
                                ))
                            }/>}>Общая информация</Header>}>
                                <List>
                                    {values.info.length > 0 &&
                                    values.info.map((field, index) => {
                                        let fieldObject = fieldType(field[0]);
                                        return fieldObject && (
                                            <div key={index}>
                                                <Field name={`info.${index}.1`} id={`info.${index}.1`} type="text">
                                                    {({ field: { value }, form: { setFieldValue } }) => (
                                                        <Cell removable
                                                              onRemove={()=>remove(index)}
                                                              description={<Input
                                                                  name={`info.${index}.1`}
                                                                  type="text"
                                                                  value={value}
                                                                  onChange={e=>setFieldValue(`info.${index}.1`,e.target.value)}
                                                              />}>
                                                            {fieldObject.text}
                                                        </Cell>
                                                    )}
                                                </Field>
                                                <ErrorMessage
                                                    name={`info.${index}.1`}
                                                    component="div"
                                                    className="field-error"
                                                />
                                            </div>
                                        )
                                    })}
                                </List>
                            </Group>
                        )}
                    </FieldArray>
                    <FieldArray name={'capabilities'}>
                        {({ replace, remove, push })=>(
                            <Group mode={'auto'} header={<Header mode="secondary" aside={<Icon24Add
                                onClick={()=>dispatch(setPopoutView(
                                    <ActionSheet onClose={()=>dispatch(setPopoutView(null))}>
                                        <ActionSheetItem autoclose>
                                            <List>
                                                {capabilitiesFieldsAllowTypes.map((type, key)=>(
                                                    <Cell key={key} onClick={()=>{
                                                        let obj={};
                                                        obj[type.text] = ['']
                                                        push(obj)
                                                    }}>{type.text}</Cell>
                                                ))}
                                            </List>
                                        </ActionSheetItem>
                                        {platform === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                                    </ActionSheet>
                                ))}
                            />}>Дополнительные услуги</Header>}>
                                <List>
                                    {values.capabilities.length > 0 &&
                                    values.capabilities.map((item,key_root)=>{
                                        let keys = Object.keys(item);
                                        return (
                                            <Fragment key={`group-capab-${key_root}`}>
                                                <Group
                                                    separator={'hide'}
                                                    header={<Cell removable onRemove={()=>remove(key_root)}>{keys[0]}</Cell>}
                                                >
                                                    {item[keys[0]].map((option,index)=>(
                                                        <Field  key={`field-idx-${index}`} name={`capabilities[${key_root}]['${keys[0]}'][${index}]`} id={`capabilities[${key_root}]['${keys[0]}'][${index}]`} type="text">
                                                            {({ field: { value }, form: { setFieldValue } }) => (
                                                                <Cell removable
                                                                      onRemove={()=>{
                                                                          let obj = values.capabilities[key_root]
                                                                          obj[keys[0]].splice(index,1)
                                                                          replace(key_root, obj)
                                                                      }}
                                                                      description={<Input
                                                                          name={`capabilities[${key_root}]['${keys[0]}'][${index}]`}
                                                                          type="text"
                                                                          value={value}
                                                                          onChange={e=>setFieldValue(`capabilities[${key_root}]['${keys[0]}'][${index}]`,e.target.value)}
                                                                      />} />
                                                            )}
                                                        </Field>
                                                    ))}
                                                </Group>
                                                <Div style={{display:'flex'}}>
                                                    <Button type={'button'} size={'l'} stretched
                                                            onClick={()=>{
                                                                let obj = values.capabilities[key_root]
                                                                obj[keys[0]].push('')
                                                                replace(key_root, obj)
                                                            }}
                                                    >Добавить поле</Button>
                                                </Div>
                                            </Fragment>
                                        )
                                    })}
                                </List>
                            </Group>
                        )}
                    </FieldArray>
                    <Group mode={'auto'} header={<Header mode="secondary">Расписание</Header>}>
                        <FieldArray name="hours">
                            {() => (
                                <List>
                                    {values.hours.length > 0 &&
                                    values.hours.map((hour, index) => (
                                        <Fragment key={index}>
                                            <Field name={`hours.${index}.time`} id={`hours.${index}.time`} type="text">
                                                {({ field: { value }, form: { setFieldValue } }) => (
                                                    <Cell description={<Input
                                                        type="text"
                                                        value={value}
                                                        onChange={e=>setFieldValue(`hours.${index}.time`,e.target.value)}
                                                    />}
                                                    >{hour.day}</Cell>
                                                )}
                                            </Field>
                                        </Fragment>
                                    ))}
                                </List>
                            )}
                        </FieldArray>
                    </Group>
                    <Div style={{display:'flex'}}>
                        <Button stretched type={'submit'} mode={'commerce'} size={'l'}>Закончить</Button>
                    </Div>
                    <Div style={{paddingTop: 60, paddingBottom: 60}} />
                </Form>
            )}
            </Formik>
            {snackbar ? snackbar : null}
        </Panel>
    );
};

Center.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(Center);
