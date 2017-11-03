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
    GraphicDisclaimer,
    SingleNumber,
    ToplineRow ,
    ToplineElement,
    Footer} from './layout.jsx'

const WHICH_VERSION = 'release'
const RELEASE_DATE = new Date('2017-11-14')


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



function dataGraphicCell(args) {
    var disclaimer = args.hasOwnProperty('disclaimer') ? <GraphicDisclaimer> <span style={{fontWeight:900, paddingRight:10}}>NOTE</span>  {args.disclaimer} </ GraphicDisclaimer> : ''
    return (
        <GraphicContainer id={args.id} title={args.title} format={args.format} preprocessor={args.preprocessor} source={args.source}>
            <GraphicHeader title={args.title} description={args.description} />
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
