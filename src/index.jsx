import React from 'react'
import {render} from 'react-dom'
import {GraphicDisplay, ThreePieceRow, Header, DataGraphic, Divider} from './layout.jsx'




var displays = {
    uptake: {
        title: 'Uptake',
        description: 'How quickly does our overall daily usage come from 57?',
        polling: ()=>{},
        scaffoldData:  i=>Math.sin(i/10)*10 + (Math.random()-.5)*5
    },
    newUsers: {
        title: "New Users",
        description: "based on new profile ping",
        scaffoldData: i=>(Math.exp(i/30)*10 +  (Math.random()-.5)*10)*100000
    },
    dau: {
        title: "DAU for release on 57",
        description: "Average Daily Active Users (DAU) over the last 7 days",
        scaffoldData: i=> 1000000 + (Math.random()*Math.cos(i/10)*10 + 1) * 5000 + i*3000
    },
    stability: {
        title: "Crash Rate",
        description: "(Browser Crashes + Content Crashes - Content Shutdown Crashes) per 1,000 hours",
        scaffoldData: i=>  100000 + (Math.random()*Math.cos(i/10)*10 + 1) * 500 - i*100
        
    },
    pagesVisited: {
        title: "Total Pages Visited",
        description: "Total number of URIs visited",
        scaffoldData: i=> 50000 + 10000 * (Math.log((i+1)/10) + 1) +  Math.random()*3000
    },
    sessionHours: {
        title: "Total Session Hours",
        description: "Total number of hours",
        scaffoldData: i=> 500000 + 100000 * (Math.log((i+1)/10)*.5 + 1) +  Math.random()*30000
    }
}

render(
<GraphicDisplay>
    <Header title='Firefox 57 Release Metrics' />
    <Divider />
    <ThreePieceRow>
        <DataGraphic id="uptake"   title={displays.uptake.title} 
                                   description={displays.uptake.description} 
                                   scaffoldData={displays.uptake.scaffoldData} />

        <DataGraphic id="newUsers" title={displays.newUsers.title}  
                                   description={displays.newUsers.description}
                                   scaffoldData={displays.newUsers.scaffoldData} />

        <DataGraphic id="dau"      title={displays.dau.title} 
                                   description={displays.dau.description}
                                   scaffoldData={displays.dau.scaffoldData} />
    </ThreePieceRow>
    <ThreePieceRow>
        <DataGraphic id="crashRate"    title={displays.stability.title}    
                                       description={displays.stability.description}
                                       scaffoldData={displays.stability.scaffoldData} />
        <DataGraphic id="pagesVisited" title={displays.pagesVisited.title} 
                                       description={displays.pagesVisited.description}
                                       scaffoldData={displays.pagesVisited.scaffoldData} />
        <DataGraphic id="sessionHours" title={displays.sessionHours.title}     
                                       description={displays.sessionHours.description}
                                       scaffoldData={displays.sessionHours.scaffoldData} />
    </ThreePieceRow>
</ GraphicDisplay>    
    , document.getElementById('page'))