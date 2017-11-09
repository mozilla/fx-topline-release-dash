import React from 'react'
import {render} from 'react-dom'
import {dataSources as displays} from './dataSources.js'

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

const WHICH_VERSION = 'release'
const RELEASE_DATE = new Date('2017-11-14')
const NOW = new Date()

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

function showDisplay(args) {
    //if (args.hasOwnProperty('firstAvailableData') && args.firstAvailableData > NOW) {
    if (false) {
        return dataGraphicPlaceholder(args)
    } else {
        return dataGraphicCell(args)
    }
}

function dataGraphicCell(args) {
    var disclaimer = args.hasOwnProperty('disclaimer') ? <GraphicDisclaimer> <span style={{fontWeight:900, paddingRight:10}}>NOTE</span>  {args.disclaimer} </ GraphicDisclaimer> : ''
    return (
        <GraphicContainer  yAccessor={args.yAccessor} dataType={args.dataType} id={args.id} title={args.title} description={args.description} format={args.format} preprocessor={args.preprocessor} source={args.source}>
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
        <GraphicContainer  yAccessor={args.yAccessor} dataType={args.dataType} id={args.id} title={args.title} description={args.description} format={args.format} preprocessor={args.preprocessor} source={args.source}>
            <GraphicHeader subtitle={args.subtitle} title={args.title} secondText={function(){ return this.props.lastDatum[args.yAccessor]}} />
            <GraphicPlaceholder aboveText='first datapoint available' belowText={args.firstAvailableData} />
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


render(
    <GraphicDisplay>
        <Header title='Firefox Quantum' subtitle='impact metrics'  img='static/ff-quantum.png' />
        <ToplineRow>
        <ToplineElement 
                label='Current Firefox Version'
                value='57'
            />
            <ToplineElement value={(()=>{
                var msPerDay = 8.64e7;
                var x0 = RELEASE_DATE;
                var x1 = new Date();
                x0.setHours(12,0,0);
                x1.setHours(12,0,0);
                    return Math.abs(Math.round( (x1 - x0) / msPerDay ))
                })() + ' days'} label={new Date() < RELEASE_DATE ? 'Days Until Release' : 'Days Since Release'} />
        </ToplineRow>
        {TwoByFour.RowOne}
        {TwoByFour.RowTwo}
        <Footer>
            <div style={{fontWeight:900, textTransform:'uppercase'}}>Data Pipeline + Data Science + Strategy &amp; Insights</div>
            <div><a href='#'><i className="fa fa-area-chart" aria-hidden="true"></i> inquiries re: dashboard or data</a></div>
            <div><a href='https://docs.google.com/document/d/1Ngzs59lS4r4YDaFB5FGxRz8YqAqHY_H6FEO_V0wwvr4/edit#heading=h.9k8kzhyhajfp'><i className="fa fa-book" aria-hidden="true"></i> metrics dictionary</a></div>
            <div><a className='big-dashboard-link' href='https://mzl.la/dashboard' target='_blank'>mzl.la/dashboard</a></div>
        </Footer>
    </ GraphicDisplay>, document.getElementById('page'))
