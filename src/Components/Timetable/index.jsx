import React, {Fragment} from "react";
import {Div} from "@vkontakte/vkui";
import PropTypes from "prop-types";

const Timetable = (props) => {
    const {hours} = props;

    return (
        <Fragment>
            <Div>
                <table align={'center'}>
                    <tbody align={'left'}>
                    {hours.map((day,key)=>(
                        <tr key={key}>
                            <th style={{fontWeight:'normal'}}>{day.day}</th>
                            <td>{day.time}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Div>
        </Fragment>
    );
};

Timetable.propTypes = {
    hours: PropTypes.array.isRequired
};

export default Timetable;
