import React from 'react'
import {render} from 'react-dom'
import {dataSources as displays, RELEASE_DATE, NOW, RESOLUTION, MODE} from './dataSources.js'

import {GraphicDisplayStyle,
    GraphicDisplay,
    DisplayRow,
    Header,
    DataGraphic,
    Divider,
    MainDisclaimer,
    GraphicContainer,
    GraphicHeader,
    GraphicPlaceholder,
    GraphicDisclaimer,
    SingleNumber,
    ToplineRow ,
    ToplineElement,
    Footer} from './layout.jsx'





function showDisplay(args) {
    if ((args.hasOwnProperty('firstAvailableData') && args.firstAvailableData > NOW)) {
        //if (false) {
        return dataGraphicPlaceholder(args)
    } else {
        return dataGraphicCell(args)
    }
}

function dataGraphicCell(args) {
    var disclaimer = args.hasOwnProperty('disclaimer') ? <GraphicDisclaimer> <span style={{fontWeight:900, paddingRight:10}}>NOTE</span>  {args.disclaimer} </ GraphicDisclaimer> : ''
    return (
        <GraphicContainer showResolutionLabel={args.showResolutionLabel} mode={MODE} resolution={args.graphResolution} isActive={true} xAccessor={args.xAccessor} yAccessor={args.yAccessor} dataType={args.dataType} id={args.id} title={args.title} description={args.description} format={args.format} preprocessor={args.preprocessor} source={args.source}>
            <GraphicHeader subtitle={args.subtitle} title={args.title} secondText={function(){ return this.props.lastDatum[args.yAccessor]}} />
            <DataGraphic 
                title={args.title}
                description={args.description}
                xAccessor={args.xAccessor}
                yAccessor={args.yAccessor}
                plotArgs={args.plotArgs || {}}
             />

        </GraphicContainer>
    )
}

function dataGraphicPlaceholder(args) {
    return (
        <GraphicContainer isActive={false} yAccessor={args.yAccessor} dataType={args.dataType} id={args.id} title={args.title} description={args.description} format={args.format} preprocessor={args.preprocessor} source={args.source}>
            <GraphicHeader subtitle={args.subtitle} title={args.title} secondText={function(){ return this.props.lastDatum[args.yAccessor]}} />
            <GraphicPlaceholder aboveText='first datapoint available on' belowText={d3.timeFormat('%Y/%m/%d')(args.firstAvailableData)} />
        </GraphicContainer>
    )
}

var TwoByFour={}
TwoByFour.RowOne = (
    <DisplayRow>
        {showDisplay(displays.newUsers)}
        {showDisplay(displays.uptake)}
        {showDisplay(displays.kiloUsageHours)}
    </DisplayRow>
)

TwoByFour.RowTwo = (
<DisplayRow>
    {showDisplay(displays.successfulInstalls)}
    {showDisplay(displays.pagesVisited)}
    {showDisplay(displays.sessionHours)}
</DisplayRow>
)

var daysSinceRelease

var msPerDay = 8.64e7;
var x0 = RELEASE_DATE;
var x1 = NOW;
x0.setHours(12,0,0);
x1.setHours(12,0,0);

daysSinceRelease = Math.abs(Math.round( (x1 - x0) / msPerDay ))
daysSinceRelease = daysSinceRelease + (daysSinceRelease === 1 ? ' day': ' days')

var nowish = d3.timeFormat('%Y-%m-%d')(NOW)
var releaseish = d3.timeFormat('%Y-%m-%d')(RELEASE_DATE)
var releaseTxt = nowish < releaseish ? 'Days Until Release' : (nowish > releaseish ? 'Days Since Release' : 'Release Day')
if (releaseTxt == 'Release Day') {
    releaseTxt = 'What Day Is It?'
    daysSinceRelease = 'Release Day'
}

render(
    <GraphicDisplay>
        <Header title='Firefox Quantum' subtitle='impact metrics'  img='static/ff-quantum.png' />
        <ToplineRow>
            <ToplineElement 
                label='Current Firefox Version'
                value='57.01'

            />
            <ToplineElement 
                    dataID={displays.cumulativeNewProfiles.id}
                    preprocessor={displays.cumulativeNewProfiles.preprocessor}
                    valueFormatter={(d)=>{
                        return d3.format(',r')(d)
                    }}
                    label='Total New Quantum Profiles'
                    labelStyle={{fontSize: '1.2em'}}
                 />
            <ToplineElement value={daysSinceRelease} label={releaseTxt} />
        </ToplineRow>
        {TwoByFour.RowOne}
        {TwoByFour.RowTwo}
        <Footer>
            <div style={{fontWeight:900, textTransform:'uppercase'}}>Data Platform <span style={{fontWeight:300}}>+</span> Data Science <span style={{fontWeight:300}}>+</span> Strategy <span style={{fontSize:'12px', fontWeight:'normal'}}>&amp;</span> Insights</div>
            <div><a href='mailto:quantum-impact-metrics@mozilla.com'><i className="fa fa-area-chart" aria-hidden="true"></i> inquiries re: dashboard or data</a></div>
            <div><a href='https://docs.google.com/document/d/1Ngzs59lS4r4YDaFB5FGxRz8YqAqHY_H6FEO_V0wwvr4/edit#heading=h.9k8kzhyhajfp' target='_blank'><i className="fa fa-book" aria-hidden="true"></i> metrics dictionary</a></div>
            <div><a className='big-dashboard-link' href='https://mzl.la/dashboard' target='_blank'>mzl.la/dashboard</a></div>
        </Footer>
    </ GraphicDisplay>, document.getElementById('page'))
