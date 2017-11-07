const DATA_FORMAT = 'json'

function handleFormat(data) {
    var out = DATA_FORMAT === 'json' ? data.query_result.data.rows : data
    return out
}

var dataSources = {
    successfulInstalls: {
        id: "successfulInstalls",
        title: "Successful Installs",
        description: "the percentage of attempted installs that are successful",
        plotArgs: {format: 'Percentage'},
        source: "https://sql.telemetry.mozilla.org/queries/3648#7201",
        format: DATA_FORMAT,
        dataType: 'percentage',
        preprocessor: data => {
            data = handleFormat(data)

            var tmp = data.reduce((obj, d) => {
                if (!obj.hasOwnProperty(d.day)) obj[d.day] = {}
                obj[d.day][d.succeeded] = d.instances
                return obj
            }, {})

            var out = Object.keys(tmp).reduce((arr,d)=> {
                var di = tmp[d]
                var True = di[true] || 0
                var False = di[false] || 0
                arr.push({day: d, successfulInstalls: True  / (True + False)})
                return arr
            }, [])

            out = MG.convert.date(out, 'day')

            return out
        },
        xAccessor: 'day',
        yAccessor: 'successfulInstalls'
    },

    uptake: {
        title: 'Uptake',
        id: "uptake",
        plotArgs: {format: 'Percentage'},
        description: 'percentage of Daily Active Users (DAUs) on Firefox Quantum',
        polling: ()=>{},
        dataType: 'percentage',
        source: "https://sql.telemetry.mozilla.org/queries/48512/source#130992",
        format: DATA_FORMAT,
        preprocessor: data => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'd', '%Y%m%d')
            //data = MG.convert.number(data, 'uptake')
            data = data.map(d => {
                d.uptake = d.uptake / 100
                return d
            })
            return data
        },
        xAccessor: 'd',
        yAccessor: 'uptake'
    },

    newUsers: {
        title: "New User Count",
        id: "newUsers",
        description: "new profile counts, Firefox Quantum",
        dataType: 'volume',
        format: DATA_FORMAT,
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'submission', '%Y%m%d')
            return data
        },
        xAccessor: 'submission',
        yAccessor: 'new_profiles',
        source: "https://sql.telemetry.mozilla.org/queries/48504/source#130999"
    },

    dau: {
        title: "Daily Active Users",
        id: 'dau',
        dataType: 'volume',
        description: "total Daily Active Users (DAU), Firefox Quantum (smoothed over the previous 7 days)",
        source: "https://sql.telemetry.mozilla.org/queries/48553/source",
        format: DATA_FORMAT,
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            return data
        },
        xAccessor: 'date',
        yAccessor: 'smooth_dau'
    },

    stability: {
        title: "Crash Rate",
        description: "for Firefox Quantum users, the rate (Browser Crashes + Content Crashes - Content Shutdown Crashes) per 1,000 hours",
        format: DATA_FORMAT,
        dataType: 'rate',
        xAccessor: 'activity_date',
        yAccessor: 'crash_rate',
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'activity_date')
            data = data.map(d=>{
                d.crash_rate = d['M + C - S'] / d.usage_khours
                d.date = d.activity_date
                return d
            })
            data = data.filter(d=>d.channel === WHICH_VERSION && d.build_version=='57.0' && d.date > new Date('2017-10-01'))
            return data
        },
    },

    pagesVisited: {
        title: "Avg. Pages Visited",
        id: "pagesVisited",
        dataType: 'volume',
        description: "average number of URIs visited (per hour) per user, Firefox Quantum vs all",
        format: DATA_FORMAT,
        source: 'https://sql.telemetry.mozilla.org/queries/48587/source',
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            return data
        },
        xAccessor: 'date',
        yAccessor: ['avg_uri_new', 'avg_uri_all'],
        plotArgs: {legend: ['Quantum', 'All']}
    },

    sessionHours: {
        title: "Avg. Session Hours",
        id: "sessionHours",
        dataType: 'rate',
        description: "average number of hours spent in browser per user, Firefox Quantum vs all",
        source: 'https://sql.telemetry.mozilla.org/queries/48583/source',
        format: DATA_FORMAT,
        preprocessor: data => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            return data
        },
        xAccessor: 'date',
        yAccessor: ['avg_subsess_hours_new', 'avg_subsess_hours_all'],
        plotArgs: {'legend': ['Quantum', 'All']}
    }
}

export {dataSources}