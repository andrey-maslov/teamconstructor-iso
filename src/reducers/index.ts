import { combineReducers } from 'redux'
import { user } from "./user"
import { terms } from "./terms"
import { pair } from "./pair"
import { team } from "./team"
import { modals } from "./modals"
import { app } from "./app"

const rootReducer = combineReducers({
    pair,
    team,
    user,
    terms,
    modals,
    app,
})

export default rootReducer
