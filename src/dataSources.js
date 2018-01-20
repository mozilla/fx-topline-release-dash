const DATA_FORMAT = 'json'
const LETS_SIMULATE = false
const TRUNCATE_CURRENT_DATA_FOR_NOW = false
const TRUNCATE_VAL = 60

function dt(d){
    return d3.timeParse('%Y-%m-%d')(d)
}

function parseLocalTime(d) {
    
}

/* please don't touch this stuff unless you know what you're doing, yeah? */

var RELEASE_DATE = dt('2017-11-14')
var DAY_AFTER = dt('2017-11-15')
var THREE_DAYS_AFTER = dt('2017-11-17')

var FIRST_MAIN_SUMMARY_DATE = '2017-11-13'
var NOW = dt('2017-11-15')
//NOW.setHours(6,0,0,0)
//var NOW = dt('2017-11-14')
//NOW.setHours(8,0,0,0)
var NOW = new Date()
//var NOW = dt('2017-11-24')

var PANIC_SIM = true

//var MODE = 'game-time'

var MODE = 'PANIC'

var CURRENT_SITUATION
var RESOLUTION

if (NOW <= DAY_AFTER) {
    RESOLUTION = 'hourly'
    CURRENT_SITUATION='day-of'
    
} else {
    RESOLUTION = 'daily'
    
    CURRENT_SITUATION = 'rest-of-release'
}

// if (CURRENT_SITUATION == 'day-after' && LETS_SIMULATE) {
//     var NOW = dt('2017-11-15')
// }

// if (CURRENT_SITUATION == 'couple-days-after' && LETS_SIMULATE) {
//     var NOW = dt('2017-11-17')
// }

// if (CURRENT_SITUATION == 'couple-weeks-after' && LETS_SIMULATE) {
//     var NOW = dt('2017-12-09')
// }


function handleFormat(data) {
    var out = DATA_FORMAT === 'json' ? data.query_result.data.rows : data
    return out
}

var DAY_FORMAT = '%b %d, %Y '
var HOUR_FORMAT = '%I:%M %p  '

var xMouseovers = {
    uptake: DAY_FORMAT,
    kiloUsageHours: RESOLUTION=='daily' ? DAY_FORMAT : HOUR_FORMAT,
    successfulInstalls:DAY_FORMAT,
    newUsers: RESOLUTION=='daily' ? DAY_FORMAT : HOUR_FORMAT,
    pagesVisited:DAY_FORMAT,
    sessionHours:DAY_FORMAT
}


var plotArgs = {
    show_rollover_text: CURRENT_SITUATION == 'day-after' ? false : true,
    //x_mouseover: RESOLUTION=='daily' ? '%b %d, %Y ' : '%I:%M %p  '
}

if (CURRENT_SITUATION == 'day-of') {
    plotArgs.max_x = dt('2017-11-15')
    plotArgs.max_x.setHours(6,0,0,0)
    plotArgs.min_x = dt('2017-11-13')
}

if (CURRENT_SITUATION == 'rest-of-release') {
    plotArgs.min_x = dt('2017-11-13')
    plotArgs.max_x = THREE_DAYS_AFTER
    plotArgs.max_x.setHours(6,0,0,0)
    
    if (THREE_DAYS_AFTER < NOW) {
        plotArgs.max_x = NOW
    }
}

// if (TRUNCATE_CURRENT_DATA_FOR_NOW) {
//     plotArgs.max_x = dt('2017-12-01')
// }

// if (MODE=='preshow') {
//     plotArgs.markers = [{date: RELEASE_DATE, label:'release'}]
// }

