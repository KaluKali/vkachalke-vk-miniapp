import {setActivePanel, setPreviousPanel} from "../state/reducers/history/actions";

const handleSetActivePanel = (dispatch, panelId) => dispatch(setActivePanel(panelId));
const handleToPreviousPanel = (dispatch) => dispatch(setPreviousPanel());

export { handleSetActivePanel, handleToPreviousPanel };
