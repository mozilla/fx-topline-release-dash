import React from 'react'
import {render} from 'react-dom'
import {GraphicDisplay, DisplayRow, Header, DataGraphic, Divider, MainDisclaimer, GraphicContainer, GraphicDisclaimer, SingleNumber} from './layout.jsx'




var displays = {
    uptake: {
        title: 'Uptake',
        description: 'How quickly does our overall daily usage come from 57?',
        polling: ()=>{},
        scaffoldData:  i=>Math.sin(i/10)*10 + (Math.random()-.5)*5,
        xAxisLabel: 'days since release'
    },
    newUsers: {
        title: "New Users",
        description: "based on new profile ping",
        scaffoldData: i=>(Math.exp(i/30)*10 +  (Math.random()-.5)*10)*100000,
        xAxisLabel: 'days since release'
    },
    dau: {
        title: "DAU for release on 57",
        description: "Average Daily Active Users (DAU) over the last 7 days",
        scaffoldData: i=> 1000000 + (Math.random()*Math.cos(i/10)*10 + 1) * 5000 + i*3000,
        xAxisLabel: 'days since release'
    },
    stability: {
        title: "Crash Rate",
        description: "(Browser Crashes + Content Crashes - Content Shutdown Crashes) per 1,000 hours",
        scaffoldData: i=>  100000 + (Math.random()*Math.cos(i/10)*10 + 1) * 500 - i*100,
        xAxisLabel: 'days since release'
    },
    pagesVisited: {
        title: "Total Pages Visited",
        description: "Total number of URIs visited",
        scaffoldData: i=> 50000 + 10000 * (Math.log((i+1)/10) + 1) +  Math.random()*3000,
        xAxisLabel: 'days since release'
    },
    sessionHours: {
        title: "Total Session Hours",
        description: "Total number of hours",
        scaffoldData: i=> 500000 + 100000 * (Math.log((i+1)/10)*.5 + 1) +  Math.random()*30000,
        xAxisLabel: 'days since release'
    }
}

var TwoByFour={}
TwoByFour.RowOne = (<DisplayRow>
    <GraphicContainer>
        <div style={{height: '60px'}}></div>
        <SingleNumber value={'5,543,105'} label={'Total Downloads'} />
        <SingleNumber value={'23 days'} label={'Days Since Release'} />
    </ GraphicContainer>
<GraphicContainer>
    <DataGraphic id="uptake"   title={displays.uptake.title} 
                            description={displays.uptake.description} 
                            scaffoldData={displays.uptake.scaffoldData}
                            xAxisLabel={displays.uptake.xAxisLabel} />
    <GraphicDisclaimer>
            This is a note.
    </GraphicDisclaimer>
</GraphicContainer>
<GraphicContainer>

    <DataGraphic id="newUsers" title={displays.newUsers.title}  
                            description={displays.newUsers.description}
                            scaffoldData={displays.newUsers.scaffoldData}
                            xAxisLabel={displays.newUsers.xAxisLabel} />
</GraphicContainer>

<GraphicContainer>

    <DataGraphic id="dau"      title={displays.dau.title} 
                            description={displays.dau.description}
                            scaffoldData={displays.dau.scaffoldData}
                            xAxisLabel={displays.dau.xAxisLabel} />
</GraphicContainer>

</DisplayRow>)

TwoByFour.RowTwo = (
<DisplayRow>
    <GraphicContainer>
        <DataGraphic id="crashRate"    title={displays.stability.title}    
                                        description={displays.stability.description}
                                        scaffoldData={displays.stability.scaffoldData}
                                        xAxisLabel={displays.stability.xAxisLabel} />
    </GraphicContainer>
    <GraphicContainer>

            <DataGraphic id="crashRate2"    title={displays.stability.title}    
                                       description={displays.stability.description}
                                       scaffoldData={displays.stability.scaffoldData}
                                       xAxisLabel={displays.stability.xAxisLabel} />
        </GraphicContainer>
        <GraphicContainer>
            <DataGraphic id="pagesVisited" title={displays.pagesVisited.title} 
                                       description={displays.pagesVisited.description}
                                       scaffoldData={displays.pagesVisited.scaffoldData}
                                       xAxisLabel={displays.pagesVisited.xAxisLabel} />
        </GraphicContainer>

        <GraphicContainer>

            <DataGraphic id="sessionHours" title={displays.sessionHours.title}     
                                       description={displays.sessionHours.description}
                                       scaffoldData={displays.sessionHours.scaffoldData}
                                       xAxisLabel={displays.sessionHours.xAxisLabel} />
        </GraphicContainer>

    </DisplayRow>
)

render(
<GraphicDisplay>
    <Header title='Firefox 57 Release Metrics' secondText='last updated: 8 minutes ago' img='ff-57.png' />
    <MainDisclaimer>
        This is a very rough proof of concept. 
        The overall design is not solidified, the data is fake, and all the interactions are nonexistent. 
        Keep that in mind for now.
    </MainDisclaimer>
    {TwoByFour.RowOne}
    {TwoByFour.RowTwo}
    
</ GraphicDisplay>    
    , document.getElementById('page'))