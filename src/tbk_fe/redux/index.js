import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'
import rehydrate from '&/redux/rehydrate'
import models from '&/redux/models'

const loading = createLoadingPlugin()

const createStore = initState => init({
    models,
    plugins: [rehydrate(initState), loading]
})

export default createStore