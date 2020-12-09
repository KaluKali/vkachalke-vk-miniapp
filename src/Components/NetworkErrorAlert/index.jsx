import React from "react";
import PropTypes from "prop-types";
import {Alert} from "@vkontakte/vkui";

const NetworkErrorAlert = (props) => {
    const { err,onClose } = props;

    return (
        <Alert
            onClose={onClose}
            actionsLayout='vertical'
            actions={[{
                title: 'Ок',
                autoclose: true,
                mode: 'default',
                action: onClose
            }]}
        >
            <h2>Неудалось отправить запрос</h2>
            <p>{err.response ? err.response.data : err.message==='Network Error' ? 'Сетевая ошибка, повторите попытку' : err.message}</p>
        </Alert>
    );
};

NetworkErrorAlert.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default NetworkErrorAlert;
