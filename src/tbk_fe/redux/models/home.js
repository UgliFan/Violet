// import { isSsr } from 'src/utils/utils'
// import { initFetch, serverInitFetch, fetchMyTopPhoto } from '../../api'

export const home = {
    state: {
        tab: {}
    },
    reducers: {
        setInitData(state, payload) {
            return Object.assign({}, state, payload)
        }
    },
    effects: {
        async fetchInitData(payload) {
            let rs = {}
            console.log(payload)
            // if (isSsr()) {
            //     rs = await serverInitFetch({ mid, platform, cookie: payload.cookie, ip })
            // } else {
            //     rs = await initFetch({ mid, platform })
            // }
            const { dynamic, info, tab } = rs
            this.setInitData({ dynamic, info, tab })
        }
    }
}
