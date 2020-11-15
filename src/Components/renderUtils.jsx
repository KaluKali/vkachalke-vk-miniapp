import React from "react";
import Icon20LightbulbCircleFillYellow from "@vkontakte/icons/dist/20/lightbulb_circle_fill_yellow";
import Icon20CheckCircleFillGreen from "@vkontakte/icons/dist/20/check_circle_fill_green";
import {Cell, Link} from "@vkontakte/vkui";
import Icon24Globe from "@vkontakte/icons/dist/24/globe";
import Icon24LogoVk from "@vkontakte/icons/dist/24/logo_vk";
import Icon24LogoInstagram from "@vkontakte/icons/dist/24/logo_instagram";
import Icon24LogoFacebook from "@vkontakte/icons/dist/24/logo_facebook";
import Icon24LogoTwitter from "@vkontakte/icons/dist/24/logo_twitter";
import Icon24Phone from "@vkontakte/icons/dist/24/phone";


export function declension(number, one, two, five) {
    number %= 100;
    if (number >= 5 && number <= 20) {
        return five;
    }
    number %= 10;
    if (number === 1) {
        return one;
    }
    if (number >= 2 && number <= 4) {
        return two;
    }
    return five;
}

/**
 * @return {null}
 */
export function IconViewInfoState(state) {
    switch (state) {
        case 0: return <Icon20LightbulbCircleFillYellow />;
        case 1: return null;
        case 2: return <Icon20CheckCircleFillGreen />
    }
}
export function renderViewInfoState(state) {
    switch (state) {
        case 0: return 'Владелец не следит за актуальностью информации.';
        case 1: return '';
        case 2: return 'Информация актуальна.'
    }
}

function protoString(str) {
    if (typeof str !== 'string') return;
    return {proto: str.search(/(http(s?)):\/\//i,''), replaced:str.replace(/(http(s?)):\/\//i,'')}
}

export function socialTypes(social, key, center) {
    const protoStr = protoString(center.data.info[social]);
    switch (social) {
        case 'vk':
            return (<Cell key={key} before={socialIcons(social)}>
                <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
                      target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
            </Cell>);
        case 'number':
            return (<Cell key={key} before={socialIcons(social)}>
                <Link href={`tel:${center.data.info[social]}`}>{center.data.info[social]}</Link>
            </Cell>);
        case 'site':
            return (<Cell key={key} before={socialIcons(social)}>
                <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
                      target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
            </Cell>);
        case 'instagram':
            return (<Cell key={key} before={socialIcons(social)}>
                <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
                      target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
            </Cell>);
        case 'facebook':
            return (<Cell key={key} before={socialIcons(social)}>
                <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
                      target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
            </Cell>);
        case 'twitter':
            return (<Cell key={key} before={socialIcons(social)}>
                <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
                      target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
            </Cell>);
    }
}
export const allowTypes = [
    {type:'site',text:'Сайт'},
    {type:'vk',text:'Vk'},
    {type:'instagram',text:'Instagram'},
    {type: 'facebook',text:'Facebook'},
    {type: 'twitter',text:'Twitter'},
    {type: 'number',text:'Телефон'}
    ]

export function socialIcons(field) {
    switch (field) {
        case 'site':
            return (<Icon24Globe fill={'#008dff'}/>);
        case 'vk':
            return (<Icon24LogoVk fill={'#008dff'}/>);
        case 'instagram':
            return (<Icon24LogoInstagram fill={'#008dff'}/>);
        case 'facebook':
            return (<Icon24LogoFacebook fill={'#008dff'}/>);
        case 'twitter':
            return (<Icon24LogoTwitter fill={'#008dff'}/>);
        case 'number':
            return (<Icon24Phone fill={'#008dff'}/>);
    }
}
export function fieldType(field) {
    switch (field) {
        case 'site':
            return {type:'url',text:'Сайт'};
        case 'vk':
            return {type:'url',text:'Vk'};
        case 'instagram':
            return {type:'url',text:'Instagram'};
        case 'facebook':
            return {type: 'url',text:'Facebook'};
        case 'twitter':
            return {type: 'url',text:'Twitter'};
        case 'number':
            return {type: 'tel',text:'Телефон'};
        case 'address':
            return {type: 'text',text:'Адрес'};
        case 'index':
            return {type: 'number',text:'Индекс'};
        default:
            return {type: 'text',text:'Поле'};
    }
}
