export default (initialState = {}) => ({
    config: {
        redux: {
            reducers: {
                __SET_STATE(state, action) {
                    if (action.type === '__SET_STATE') { return { ...state, ...action.payload } }
                    return state || null
                }
            }
        }
    },
    onStoreCreated: store => {
        store.dispatch({ type: '__SET_STATE', payload: initialState })
    },
})  