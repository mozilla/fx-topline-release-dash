import React from 'react'
import {render} from 'react-dom'
import {GraphicDisplay, ThreePieceRow, Header, DataGraphic, Divider} from './layout.jsx'

var displays = {
    uptake: {
        title: 'Uptake',
        description: 'How quickly does our overall daily usage come from 57?',
        polling: ()=>{}
    },
    newUsers: {
        title: "New Users",
        description: "based on new profile ping"
    },
    dau: {
        title: "DAU for release on 57",
        description: "Average Daily Active Users (DAU) over the last 7 days"
    },
    stability: {
        title: "Crash Rate",
        description: "(Browser Crashes + Content Crashes - Content Shutdown Crashes) per 1,000 hours"
    },
    pagesVisited: {
        title: "Total Pages Visited",
        description: "Total number of URIs visited"
    },
    sessionHours: {
        title: "Total Session Hours",
        description: "Total number of hours"
    }
}


render(
<GraphicDisplay>
    <Header title='Firefox 57 Release Metrics' />
    <Divider />
    <ThreePieceRow>
        <DataGraphic id="uptake"   title={displays.uptake.title}  description={displays.uptake.description} />
        <DataGraphic id="newUsers" title={displays.newUsers.title}  description={displays.newUsers.description} />
        <DataGraphic id="dau"      title={displays.dau.title} description={displays.dau.description} />
    </ThreePieceRow>
    <ThreePieceRow>
        <DataGraphic id="crashRate"    title={displays.stability.title}    description={displays.stability.description} />
        <DataGraphic id="pagesVisited" title={displays.pagesVisited.title} description={displays.pagesVisited.description} />
        <DataGraphic id="sessionHours" title={displays.sessionHours.title}     description={displays.sessionHours.description} />
    </ThreePieceRow>
</ GraphicDisplay>    
    , document.getElementById('page'))