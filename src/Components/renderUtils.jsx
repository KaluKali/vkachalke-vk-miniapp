import React from "react";
import Icon20CheckCircleFillGreen from "@vkontakte/icons/dist/20/check_circle_fill_green";
import {Link, SimpleCell} from "@vkontakte/vkui";
import Icon24Globe from "@vkontakte/icons/dist/24/globe";
import Icon24LogoVk from "@vkontakte/icons/dist/24/logo_vk";
import Icon24Phone from "@vkontakte/icons/dist/24/phone";
import Icon24Place from '@vkontakte/icons/dist/24/place';
import Icon28MoneySendOutline from "@vkontakte/icons/dist/28/money_send_outline";
import Icon20BookOutline from '@vkontakte/icons/dist/20/book_outline';
import Icon28MagicWandOutline from '@vkontakte/icons/dist/28/magic_wand_outline';
import {BiRestaurant, BiSwim} from 'react-icons/bi'
import {FaBath} from 'react-icons/fa'
import {IoFitnessSharp} from 'react-icons/io5'
import {MdRoomService} from 'react-icons/md'
import {GiMountains} from 'react-icons/gi'
import {BsLightning} from 'react-icons/bs'

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

export function protoString(str) {
    if (typeof str !== 'string') return {proto: -1};
    else return {proto: str.search(/(http(s)?):\/\//i,''), replaced:str.replace(/(http(s)?):\/\//i,'')}
}

export function socialInfoTypes(social, key, center) {
    const protoStr = protoString(center.data.info[social]);
    switch (social) {
        case 'vk':
            return (<SimpleCell disabled key={key} before={socialIcons(social)}>
                <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
                      target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
            </SimpleCell>);
        case 'number':
            return (<SimpleCell disabled key={key} before={socialIcons(social)}>
                <Link href={`tel:${center.data.info[social].replace(/[^+0-9]/g,'')}`}>{center.data.info[social]}</Link>
            </SimpleCell>);
        case 'site':
            return (<SimpleCell disabled key={key} before={socialIcons(social)}>
                <Link href={protoStr.proto !==-1 ? center.data.info[social] : `https://${center.data.info[social]}`}
                      target={'_blank'} rel='noopener noreferrer'>{protoStr.replaced}</Link>
            </SimpleCell>);
    }
}
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
    const props = {
        className:'Icon Icon--28 Icon--w-28 Icon--h-28',
        size:'28px',
        color:'var(--text_link)'
    }
    switch (field) {
        case capabilitiesFieldsAllowTypes[0].text:
            return (<Icon28MoneySendOutline fill={'var(--text_link)'}/>)
        case capabilitiesFieldsAllowTypes[1].text:
            return (<IoFitnessSharp {...props}/>)
        case capabilitiesFieldsAllowTypes[2].text:
            return (<BiSwim {...props}/>)
        case capabilitiesFieldsAllowTypes[3].text:
            return (<MdRoomService {...props}/>)
        case capabilitiesFieldsAllowTypes[4].text:
            return (<BiRestaurant {...props}/>)
        case capabilitiesFieldsAllowTypes[5].text:
            return (<GiMountains {...props}/>)
        case capabilitiesFieldsAllowTypes[6].text:
            return (<Icon28MagicWandOutline fill={'var(--text_link)'}/>)
        case capabilitiesFieldsAllowTypes[7].text:
            return (<FaBath {...props}/>)
        case capabilitiesFieldsAllowTypes[8].text:
            return (<BsLightning {...props}/>)
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
            return (<Icon20BookOutline fill={'var(--text_link)'}/>);
        case 'number':
            return (<Icon24Phone fill={'var(--text_link)'}/>);
    }
}
export const socialAllowTypes = [
    {type:'site',text:'Сайт'},
    {type:'vk',text:'VK'},
    {type: 'address', text:'Адрес'},
    {type: 'index',text:'Индекс'},
    {type: 'number',text:'Телефон'}
]
export function fieldType(field) {
    switch (field) {
        case 'site':
            return {type:'text',text:'Сайт'};
        case 'vk':
            return {type:'text',text:'VK'};
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

export const categories = ["Авиационные клубы", "Бассейны", "Велнес-залы", "Гольф-клубы", "Дайвинг-центры", "Картинг / Автоцентры / Мотоцентры", "Конные клубы / Ипподромы", "Ледовые дворцы / Катки", "Лыжные базы / Горнолыжные комплексы", "Обучение фитнес-инструкторов", "Прокат спортивного инвентаря / техники", "Профессиональные спортивные клубы", "Ремонт спортивного инвентаря", "Ремонт спортивного оборудования", "Скалодромы", "Сквош-корты", "Спортивная одежда / обувь", "Спортивно-интеллектуальные клубы", "Спортивно-наградная продукция", "Спортивно-тактические клубы", "Спортивно-технические клубы", "Спортивное оборудование", "Спортивное питание", "Спортивные секции", "Спортивные школы", "Спортивный инвентарь", "Стадионы", "Теннисные корты", "Тренажёрные залы", "Федерации спорта", "Фитнес-клубы", "Центры йоги", "Яхт-клубы"]

