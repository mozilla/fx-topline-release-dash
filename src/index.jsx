import React from 'react'
import {render} from 'react-dom'
import {GraphicDisplay, ThreePieceRow, Header, DataGraphic, Divider} from './layout.jsx'

render(
<GraphicDisplay>
    <Header title='Firefox 57 Release Metrics' />
    <Divider />
    <ThreePieceRow>
        <DataGraphic id='first' />
        <DataGraphic id='second' />
        <DataGraphic id='third' />
    </ThreePieceRow>
    <ThreePieceRow>
        <DataGraphic id='fourth' />
        <DataGraphic id='fifth' />
        <DataGraphic id='sixth' />
    </ThreePieceRow>
</ GraphicDisplay>    
    , document.getElementById('page'))