function simulateRelease(data, xAccessor, yAccessor, onlyDaily=false) {
    //th=day-of, day-after, whatever
    // if (CURRENT_SITUATION==='day-of') {
    //     data = data.slice(0,9)
    //     data.forEach((d,i)=>{
    //         d[xAccessor] = dt('2017-11-14')
    //         d[xAccessor].setHours(i+1,0,0,0)
    //     })
    // } else if (CURRENT_SITUATION=='day-after') {
    //     data.forEach((d,i)=>{
    //         d[xAccessor] = dt('2017-11-14')
    //         d[xAccessor].setHours(i+1,0,0,0)
    //     })
    //     data = data.slice(0,1)
    // } else if (CURRENT_SITUATION=='couple-days-after') {
    //     data.forEach((d,i)=>{
    //         d[xAccessor] = dt('2017-11-14')
    //         d[xAccessor].setDate(d[xAccessor].getDate()+i)
    //     })
    //     data = data.slice(0,3)
    // } else if (CURRENT_SITUATION=='couple-weeks-after') {
    //     data.forEach((d,i)=>{
    //         d[xAccessor] = dt('2017-11-14')
    //         d[xAccessor].setDate(d[xAccessor].getDate()+i)
    //     })
    //     data = data.slice(0,21)
    // }
    // if (onlyDaily) {
    //     var lastPt = Object.assign({}, data[0])
    //     lastPt[xAccessor].setDate(2017,11,13)
    //     data.unshift(lastPt)
    // }
    
    return data
}

//yax_format: CURRENT_SITUATION == 'day-of' ? d3.format('.3%') : d3.format('%')

function parseISOLocal(s) {
  var b = s.split(/\D/);
  var now = new Date();
  return new Date(b[0], b[1]-1, b[2], b[3] - (now.getTimezoneOffset()/60), b[4], b[5]);
}

