function importAll(r) {
    return r.keys().reduce((obj, v) => {
        const key = v.match(/\w+/)[0]
        if (key === 'index') { return obj }
        return { ...obj, ...r(v) }
    }, {})
}

const Models = importAll(require.context('./', true, /\.js$/))

export default Models