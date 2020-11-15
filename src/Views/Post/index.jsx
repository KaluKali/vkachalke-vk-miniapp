import React, {useRef, useState} from "react";
import {Avatar, FormStatus, ModalCard, ModalRoot, RichCell, Textarea, View} from "@vkontakte/vkui";
import {useDispatch, useSelector} from "react-redux";

import {setPreviousPanel} from "../../state/reducers/history/actions";
import Post from "../../Panels/Post/Comments";
import {POST_PANEL} from "../../constants/Panel";
import Stars from "../../Components/Stars";
import {MODAL_CARD_REVIEW} from "../../constants/Modal";
import {setModalView} from "../../state/reducers/vk/actions";
import {appendComment} from "../../state/reducers/content/actions";

const PostView = (props) => {
    const { id } = props;
    const dispatch = useDispatch();
    const popout = useSelector((state)=>state.vk.popout);
    const user = useSelector((state)=>state.vk.user);
    const modal = useSelector((state)=>state.vk.modal);
    const { activePanel, history } = useSelector((state) => state.history);
    const center = useSelector(state =>state.content.centers[state.content.active_post_index]);

    const commentInputRef = useRef(null);
    const [stars, setStars] = useState(0);
    const [formError, setFormError] = useState(null);

    const modalPages = (
        <ModalRoot activeModal={modal}>
            <ModalCard
                id={MODAL_CARD_REVIEW}
                onClose={() => dispatch(setModalView(null))}
                header="Отзыв"
                actions={[
                    {
                        title: 'Отправить',
                        mode: 'commerce',
                        action: ()=>{
                            if (commentInputRef.current.value && stars) {
                                dispatch(appendComment(user, center, commentInputRef.current.value,  1,stars));
                                dispatch(setModalView(null));
                            } else {
                                setFormError(
                                    <FormStatus header="Некорректное заполнение формы" mode="error">
                                        Поставьте оценку и напишите краткий отзыв на данное заведение
                                    </FormStatus>
                                )
                            }
                        }
                    }
                ]}
            >
                {formError ? formError : null}
                <RichCell
                    disabled
                    before={<Avatar size={48} src={user.photo_100} />}
                    text={<Stars stars={stars} size={24} onReview={setStars} style={{marginBottom:'5px'}}/>}
                >{`${user.first_name} ${user.last_name}`}</RichCell>
                <Textarea getRef={commentInputRef} placeholder={'Расскажите о заведении'} onFocus={() => formError && setFormError(null)}/>
            </ModalCard>
        </ModalRoot>
    );

    return (
        <View
            id={id}
            history={history}
            activePanel={activePanel}
            popout={popout}
            modal={modalPages}
            onSwipeBack={() => dispatch(setPreviousPanel())}
        >
            <Post id={POST_PANEL}/>
        </View>
    );
};

export default PostView;