var dataSources = {
    cumulativeNewProfiles: {
        id: 'cumulativeNewProfiles',
        source: "https://sql.telemetry.mozilla.org/queries/49093/source",
        preprocessor: data => {
            data = handleFormat(data)            
            return data[0].total_new_profiles
        }
    },
    kiloUsageHours: {
        id: RESOLUTION === 'daily' ? 'kiloUsageHours_daily' : 'kiloUsageHours_hourly',
        title: "Total Usage",
        subtitle: "1000s of hrs.",
        hourlySource: "kiloUsageHours_hourly",
        description: "total hours browsed by Firefox Quantum users (in 1000s of hours)",
        source: RESOLUTION === 'daily' ? "https://sql.telemetry.mozilla.org/queries/48819/source" : "https://sql.telemetry.mozilla.org/queries/48817/source#131589",
        format: DATA_FORMAT,
        graphResolution: RESOLUTION,
        showResolutionLabel: true,
        dataType: 'rate',
        plotArgs: Object.assign({}, plotArgs, {x_mouseover: xMouseovers.kiloUsageHours}),
        preprocessor: data => {
            data = handleFormat(data)
            data = data.map(d=>{
                d.activity_time = parseISOLocal(d.activity_time)//(new Date(Date.parse(d.activity_time)).toUniversalTime())
                return d
            })
            if (RESOLUTION == 'daily') {
                data = MG.convert.number(data,'kuh_weekly_smoothed')
                data.forEach(d=>{
                    d.activity_time.setHours(0,0,0,0)
                })    
            } else {
                data = MG.convert.number(data,'kuh_daily_smoothed')
            }

            if (LETS_SIMULATE) data = simulateRelease(data, 'activity_time')
            if (TRUNCATE_CURRENT_DATA_FOR_NOW) data = data.slice(0,TRUNCATE_VAL)
            
            return data
        },
        xAccessor: 'activity_time',
        yAccessor: RESOLUTION === 'daily' ? 'kuh_weekly_smoothed' : 'kuh_daily_smoothed'
    },

    successfulInstalls: {
        id: "successfulInstalls",
        title: "Install Success Rate",
        graphResolution: 'daily',
        showResolutionLabel: true,
        firstAvailableData: dt(FIRST_MAIN_SUMMARY_DATE),
        description: "percentage of attempted Firefox Quantum installs that are successful",
        plotArgs: Object.assign({}, plotArgs, {x_mouseover: xMouseovers.successfulInstalls}, {format: 'Percentage', max_y:1}),
        source: "https://sql.telemetry.mozilla.org/queries/3648#7201",
        format: DATA_FORMAT,
        dataType: 'percentage',
        preprocessor: data => {
            data = handleFormat(data)

            if (LETS_SIMULATE) data = [{day: '2017-11-13', succeeded: false, instances: 20000},{day: '2017-11-13', succeeded: true, instances: 250900}]

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

            if (LETS_SIMULATE) out = simulateRelease(out, 'day')
            if (TRUNCATE_CURRENT_DATA_FOR_NOW) data = data.slice(0,TRUNCATE_VAL)
            
            return out
        },
        xAccessor: 'day',
        yAccessor: 'successfulInstalls'
    },

    uptake: {
        title: 'Uptake',
        id: "uptake",
        graphResolution: 'daily',
        showResolutionLabel: true,
        firstAvailableData: dt(FIRST_MAIN_SUMMARY_DATE),
        plotArgs: Object.assign({}, plotArgs, {x_mouseover: xMouseovers.uptake}, {format: 'Percentage', max_y: CURRENT_SITUATION == 'day-of' ? 1 : 1}),
        description: 'percentage of Daily Active Users (DAUs) on Firefox Quantum',
        polling: ()=>{},
        dataType: 'percentage',
        source: "https://sql.telemetry.mozilla.org/queries/48512/source#130992",
        annotations: "data/throttleRate.json",
        annotationProcessor: annotations => {
            var rules = annotations.rules
            rules.sort((a,b)=>a.timestamp > b.timestamp)
            var throttles = rules.map((r)=>{
                return {label: r.backgroundRate +'%', d: (new Date(r.timestamp))}
            })
            return throttles
        },
        format: DATA_FORMAT,
        preprocessor: data => {
            data = handleFormat(data)
            if (LETS_SIMULATE) data = [{d: '20171113', uptake: .89}]

            data = MG.convert.date(data, 'd', '%Y%m%d')
            data = data.map(d => {
                d.uptake = d.uptake / 100
                return d
            })
            //if (LETS_SIMULATE) data = simulateRelease(data, 'd')
            //if (TRUNCATE_CURRENT_DATA_FOR_NOW) data = data.slice(0,TRUNCATE_VAL)            
            //console.log(data)
            return data
        },
        xAccessor: 'd',
        yAccessor: 'uptake'
    },

    newUsers: {
        title: "New Profile Count",
        subtitle: "non-cumulative",
        graphResolution: RESOLUTION,
        showResolutionLabel: true,
        id: RESOLUTION === 'daily' ? "newUsers_daily" : "newUsers_hourly",
        description: "new profile counts, Firefox Quantum",
        dataType: 'volume',
        plotArgs: Object.assign({}, plotArgs, {x_mouseover: xMouseovers.newUsers}),
        format: DATA_FORMAT,
        preprocessor: (data) => {
            var xAccessor = RESOLUTION === 'daily' ? 'submission' : 'hour_interval'
            var xFormat = RESOLUTION === 'daily' ? '%Y%m%d' : "%Y-%m-%dT%H:%M:%S"
            data = handleFormat(data)

            var params = [data, xAccessor, xFormat]

            if (RESOLUTION === 'hourly') {
                data = data.map((d)=>{
                    d[xAccessor] = parseISOLocal(d[xAccessor])//(new Date(Date.parse(d.activity_time)).toUniversalTime())
                    return d
                })
            } else {
                //console.log('sodifn', data, ...params)
                data = MG.convert.date(data, xAccessor, xFormat)
            }

            data.sort((a,b)=>{
                return a[xAccessor] > b[xAccessor] ? 1 : -1
            })

            if (LETS_SIMULATE) data = simulateRelease(data, xAccessor)
            if (TRUNCATE_CURRENT_DATA_FOR_NOW) data = data.slice(0,30)
            return data
        },
        xAccessor: RESOLUTION === 'daily' ? 'submission' : 'hour_interval',
        yAccessor: RESOLUTION === 'daily' ? 'new_profiles_smooth' : 'hourly_new_profiles_smooth',
        source: RESOLUTION === 'daily' ? "https://sql.telemetry.mozilla.org/queries/48504/source#130999" : "https://sql.telemetry.mozilla.org/queries/48509/source#131004"
    },
    dau: {
        title: "Daily Active Users",
        id: 'dau',
        graphResolution: 'daily',
        showResolutionLabel: true,
        dataType: 'volume',
        hasHourlySource: false,
        firstAvailableData: new Date(FIRST_MAIN_SUMMARY_DATE),
        plotArgs: Object.assign({}, plotArgs, {x_mouseover: xMouseovers.uptake}),
        description: "total Daily Active Users (DAU), Firefox Quantum (smoothed over the previous 7 days)",
        format: DATA_FORMAT,
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            if (TRUNCATE_CURRENT_DATA_FOR_NOW) data = data.slice(0,TRUNCATE_VAL)                        
            if (LETS_SIMULATE) data = [{date: dt('2017-11-13'), smooth_dau: 100323043}]
            //if (LETS_SIMULATE) data = simulateRelease(data, 'date')
            return data
        },
        xAccessor: 'date',
        yAccessor: 'smooth_dau'
    },

    stability: {
        title: "Crash Rate",
        hasHourlySource: false,
        graphResolution: 'daily',
        showResolutionLabel: true,
        description: "for Firefox Quantum users, the rate (Browser Crashes + Content Crashes - Content Shutdown Crashes) per 1,000 hours",
        format: DATA_FORMAT,
        plotArgs: Object.assign({}, plotArgs, {x_mouseover: xMouseovers.newUsers}),
        dataType: 'rate',
        xAccessor: 'activity_date',
        yAccessor: ['crash_rate'],
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'activity_date')
            data = data.map(d=>{
                d.crash_rate = d['M + C - S'] / d.usage_khours
                d.date = d.activity_date
                return d
            })
            data = data.filter(d=>d.channel === WHICH_VERSION && d.build_version=='57.0' && d.date > new Date('2017-10-01'))
            if (TRUNCATE_CURRENT_DATA_FOR_NOW) data = data.slice(0,TRUNCATE_VAL)            
            if (LETS_SIMULATE) data = [{activity_date: dt('2017-11-13'), crash_rate: .1}]
            //if (LETS_SIMULATE) data = simulateRelease(data, 'activity_date')
            return data
        },
    },

    pagesVisited: {
        title: "Pages Visited",
        graphResolution: 'daily',
        showResolutionLabel: true,
        subtitle: "avg. per user per hr.",
        hasHourlySource: false,
        firstAvailableData: dt(FIRST_MAIN_SUMMARY_DATE),  
        id: "pagesVisited",
        dataType: 'rate',
        description: "average number of URIs visited (per hour) per user, Firefox Quantum vs all",
        format: DATA_FORMAT,
        source: 'https://sql.telemetry.mozilla.org/queries/48587/source',
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            if (TRUNCATE_CURRENT_DATA_FOR_NOW) data = data.slice(0,30)
            if (LETS_SIMULATE) data = [{date: dt('2017-11-13'), avg_uri_new: 50.4, avg_uri_all: 50.2 }]          
            //if (LETS_SIMULATE) data = simulateRelease(data, 'date')
            return data
        },
        xAccessor: 'date',
        yAccessor: ['avg_uri_new', 'avg_uri_all'],
        plotArgs: Object.assign({}, plotArgs, {x_mouseover: xMouseovers.pagesVisited}, {'legend': ['Quantum', 'All']}),
    },

    sessionHours: {
        title: "Session Hours",
        graphResolution: 'daily',
        showResolutionLabel: true,
        subtitle: "avg. per user",
        id: "sessionHours",
        hasHourlySource: false,
        firstAvailableData: dt(FIRST_MAIN_SUMMARY_DATE),
        plotArgs: Object.assign({}, plotArgs, {x_mouseover: xMouseovers.sessionHours}, {'legend': ['Quantum', 'All']}),
        dataType: 'rate',
        description: "average number of hours spent in browser per user, Firefox Quantum vs all",
        source: 'https://sql.telemetry.mozilla.org/queries/48583/source',
        format: DATA_FORMAT,
        preprocessor: data => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            if (TRUNCATE_CURRENT_DATA_FOR_NOW) data = data.slice(0,TRUNCATE_VAL)
            if (LETS_SIMULATE) data = [{date: dt('2017-11-13'), avg_subsess_hours_new: 5.6, avg_subsess_hours_all: 5.2 }]            
            //if (LETS_SIMULATE) data = simulateRelease(data, 'date')
            return data
        },
        xAccessor: 'date',
        yAccessor: ['avg_subsess_hours_new', 'avg_subsess_hours_all']
    }
}

export {dataSources, RESOLUTION, NOW, RELEASE_DATE, MODE, dt}
