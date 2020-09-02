import Immutable from 'seamless-immutable'
import * as c from '../constants/import'
import { REHYDRATE } from 'redux-persist/src/constants'

export default function(state = initialState, action){switch (action.type) {
    case REHYDRATE:{
        const { payload={} } = action
        const cached = payload.import||initialState

        //always restore in development mode
        if (process.env.NODE_ENV == 'development')
            return cached

        return state
    }

    /* File */
    case c.IMPORT_FILE_UPLOAD_REQ:{
        const { file } = action

        return initialState
            .setIn(['file', 'status'], 'loading')
            .setIn(['file', 'name'], String(file.name))
    }

    case c.IMPORT_FILE_UPLOAD_SUCCESS:{
        const { items, count, onSuccess } = action

        onSuccess && onSuccess()

        const file = state.file
            .set('status', items.length ? 'loaded' : 'empty')
            .set('items', items)
            .set('count', count)
                
        return initialState.set('file', file)
    }

    case c.IMPORT_FILE_UPLOAD_ERROR:{
        const { onFail, error } = action

        onFail && onFail(error)

        const file = state.file
            .set('status', 'error')
            .set('items', [])
            .set('count', initialState.file.count)
                
        return initialState.set('file', file)
    }

    /* Parcel */
    case c.IMPORT_PARCEL_MODE:{
        return state.setIn(['parcel', 'mode'], action.mode)
    }

    case c.IMPORT_PARCEL_SAVE_REQ:{
        if (state.file.status != 'loaded'){
            action.ignore = true
            return state
        }

        return state.setIn(['parcel', 'status'], 'loading')
    }

    case c.IMPORT_PARCEL_SAVE_PROGRESS:{
        const { progress } = action

        return state.setIn(['parcel', 'progress'], progress)
    }

    case c.IMPORT_PARCEL_SAVE_SUCCESS:{
        const { onSuccess } = action

        onSuccess && onSuccess()

        return state
            .setIn(['parcel', 'status'], 'success')
            .setIn(['parcel', 'progress'], 100)
    }

    case c.IMPORT_PARCEL_SAVE_ERROR:{
        const { onFail, error } = action

        onFail && onFail(error)

        return state.setIn(['parcel', 'status'], 'error')
    }

	case 'RESET':
    case c.IMPORT_CANCEL:{
		return initialState
	}

	default:
		return state
}}

const initialState = Immutable({
    file: {
        status: 'empty', //empty|loading|error|loaded
        name: '',
        items: [],
        count: {
            bookmarks: 0,
            collections: 0,
            tags: 0
        }
    },
    parcel: {
        mode: 'all', //all|new|from_scratch
        status: 'idle', //idle|loading|error|success
        progress: 0 //percent
    }
})