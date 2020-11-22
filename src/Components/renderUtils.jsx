import React from "react";
import Icon20CheckCircleFillGreen from "@vkontakte/icons/dist/20/check_circle_fill_green";
import {Cell, Link} from "@vkontakte/vkui";
import Icon24Globe from "@vkontakte/icons/dist/24/globe";
import Icon24LogoVk from "@vkontakte/icons/dist/24/logo_vk";
import Icon24Phone from "@vkontakte/icons/dist/24/phone";
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon28MoneySendOutline from "@vkontakte/icons/dist/28/money_send_outline";


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
        case 0: return null;
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

export function socialInfoTypes(social, key, center) {
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
        // case 'instagram':
        //     return (<Cell key={key} before={socialIcons(social)}>
        //         <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
        //               target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
        //     </Cell>);
        // case 'facebook':
        //     return (<Cell key={key} before={socialIcons(social)}>
        //         <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
        //               target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
        //     </Cell>);
        // case 'twitter':
        //     return (<Cell key={key} before={socialIcons(social)}>
        //         <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
        //               target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
        //     </Cell>);
    }
}
export const socialAllowTypes = [
    {type:'site',text:'Сайт'},
    {type:'vk',text:'Vk'},
    // {type:'instagram',text:'Instagram'},
    // {type: 'facebook',text:'Facebook'},
    // {type: 'twitter',text:'Twitter'},
    {type: 'address', text:'Адрес'},
    {type: 'index',text:'Индекс'},
    {type: 'number',text:'Телефон'}
]
export const capabilitiesFieldsAllowTypes = [
    {text:"Способы оплаты"},
    {text:"Фитнес-клубы и тренажёрные залы"},
    {text:"Бассейны"},
    {text:"Услуги массажиста"},
    {text:"Ресторан / Кафе"},
    {text:"Базы отдыха"},
    {text:"SPA-процедуры"},
    {text:"Бани / Сауны"},
    {text:"Тонизирующие салоны"}
    ]
export function capabilitiesIcons(field) {
   switch (field) {
       case 'Способы оплаты':
           return (<Icon28MoneySendOutline/>)
       // case 'Фитнес-клубы и тренажёрные залы':
       //     return (<FontAwesomeIcon icon={'swimmer'} size={'28px'}/>)
       default:
           return <div />
   }
}

export function socialIcons(field) {
    switch (field) {
        case 'site':
            return (<Icon24Globe fill={'var(--text_link)'}/>);
        case 'vk':
            return (<Icon24LogoVk fill={'var(--text_link)'}/>);
        case 'address':
            return (<Icon24Place fill={'var(--text_link)'}/>);
        case 'index':
            return (<div/>);
        // case 'instagram':
        //     return (<Icon24LogoInstagram fill={'var(--text_link)'}/>);
        // case 'facebook':
        //     return (<Icon24LogoFacebook fill={'var(--text_link)'}/>);
        // case 'twitter':
        //     return (<Icon24LogoTwitter fill={'var(--text_link)'}/>);
        case 'number':
            return (<Icon24Phone fill={'var(--text_link)'}/>);
    }
}

export function fieldType(field) {
    switch (field) {
        case 'site':
            return {type:'url',text:'Сайт'};
        case 'vk':
            return {type:'url',text:'VK'};
        // case 'instagram':
        //     return {type:'url',text:'Instagram'};
        // case 'facebook':
        //     return {type: 'url',text:'Facebook'};
        // case 'twitter':
        //     return {type: 'url',text:'Twitter'};
        case 'number':
            return {type: 'tel',text:'Телефон'};
        case 'address':
            return {type: 'text',text:'Адрес'};
        case 'index':
            return {type: 'number',text:'Индекс'};
        default:
            return null;
    }
}

export const categories =
    [{value: "Авиационные клубы", label: "Авиационные клубы"},
        {value: "Бассейны", label: "Бассейны"},
        {value: "Велнес-залы", label: "Велнес-залы"},
        {value: "Гольф-клубы", label: "Гольф-клубы"},
        {value: "Дайвинг-центры", label: "Дайвинг-центры"},
        {value: "Картинг / Автоцентры / Мотоцентры", label: "Картинг / Автоцентры / Мотоцентры"},
        {value: "Конные клубы / Ипподромы", label: "Конные клубы / Ипподромы"},
        {value: "Ледовые дворцы / Катки", label: "Ледовые дворцы / Катки"},
        {value: "Лыжные базы / Горнолыжные комплексы", label: "Лыжные базы / Горнолыжные комплексы"},
        {value: "Обучение фитнес-инструкторов", label: "Обучение фитнес-инструкторов"},
        {value: "Прокат спортивного инвентаря / техники", label: "Прокат спортивного инвентаря / техники"},
        {value: "Профессиональные спортивные клубы", label: "Профессиональные спортивные клубы"},
        {value: "Ремонт спортивного инвентаря", label: "Ремонт спортивного инвентаря"},
        {value: "Ремонт спортивного оборудования", label: "Ремонт спортивного оборудования"},
        {value: "Скалодромы", label: "Скалодромы"},
        {value: "Сквош-корты", label: "Сквош-корты"},
        {value: "Спортивная одежда / обувь", label: "Спортивная одежда / обувь"},
        {value: "Спортивно-интеллектуальные клубы", label: "Спортивно-интеллектуальные клубы"},
        {value: "Спортивно-наградная продукция", label: "Спортивно-наградная продукция"},
        {value: "Спортивно-тактические клубы", label: "Спортивно-тактические клубы"},
        {value: "Спортивно-технические клубы", label: "Спортивно-технические клубы"},
        {value: "Спортивное оборудование", label: "Спортивное оборудование"},
        {value: "Спортивное питание", label: "Спортивное питание"},
        {value: "Спортивные секции", label: "Спортивные секции"},
        {value: "Спортивные школы", label: "Спортивные школы"},
        {value: "Спортивный инвентарь", label: "Спортивный инвентарь"},
        {value: "Стадионы", label: "Стадионы"},
        {value: "Теннисные корты", label: "Теннисные корты"},
        {value: "Тренажёрные залы", label: "Тренажёрные залы"},
        {value: "Федерации спорта", label: "Федерации спорта"},
        {value: "Фитнес-клубы", label: "Фитнес-клубы"},
        {value: "Центры йоги", label: "Центры йоги"},
        {value: "Яхт-клубы", label: "Яхт-клубы"}]
