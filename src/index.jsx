import React from 'react'
import {render} from 'react-dom'
import {GraphicDisplayStyle, 
    GraphicDisplay, 
    DisplayRow, 
    Header, 
    DataGraphic, 
    Divider, 
    MainDisclaimer, 
    GraphicContainer,
    GraphicHeader, 
    GraphicDisclaimer, 
    SingleNumber, 
    ToplineRow , 
    ToplineElement, 
    Footer} from './layout.jsx'

const WHICH_VERSION = 'release'
const RELEASE_DATE = new Date('2017-11-14')
const DATA_FORMAT = 'json'

function qv(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    var out
    vars.forEach(pair=>{
        pair = pair.split('=')
        if (decodeURIComponent(pair[0]) == variable) {
            out = decodeURIComponent(pair[1])
        }
    })
    return out
}

function handleFormat(data) {
    var out = DATA_FORMAT === 'json' ? data.query_result.data.rows : data
    return out
}

var displays = {
    successfulInstalls: {
        id: "successfulInstalls",
        title: "Successful Installs",
        description: "the percentage of attempted installs that are successful",
        plotArgs: {format: 'Percentage'},
        source: "https://sql.telemetry.mozilla.org/queries/3648#7201",
        apiURI: `https://sql.telemetry.mozilla.org/api/queries/3648/results.${DATA_FORMAT}?api_key=NNEptnmnH7Wt7XbXkzMwVEEdKOCkwUZkOIuA1hcs`,
        format: DATA_FORMAT,
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
        description: 'the percentage of our Daily Active Users (DAUs) coming from Firefox 57 profiles',
        polling: ()=>{},
        source: "https://sql.telemetry.mozilla.org/queries/48512/source#130992",
        apiURI: `https://sql.telemetry.mozilla.org/api/queries/48552/results.${DATA_FORMAT}?api_key=OjrW1fBixUDsqinC00X3P6JPGTk7A9iNjwYeRd8h`,
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
        title: "New Users",
        id: "newUsers",
        description: "The number of new Firefox 57 profiles",
        format: DATA_FORMAT,
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'submission', '%Y%m%d')
            return data
        },
        xAccessor: 'submission',
        yAccessor: 'new_profiles',
        apiURI: `https://sql.telemetry.mozilla.org/api/queries/48504/results.${DATA_FORMAT}?api_key=xPo352uOKROX3xktCOU8t38wgTSDkOdWZWLRamSt`,
        source: "https://sql.telemetry.mozilla.org/queries/48504/source#130999"
    },

    dau: {
        title: "Daily Active Users (DAUs)",
        id: 'dau',
        description: "Daily Active Users (DAU), smoothed over the previous 7 days",
        apiURI: `https://sql.telemetry.mozilla.org/api/queries/48553/results.${DATA_FORMAT}?api_key=EBSmbDQLOUxuqqTXIjax1ARNUYRcqn9y7UiHca3r`,
        source: "https://sql.telemetry.mozilla.org/queries/48553/source",
        format: DATA_FORMAT,
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            return data
        },
        xAccessor: 'date',
        yAccessor: 'smooth56'
    },

    stability: {
        title: "Crash Rate",
        description: "(Browser Crashes + Content Crashes - Content Shutdown Crashes) per 1,000 hours",
        format: DATA_FORMAT,
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
        apiURI: `https://sql.telemetry.mozilla.org/api/queries/1092/results.${DATA_FORMAT}?api_key=f7dac61893e040ca59c76fd616f082479e2a1c85`
    },

    pagesVisited: {
        title: "Total Pages Visited",
        id: "pagesVisited",
        description: "Total number of URIs visited",
        format: DATA_FORMAT,
        apiURI: `https://sql.telemetry.mozilla.org/api/queries/48561/results.${DATA_FORMAT}?api_key=VhhFFQa8sFzCK9Y96KMoOSXGtSivXFyUIpOVBEPe`,
        source: 'https://sql.telemetry.mozilla.org/queries/48561/source',
        preprocessor: (data) => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            return data
        },
        xAccessor: 'date',
        yAccessor: ['uri56', 'uriAll'],
        plotArgs: {legend: ['Quantum', 'All']}
    },

    sessionHours: {
        title: "Total Session Hours",
        id: "sessionHours",
        description: "Total number of hours logged by Firefox 57 profiles",
        apiURI: `https://sql.telemetry.mozilla.org/api/queries/48558/results.${DATA_FORMAT}?api_key=dlqKmwx4TP8oiF2aOiSAfwDCFVTbrCUmOOw7gWwq`,
        source: 'https://sql.telemetry.mozilla.org/queries/48558/source',
        format: DATA_FORMAT,
        preprocessor: data => {
            data = handleFormat(data)
            data = MG.convert.date(data, 'date', '%Y%m%d')
            return data
        },
        xAccessor: 'date',
        yAccessor: ['thrs56', 'thrsAll'],
        plotArgs: {'legend': ['Quantum', 'All']}
    }
}

