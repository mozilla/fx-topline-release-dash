const DATA_FORMAT = 'json'

const TIME_HORIZON = 'daily'

function handleFormat(data) {
    var out = DATA_FORMAT === 'json' ? data.query_result.data.rows : data
    return out
}

var dataSources = {
    kiloUsageHours: {
        id: TIME_HORIZON === 'daily' ? 'kiloUsageHours_daily' : 'kiloUsageHours_hourly',
        title: "Total Usage",
        subtitle: "1000s of hrs.",
        hourlySource: "kiloUsageHours_hourly",
        description: "total hours browsed by Firefox Quantum users (in 1000s of hours)",
        source: "https://sql.telemetry.mozilla.org/queries/48763/source#131460",
        format: DATA_FORMAT,
        dataType: 'rate',
        //plotArgs: {y_label: '1000 hrs.'},
        preprocessor: data => {
            data = handleFormat(data)
            
            data = data.map(d=>{
                d.activity_time = new Date(d.activity_time)
                return d
            })
            if (TIME_HORIZON == 'daily') {
                data = MG.convert.number(data,'kuh_weekly_smoothed')    
            } else {
                data = MG.convert.number(data,'kuh_daily_smoothed')
            }
            return data
        },
        xAccessor: 'activity_time',
        yAccessor: TIME_HORIZON === 'daily' ? 'kuh_weekly_smoothed' : 'kuh_daily_smoothed'
    },

    successfulInstalls: {
        id: "successfulInstalls",
        title: "Install Success Rate",
        firstAvailableData: new Date('2017-11-15'),
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
        firstAvailableData: new Date('2017-11-15'),
        plotArgs: {format: 'Percentage'},
        description: 'percentage of Daily Active Users (DAUs) on Firefox Quantum',
        polling: ()=>{},
        dataType: 'percentage',
        source: "https://sql.telemetry.mozilla.org/queries/48512/source#130992",
        format: DATA_FORMAT,
        preprocessor: data => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'd', '%Y%m%d')
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
        id: TIME_HORIZON === 'daily' ? "newUsers_daily" : "newUsers_hourly",
        description: "new profile counts, Firefox Quantum",
        dataType: 'volume',
        format: DATA_FORMAT,
        preprocessor: (data) => {
            var xAccessor = TIME_HORIZON === 'daily' ? 'submission' : 'hour_interval'
            var xFormat = TIME_HORIZON === 'daily' ? '%Y%m%d' : "%Y-%m-%dT%H:%M:%S"
            data = handleFormat(data)
            var params = [data, xAccessor, xFormat]

            data = MG.convert.date(...params)
            data.sort((a,b)=>{
                return a[xAccessor] > b[xAccessor] ? 1 : -1
            })
            return data
        },
        xAccessor: TIME_HORIZON === 'daily' ? 'submission' : 'hour_interval',
        yAccessor: TIME_HORIZON === 'daily' ? 'new_profiles' : 'hourly_new_profiles_smooth',
        source: "https://sql.telemetry.mozilla.org/queries/48504/source#130999"
    },
    dau: {
        title: "Daily Active Users",
        id: 'dau',
        dataType: 'volume',
        hasHourlySource: false,
        firstAvailableData: new Date('2017-11-15'),
        description: "total Daily Active Users (DAU), Firefox Quantum (smoothed over the previous 7 days)",
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
        hasHourlySource: false,
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
        hasHourlySource: false,
        firstAvailableData: new Date('2017-11-15'),
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
        hasHourlySource: false,
        firstAvailableData: new Date('2017-11-15'),
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