import React, {useRef, useState} from "react";
import {FormStatus, Input, ModalCard, SimpleCell, Snackbar} from "@vkontakte/vkui";
import {MODAL_CARD_OWNER} from "../../constants/Modal";
import {setPreviousPanel} from "../../state/reducers/history/actions";
import {sendRequest, setVkSaidParams} from "../../state/reducers/vk/actions";
import Icon16DoneCircle from "@vkontakte/icons/dist/16/done_circle";
import Icon20CancelCircleFillRed from "@vkontakte/icons/dist/20/cancel_circle_fill_red";
import {useDispatch} from "react-redux";

const IOwnerCard = () => {
    const dispatch = useDispatch();
    const [formError, setFormError] = useState(null);
    const groupInputRef = useRef(null);

    return (
        <ModalCard
            id={MODAL_CARD_OWNER}
            header="Подтверждение"
            onClose={()=>dispatch(setPreviousPanel())}
            actions={[
                {
                    title: 'Отправить',
                    mode: 'commerce',
                    action: ()=>{
                        if (groupInputRef.current.value && /^(https:\/\/|)vk\.com\/.+/i.test(groupInputRef.current.value)) {
                            dispatch(setPreviousPanel())
                            sendRequest(1, {vk_group:groupInputRef.current.value,id:center.id},(data,err)=>{
                                if (!err) {
                                    dispatch(setVkSaidParams({snackbar: (
                                            <Snackbar
                                                duration={2000}
                                                layout="vertical"
                                                onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                                before={<Icon16DoneCircle fill={'var(--accent)'} />}
                                            >Ваша заявка отправлена</Snackbar>
                                        )}))
                                } else {
                                    dispatch(setVkSaidParams({snackbar: (
                                            <Snackbar
                                                duration={2000}
                                                layout="vertical"
                                                onClose={() =>dispatch(setVkSaidParams({snackbar: null}))}
                                                before={<Icon20CancelCircleFillRed />}
                                            >{err.response ? err.response.data : err.message==='Network Error' ? 'Сетевая ошибка, повторите попытку' : err.message}</Snackbar>
                                        )}))
                                }
                            })
                        } else {
                            setFormError(
                                <FormStatus header="Некорректное заполнение формы" mode="error">
                                    Укажите ссылку на группу
                                </FormStatus>
                            )
                        }
                    }
                }
            ]}
        >
            {formError ? formError : null}
            <SimpleCell
                disabled
                multiline
                description={<Input type={'url'} getRef={groupInputRef} placeholder={'Ссылка на группу'} onFocus={() => formError && setFormError(null)}/>}
            >
                Для получения статуса владельца заведения вам нужно указать группу сообщества и быть в блоке контактов, чтобы нам было легче опознать вас.
            </SimpleCell>
        </ModalCard>
    );
};

// IOwnerCard.propTypes = {
//     hours: PropTypes.array.isRequired
// };

export default IOwnerCard;
