import React, {Fragment, useState} from "react";
import {
    ActionSheet,
    ActionSheetItem,
    Alert,
    Button,
    Cell,
    Div,
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
import {setPopoutView, setSnackBar, setVkSaidParams} from "../../../state/reducers/vk/actions";
import {
    capabilitiesFieldsAllowTypes,
    fieldType,
    protoString,
    socialAllowTypes,
    socialIcons
} from "../../../Components/renderUtils";
import {Field, FieldArray, Form, Formik} from 'formik';
import Icon24Gallery from '@vkontakte/icons/dist/24/gallery';
import Icon24DismissOverlay from "@vkontakte/icons/dist/24/dismiss_overlay";
import {sendCenterChanges} from "../../../state/reducers/content/actions";
import {setActiveView} from "../../../state/reducers/history/actions";
import {FIND_PANEL} from "../../../constants/Panel";
import {ROOT_VIEW} from "../../../constants/View";

import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import NakedImage from "../../../Components/NakedImage";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';

const Center = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const center = useSelector(state =>state.content.center);
    const snackbar = useSelector(state =>state.vk.snackbar);
    const scheme = useSelector(state =>state.vk.scheme);
    const platform = usePlatform();
    const [images, setImages] = useState(center.image ?
        [null,null,null,null,null,null].map((img,key)=>center.image[key] ? center.image[key] : null) :
        [null,null,null,null,null,null])

    const onImageInputChange = (e, key)=>{
        const { files } = e.target;
        if (files.length){
            if (files[0].size/1024/1000<5) {
                if (/^image\/(?!gif).*/.test(files[0].type)) {
                    const fileReader = new FileReader();
                    fileReader.onloadend = () => setImages(images.map((img,k)=>k===key ? fileReader.result : img));
                    fileReader.readAsDataURL(files[0]);
                } else {
                    dispatch(setPopoutView(
                        <Alert
                            actionsLayout='horizontal'
                            actions={[{
                                title: 'Ок',
                                autoclose: true,
                                mode: 'default',
                                action: () => dispatch(setPopoutView(null)),
                            }]}
                            onClose={()=>dispatch(setPopoutView(null))}
                        >
                            <h2>Неверный тип файла</h2>
                            <p>Файл должен быть изображением</p>
                        </Alert>))
                }
            } else {
                dispatch(setPopoutView(
                    <Alert
                        actionsLayout='horizontal'
                        actions={[{
                            title: 'Ок',
                            autoclose: true,
                            mode: 'default',
                            action: () => dispatch(setPopoutView(null)),
                        }]}
                        onClose={()=>dispatch(setPopoutView(null))}
                    >
                        <h2>Лимит размера файлов</h2>
                        <p>Общий размер файлов не должен превышать 5 мегабайт</p>
                    </Alert>))
            }
        }
    }

    const generalInformationValidator = (type) =>{
        switch (type) {
            case 'index':
                return (value)=>{
                    if (value) {
                        if (value.length > 6 || value.length < 6) {
                            return 'Индекс не может быть больше или меньше 6 символов'
                        } else return null
                    }
                }
            case 'site':
                return (value)=>{
                    if (value) {
                        if (!(/^(http(s)?|).+[a-zA-Zа-яА-Я]{2,256}\.[a-zа-я]{2,6}$/.test(value))) {
                            return 'Неправильный url сайта'
                        } else return null
                    }
                }
            case 'number':
                return (value)=>{
                    if (value) {
                        if (value[0]==='+') return value.replace(/[^+0-9]/g,'').length !== 12 ? 'Неверный формат номера телефона' : null
                        else return value.replace(/[^0-9]/g,'').length !== 11 ?  'Неверный формат номера телефона' : null

                    }
                }
            default:
                return null
        }
    }
    const timetableValidator = (hour) =>{
        if (hour !== '' && !/^(2[0-3]|[01][0-9]):([0-5][0-9])-(2[0-3]|[01][0-9]):([0-5][0-9])$/g.test(hour)) {
            return 'Время работы заведения должно быть в формате 00:00-00:00'
        } else {
            return null
        }
    }

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => handleToPreviousPanel(dispatch)} />}>Редактор</PanelHeader>
            <Gallery
                align={'center'}
                style={{ height: 180 }}
                bullets={scheme === 'space_gray' ? 'light' : 'dark'}
            >
                {
                    images.map((image,key)=>
                        image ?
                            <NakedImage key={key} url={image} size={180}>
                                <Icon24DismissOverlay style={{order: 999,marginLeft:'auto'}} onClick={()=>setImages(images.map((img,k)=>k===key ? null : img))} />
                            </NakedImage> :
                            <div key={key} style={{display:'flex',justifyContent:'center', alignItems:'center'}}>
                                <label htmlFor={`file-upd-comt-one-${key}`} style={{width:'99%', height:'99%',border: "0.5px solid var(--accent)", borderRadius: "10px",display:'flex',justifyContent:'center', alignItems:'center'}}>
                                    <Icon24Gallery fill={'var(--accent)'} />
                                    <input id={`file-upd-comt-one-${key}`} type={'file'} accept={'image/*'} style={{display:'none'}}
                                           onChange={(e)=>onImageInputChange(e,key)}/>
                                </label>
                            </div>
                    )
                }
            </Gallery>
            <Formik
                initialValues={{
                    hours:center.data.hours,
                    info:center.data.info,
                    capabilities: center.data.capabilities
                }}
                onSubmit={(values)=> {
                    if (JSON.stringify({
                        hours:values.hours,
                        info:values.info,
                        capabilities: values.capabilities
                    })===JSON.stringify({
                        hours:center.data.hours,
                        info:center.data.info,
                        capabilities: center.data.capabilities
                    }) && JSON.stringify(center.image ?
                        [null,null,null,null,null,null].map((img,key)=>center.image[key] ? center.image[key] : null) :
                        [null,null,null,null,null,null]) === JSON.stringify(images)) {
                        dispatch(setSnackBar(
                            <Snackbar
                                duration={3000}
                                layout="horizontal"
                                before={<Icon20CancelCircleFillRed />}
                                onClose={() =>dispatch(setSnackBar(null))}
                            >Изменений нет</Snackbar>
                        ))
                    } else {
                        let proto = protoString(values.info.site)
                        if (proto.proto === -1) values.info.site = 'http://'+values.info.site
                        dispatch(setPopoutView(<ScreenSpinner />))
                        //err.response.data
                        sendCenterChanges(center.id, images.filter(img=>img), values)
                            .then(({data})=>dispatch(setVkSaidParams({
                                snackbar: (
                                    <Snackbar
                                        duration={2000}
                                        layout="vertical"
                                        onClose={() => {
                                            dispatch(setVkSaidParams({snackbar: null, popout: null}))
                                            dispatch(handleToPreviousPanel(dispatch))
                                        }}
                                        before={<Icon16DoneCircle fill={'var(--accent)'}/>}
                                    >{data}</Snackbar>
                                )
                            })),err=> {
                                dispatch(setPopoutView(
                                    <Alert
                                        onClose={() => dispatch(setPopoutView(null))}
                                        actionsLayout='vertical'
                                        actions={[{
                                            title: 'Ок',
                                            autoclose: true,
                                            mode: 'default',
                                            action: () => dispatch(setPopoutView(null))
                                        }]}
                                    >
                                        <h2>Неудалось отправить запрос</h2>
                                        <p>{err.response ? err.response.data : err.message==='Network Error' ? 'Сетевая ошибка, повторите попытку' : err.message}</p>
                                    </Alert>
                                ))
                            })
                    }
                }}
            >{({ values , setFieldValue:setRootFieldValue}) => (
                <Form>
                    <Group mode={'auto'} header={<Header mode="secondary" aside={<Icon24Add onClick={()=>{
                        let allow = socialAllowTypes.filter(allow=>values.info[allow.type]===undefined)
                        if (!allow.length) {
                            return dispatch(setSnackBar(
                                <Snackbar
                                    layout="vertical"
                                    onClose={()=>dispatch(setSnackBar(null))}
                                    before={<Icon20CancelCircleFillRed />}
                                >Полей для добавления больше нет</Snackbar>))
                        }else return dispatch(setPopoutView(
                            <ActionSheet onClose={()=>dispatch(setPopoutView(null))}>
                                {allow.map((type, key)=>(
                                    <ActionSheetItem autoclose key={key} before={socialIcons(type.type)}
                                                     onClick={()=>{
                                                         setRootFieldValue(`info.${type.type}`,'')
                                                     }}
                                    >{type.text}</ActionSheetItem>
                                ))}
                                {platform === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                            </ActionSheet>
                        ))
                    }
                    }/>}>Общая информация</Header>}>
                        <List>
                            {Object.keys(values.info).map((index,root_key)=>{
                                let fieldObject = fieldType(index);
                                return (
                                    fieldObject &&
                                    <div key={index}>
                                        <Field name={`info.${index}`} validate={generalInformationValidator(index)}>
                                            {({ field: { value }, form: { setFieldValue }, meta }) => {
                                                return (
                                                    <Cell removable
                                                          multiline
                                                          size={'l'}
                                                          onRemove={()=>setRootFieldValue(`info`, (()=>{
                                                              let val = {...values.info}
                                                              delete val[index]
                                                              return val
                                                          })())}
                                                          bottomContent={meta.error ? meta.error : ''}
                                                          description={<Input
                                                              name={`info.${index}.1`}
                                                              value={value}
                                                              status={meta.error ? 'error' : ''}
                                                              onChange={e=> {
                                                                  setFieldValue(`info.${index}`, e.target.value)
                                                              }}
                                                          />}>
                                                        {fieldObject.text}
                                                    </Cell>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                )
                            })}
                        </List>
                    </Group>
                    <FieldArray name={'capabilities'}>
                        {({ replace, remove, push })=>(
                            <Group mode={'auto'} header={<Header mode="secondary" aside={<Icon24Add
                                onClick={()=>{
                                    let cat_temp = values.capabilities.map(item=>Object.keys(item)[0])
                                    dispatch(setPopoutView(
                                        <ActionSheet onClose={()=>dispatch(setPopoutView(null))}>
                                            {capabilitiesFieldsAllowTypes.filter(type=>!cat_temp.includes(type.text)).map((type, key)=>(
                                                <ActionSheetItem autoclose key={key} onClick={()=>{
                                                    let obj={};
                                                    obj[type.text] = ['']
                                                    push(obj)
                                                }}>{type.text}</ActionSheetItem>
                                            ))}
                                            {platform === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                                        </ActionSheet>
                                    ))
                                }}
                            />}>Дополнительные данные</Header>}>
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
                                                        <Field  key={`field-idx-${index}`} name={`capabilities[${key_root}]['${keys[0]}'][${index}]`}>
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
                                                                          onChange={e=> {
                                                                              setFieldValue(`capabilities[${key_root}]['${keys[0]}'][${index}]`, e.target.value)
                                                                          }}
                                                                      />}
                                                                />
                                                            )}
                                                        </Field>
                                                    ))}
                                                </Group>
                                                <Div style={{display:'flex'}}>
                                                    <Button type={'button'} size={'l'} stretched
                                                            onClick={()=>{
                                                                let obj = values.capabilities[key_root]
                                                                if (obj[keys[0]].length < 10) {
                                                                    obj[keys[0]].push('')
                                                                    replace(key_root, obj)
                                                                } else {
                                                                    dispatch(setSnackBar(
                                                                        <Snackbar
                                                                            layout="vertical"
                                                                            onClose={()=>dispatch(setSnackBar(null))}
                                                                            before={<Icon20CancelCircleFillRed />}
                                                                        >Нельзя добавить больше 10 полей</Snackbar>))
                                                                }
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
                                        <Field key={index} name={`hours.${index}.time`} id={`hours.${index}.time`} type="text" validate={timetableValidator}>
                                            {({ field: { value }, form: { setFieldValue }, meta }) => (
                                                <Cell size={'l'} multiline bottomContent={meta.error ? meta.error : ''} description={
                                                    <Input
                                                        type="text"
                                                        value={value}
                                                        status={meta.error ? 'error' : 'default'}
                                                        onChange={e=> {
                                                            setFieldValue(`hours.${index}.time`, e.target.value)
                                                        }}
                                                    />
                                                }>{hour.day}</Cell>
                                            )}
                                        </Field>
                                    ))}
                                </List>
                            )}
                        </FieldArray>
                    </Group>
                    <Div style={{display:'flex'}}>
                        <Button stretched type={'submit'} mode={'commerce'} size={'l'}>Закончить</Button>
                    </Div>
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