function dataGraphicCell(args) {
    var disclaimer = args.hasOwnProperty('disclaimer') ? <GraphicDisclaimer> <span style={{fontWeight:900, paddingRight:10}}>NOTE</span>  {args.disclaimer} </ GraphicDisclaimer> : ''
    return (
        <GraphicContainer title={args.title} format={args.format} apiURI={args.apiURI} preprocessor={args.preprocessor} source={args.source}>
            <GraphicHeader title={args.title} description={args.description} />
            <DataGraphic id={args.id}
                title={args.title}
                description={args.description}
                xAccessor={args.xAccessor}
                yAccessor={args.yAccessor}
                plotArgs={args.plotArgs || {}}
             />
        </GraphicContainer>
    )
}

var TwoByFour={}
TwoByFour.RowOne = (
    <DisplayRow>
        {dataGraphicCell(displays.uptake)}
        {dataGraphicCell(displays.newUsers)}
        {dataGraphicCell(displays.dau)}
    </DisplayRow>
)

TwoByFour.RowTwo = (
<DisplayRow>
    {dataGraphicCell(displays.successfulInstalls)}
    {dataGraphicCell(displays.pagesVisited)}
    {dataGraphicCell(displays.sessionHours)}
</DisplayRow>
)

function mainDisclaimer() {
    return (<MainDisclaimer>
                This is a very rough proof of concept. 
        The overall design is not solidified, the data is fake, and all the interactions are nonexistent. 
        Keep that in mind for now.
        </MainDisclaimer>)
}


render(
    <GraphicDisplay>
        <Header title='Firefox Quantum' subtitle='release metrics'  img='static/ff-quantum.png' />
        <ToplineRow>
            <ToplineElement value={(()=>{
                var msPerDay = 8.64e7;
                var x0 = RELEASE_DATE;
                var x1 = new Date();
                x0.setHours(12,0,0);
                x1.setHours(12,0,0);
                    return Math.abs(Math.round( (x1 - x0) / msPerDay ))
                })() + ' days'} label={new Date() < RELEASE_DATE ? 'Days Until Release' : 'Days Since Release'} />
            <ToplineElement label='Total Firefox Quantum Downloads' value='43,543,254' />
        </ToplineRow>
        {TwoByFour.RowOne}
        {TwoByFour.RowTwo}
        <Footer>
            <div>Data Pipeline + Product Management + Strategy &amp; Insights</div> 
            <div>inquiries re: data <a href='mailto:datapipeline@mozilla.com'>datapipeline@mozilla.com</a></div> 
            <div>inquiries re: dashboard - <a href='mailto:strategyandinsights@mozilla.com'>strategyandinsights@mozilla.com</a></div>
        </Footer>
    </ GraphicDisplay>, document.getElementById('page'))