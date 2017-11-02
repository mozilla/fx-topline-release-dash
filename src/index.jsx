import React from 'react'
import {render} from 'react-dom'
import {GraphicDisplay, DisplayRow, Header, DataGraphic, Divider, MainDisclaimer, GraphicContainer, GraphicDisclaimer, SingleNumber, ToplineRow , ToplineElement, Footer} from './layout.jsx'

const WHICH_VERSION = 'beta'
const RELEASE_DATE = new Date('2017-11-14')

var displays = {
    successfulInstalls: {
        title: "Successful Installs",
        description: "the percentage of attempted installs that are successful",
        apiURI: 'https://sql.telemetry.mozilla.org/api/queries/3648/results.csv?api_key=NNEptnmnH7Wt7XbXkzMwVEEdKOCkwUZkOIuA1hcs',
        formatData: data => {
            
            data = MG.convert.number(data, 'instances')
            var tmp = data.reduce((obj, d) => {
                if (!obj.hasOwnProperty(d.day)) obj[d.day] = {}
                obj[d.day][d.succeeded] = d.instances
                return obj
            }, {})
            
            var out = Object.keys(tmp).reduce((arr,d)=> {
                var di = tmp[d]
                var True = di.True || 0
                var False = di.False || 0
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
        description: 'the percentage of our Daily Active Users (DAUs) coming from Firefox 57 profiles',
        polling: ()=>{},
        apiURI: 'https://sql.telemetry.mozilla.org/api/queries/48552/results.csv?api_key=OjrW1fBixUDsqinC00X3P6JPGTk7A9iNjwYeRd8h',
        formatData: data => {
            data = MG.convert.date(data, 'd', '%Y%m%d')
            data = MG.convert.number(data, 'uptake')
            data = data.map(d => {
                d.uptake = d.uptake / 100
                return d
            })
            return data
        },
        xAccessor: 'd',
        yAccessor: 'uptake',
        scaffoldData:  i=>Math.sin(i/10)*10 + (Math.random()-.5)*5,
    },

    newUsers: {
        title: "New Users",
        description: "The number of new Firefox 57 profiles",
        scaffoldData: i=>(Math.exp(i/30)*10 +  (Math.random()-.5)*10)*100000,
        formatData: (data) => {
            
            data = MG.convert.date(data, 'submission', '%Y%m%d')
            data = MG.convert.number(data, 'new_profiles')
            return data
        },
        xAccessor: 'submission',
        yAccessor: 'new_profiles',
        apiURI: 'https://sql.telemetry.mozilla.org/api/queries/48504/results.csv?api_key=xPo352uOKROX3xktCOU8t38wgTSDkOdWZWLRamSt'
    },

    dau: {
        title: "Daily Active Users (DAUs)",
        description: "Daily Active Users (DAU), smoothed over the previous 7 days",
        apiURI: 'https://sql.telemetry.mozilla.org/api/queries/48553/results.csv?api_key=EBSmbDQLOUxuqqTXIjax1ARNUYRcqn9y7UiHca3r',
        formatData: (data) => {
            data = MG.convert.date(data, 'date', '%Y%m%d')
            data = MG.convert.number(data, 'smooth56')
            return data
        },
        xAccessor: 'date',
        yAccessor: 'smooth56'
    },

    stability: {
        title: "Crash Rate",
        description: "(Browser Crashes + Content Crashes - Content Shutdown Crashes) per 1,000 hours",
        scaffoldData: i=>  100000 + (Math.random()*Math.cos(i/10)*10 + 1) * 500 - i*100,
        xAccessor: 'activity_date',
        yAccessor: 'crash_rate',
        formatData: (data) => {
            data = MG.convert.date(data, 'activity_date')
            data = MG.convert.number(data, 'usage_khours')
            data = MG.convert.number(data, 'M + C - S')
            data = data.map(d=>{
                d.crash_rate = d['M + C - S'] / d.usage_khours
                d.date = d.activity_date
                return d
            })
            data = data.filter(d=>d.channel === WHICH_VERSION && d.build_version=='57.0' && d.date > new Date('2017-10-01')) // && 
            return data
        },
        apiURI: 'https://sql.telemetry.mozilla.org/api/queries/1092/results.csv?api_key=f7dac61893e040ca59c76fd616f082479e2a1c85'
    },

    pagesVisited: {
        title: "Total Pages Visited",
        description: "Total number of URIs visited",
        scaffoldData: i=> 50000 + 10000 * (Math.log((i+1)/10) + 1) +  Math.random()*3000,
    },

    sessionHours: {
        title: "Total Session Hours",
        description: "Total number of hours logged by Firefox 57 profiles",
        scaffoldData: i=> 500000 + 100000 * (Math.log((i+1)/10)*.5 + 1) +  Math.random()*30000,
    }
}


/*

    <GraphicContainer>
        <div style={{height: '60px'}}></div>
        <SingleNumber value={'5,543,105'} label={'Total Downloads'} />
        <SingleNumber value={(()=>{
            var msPerDay = 8.64e7;
            var x0 = RELEASE_DATE;
            var x1 = new Date();
            x0.setHours(12,0,0);
            x1.setHours(12,0,0);
                return Math.abs(Math.round( (x1 - x0) / msPerDay ))
            })() + ' days'} label={new Date() < RELEASE_DATE ? 'Days Until Release' : 'Days Since Release'} />
    </ GraphicContainer>
*/


var TwoByFour={}
TwoByFour.RowOne = (<DisplayRow>

<GraphicContainer apiURI={displays.uptake.apiURI} formatData={displays.uptake.formatData} >
    <DataGraphic id="uptake"   title={displays.uptake.title} 
                            description={displays.uptake.description} 
                            xAxisLabel={displays.uptake.xAxisLabel}
                            xAccessor={displays.uptake.xAccessor}
                            yAccessor={displays.uptake.yAccessor}
                            plotArgs={{format: 'Percentage'}} />
</GraphicContainer>
<GraphicContainer apiURI={displays.newUsers.apiURI} formatData={displays.newUsers.formatData} scaffoldData={displays.newUsers.scaffoldData}>

    <DataGraphic id="newUsers" title={displays.newUsers.title}  
                            description={displays.newUsers.description}
                            xAxisLabel={displays.newUsers.xAxisLabel}
                            xAccessor={displays.newUsers.xAccessor}
                            yAccessor={displays.newUsers.yAccessor} />
</GraphicContainer>

<GraphicContainer apiURI={displays.dau.apiURI} formatData={displays.dau.formatData} >

    <DataGraphic id="dau"      title={displays.dau.title} 
                            description={displays.dau.description}
                            xAccessor={displays.dau.xAccessor}
                            yAccessor={displays.dau.yAccessor}
                             />
</GraphicContainer>

</DisplayRow>)

/*
            <GraphicDisclaimer>
                <span style={{fontWeight:900, paddingRight:10}}>NOTE</span> 
                <span style={{fontStyle: 'italic'}}>
                    we expect this metric to settle down within 6-18 hours of release.
                </span>
            </GraphicDisclaimer>
*/

TwoByFour.RowTwo = (
<DisplayRow>
    <GraphicContainer apiURI={displays.successfulInstalls.apiURI} formatData={displays.successfulInstalls.formatData} >
        <DataGraphic id="successfulInstalls"    title={displays.successfulInstalls.title}    
                                        description={displays.successfulInstalls.description}
                                        xAccessor={displays.successfulInstalls.xAccessor}
                                        yAccessor={displays.successfulInstalls.yAccessor}
                                        plotArgs={{format: 'Percentage'}}
                                         />

    </GraphicContainer>

        <GraphicContainer scaffoldData={displays.pagesVisited.scaffoldData}>
            <DataGraphic id="pagesVisited" title={displays.pagesVisited.title} 
                                       description={displays.pagesVisited.description}
                                       
                                       xAxisLabel={displays.pagesVisited.xAxisLabel}
                                       xAccessor='x'
                            yAccessor='y' />
        </GraphicContainer>

        <GraphicContainer scaffoldData={displays.sessionHours.scaffoldData}>

            <DataGraphic id="sessionHours" title={displays.sessionHours.title}     
                                       description={displays.sessionHours.description}
                                       xAxisLabel={displays.sessionHours.xAxisLabel}
                                       xAccessor='x'
                            yAccessor='y' />
        </GraphicContainer>

    </DisplayRow>

)

function mainDisclaimer() {
    return (<MainDisclaimer>
                This is a very rough proof of concept. 
        The overall design is not solidified, the data is fake, and all the interactions are nonexistent. 
        Keep that in mind for now.
        </MainDisclaimer>)
}

/* 
    <Footer>
        <div> Here is a footer </div>
    </Footer>

*/



render(
<GraphicDisplay>
    <Header title='Firefox Quantum' subtitle='release metrics' secondText='last updated: 8 minutes ago' img='ff-57.png' />
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

</ GraphicDisplay>    
    , document.getElementById('page'))