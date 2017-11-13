import React from 'react'
import ReactTooltip from 'react-tooltip'
var defaults = {}
defaults.FORMAT = 'web'

/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.

// function qv(variable) {
//     var query = window.location.search.substring(1)
//     var vars = query.split('&')
//     var out
//     vars.forEach(pair=>{
//         pair = pair.split('=')
//         if (decodeURIComponent(pair[0]) == variable) {
//             out = decodeURIComponent(pair[1])
//         }
//     })
//     return out
// }

function qv(v) {
    return window.location.search.substring(1).includes(v)
}

const IS_OFFICE_TV = qv('office-tv')


function prettyDate(time){
    var date = time
	//var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
	var  	diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}

function fakeIt(length, otherFcn) {
    if (otherFcn === undefined) otherFcn=(d)=>Math.random()*10
    var arr = []
    for (var i=0; i< length; i++) {
        arr.push({
            y: otherFcn(i) + i,
            x: i
        })
    }
    return arr
}

class GraphicDisplayStyle extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        var children = React.Children.map(this.props.children, c=>{
            return React.cloneElement(c, {format: this.props.format})
        })
        var format = this.props.hasOwnProperty('format') ? this.props.format : defaults.FORMAT
        return (
            <div className={'gd-format-'+ format}>
                {children}
                </div>
        )
    }
}

class GraphicDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {lastUpdated: {}, hasData: undefined}
        this.handleLastUpdatedData = this.handleLastUpdatedData.bind(this)
    }

    handleLastUpdatedData(time, source) {
        var lastUpdated = this.state.lastUpdated
        lastUpdated[source] = time
        this.setState({lastUpdated})
    }

    render() {
        
        var lastUpdatedElement = Object.values(this.state.lastUpdated)
        if (lastUpdatedElement.length) lastUpdatedElement = Math.max(...lastUpdatedElement)
        else lastUpdatedElement = undefined
        var children = React.Children.map(this.props.children, c=>{
            return React.cloneElement(c, {onLastUpdateData: this.handleLastUpdatedData, lastUpdatedElement})
        })
        return (
            <div className='gd-page'>
                                <ReactTooltip  effect='solid' />

                <div className='graphic-display'>
                    {children}
                </div>
            </div>
        )
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var icon = this.props.hasOwnProperty('img') ? <img src={this.props.img} className='gd-header-img' /> : undefined
        var subtitle = this.props.hasOwnProperty('subtitle') ? <span className='gd-header-subtitle'>{this.props.subtitle}</span> : undefined
        var mainText = <div className='gd-header-text'>{icon} {this.props.title} {subtitle} </div>
        var rightText = this.props.lastUpdatedElement !== undefined ? <div className='gd-header-second-text'>last updated: {prettyDate(new Date(this.props.lastUpdatedElement))}</div> : undefined
        return (
            <div className='gd-header'>
                {mainText}
                {rightText}
            </div>
        )
    }
}

class MainDisclaimer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='gd-main-disclaimer'>
                {this.props.children}
            </div>
        )
    }
}

class ToplineElement extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        var label = this.props.hasOwnProperty('label') ? <div className='gd-single-number-label'>{this.props.label}</div> : undefined
        var value = this.props.hasOwnProperty('value') ? <div className='gd-single-number-value'>{this.props.value}</div> : undefined
        return (
            <div className='gd-topline-element gd-single-number'>
                {label}{value}
            </div>
        )
    }
}

class ToplineRow extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='gd-topline-row'>
                {this.props.children}
            </div>
        )
    }
}

var dataFormats = {}
dataFormats.percentage = (d)=>d3.format('.1%')(d)
dataFormats.volume = (d)=>d3.format(',.0f')(d)
dataFormats.rate = (d)=>d3.format(',.2f')(d)

class GraphicHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {isHovered: false, hasData: undefined}
        this.handleNoData = this.handleNoData.bind(this)
    }


    handleNoData(hasData) {
        this.setState({hasData})
    }
    render() {
        
        var yAccessor = Array.isArray(this.props.yAccessor) ? this.props.yAccessor[0] : this.props.yAccessor
        var singleNumber = this.props.lastDatum !== undefined ? dataFormats[this.props.dataType](this.props.lastDatum[yAccessor]) : undefined
        var subtitle = this.props.hasOwnProperty('subtitle') ? <div className='gd-graphic-header-subtitle'>{this.props.subtitle}</div> : undefined
        return (
            <div className='gd-graphic-header'>
                <div className={'gd-graphic-header-download'}>
                    <a 
                        className={(this.props.isActive ? "" : 'inactive-data-source ') + ((IS_OFFICE_TV) ? 'hide-on-monitor-display ' : '')}

                         href={this.props.source} target='_blank'>
                        <i className="fa fa-table" aria-hidden="true"></i>
                    </a>
                </div>
                <div className={"gd-graphic-header-title " +(this.props.isActive ? "" : 'inactive-data-source')}>{this.props.title}{subtitle}</div>
                <div className="gd-graphic-header-second-text">{singleNumber}</div>
                    
            </div>
        )
    }
}

class NoDataPlaceholder extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <GraphicPlaceholder className='gd-no-data-available' aboveText="no data available" />
        )
    }
}

class DataGraphic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id || Math.floor(Math.random()*100000),
            loaded: false,
            hasData: true
        }
        this.showToolTip = this.showToolTip.bind(this)
        this.hideToolTip = this.hideToolTip.bind(this)
    }

    showToolTip() {
        d3.select(this.refs.display).select('text.mg-header').dispatch('mouseover')
    }

    hideToolTip() {
        d3.select(this.refs.display).select('text.mg-header').dispatch('mouseout')
    }

    render() {
        var loadingIcon = !this.state.loaded ? <div className='gd-loading-graphic'><i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></div> : undefined
        if (this.state.loaded) {
            var inner
            if (!this.state.hasData) {
                inner = <NoDataPlaceholder />
            } else {
                inner = undefined
            }
        }
        return (
            <div ref='display' className='data-graphic' id={this.state.id}>
                {inner}
            </div>
        )
    }

    componentDidMount() {
        if (this.props.hasOwnProperty('data')) {

            if (this.props.data.length) {
                var plotArgs = this.props.plotArgs
                
                var mgArgs = {
                    mouseover_align:'left',
                    target: '#' + this.state.id,
                    data: this.props.data,
                    x_accessor: this.props.xAccessor,
                    y_accessor: this.props.yAccessor,
                    legend: plotArgs !== undefined ? plotArgs.legend || ['Quantum'] : ['Quantum'],
                    area: false,
                    interpolate:  d3.curveMonotoneX,
                    width: this.props.width,
                    //right: 55,
                    right:20,
                    left:45,
                    height: 250,
                    bottom:40,
                    description: this.props.description,
                    top:25,
                    xax_count: 4
                }
                if (this.props.resolution === 'hourly') {
                    mgArgs.max_x = new Date(Math.max(...this.props.data.map(d=>d[this.props.xAccessor])))
                    mgArgs.max_x.setDate(mgArgs.max_x.getDate()+1)
                    mgArgs.max_x.setHours(0,0,0,0)
                }
                mgArgs = Object.assign({}, mgArgs, (this.props.plotArgs || {}))
                this.setState({loaded:true, hasData:true})
                MG.data_graphic(mgArgs)
            } else {
                this.setState({loaded:true, hasData:false})
            }

            
        }
    }
}

class GraphicPlaceholder extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var addlClass
        if (this.props.className) addlClass = this.props.className
        else addlClass = ''
        return (
            <div className={'gd-graphic-placeholder ' + addlClass}>
                <div>
                    <div className='gd-graphic-placeholder-above'>
                        {this.props.aboveText}
                    </div>
                    <div className='gd-graphic-placeholder-below'>
                        {this.props.belowText}
                    </div>
                </div>
            </div>
        )
    }
}


// display full width display thingy.

class SingleNumber extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <div className='gd-single-number'>
                <div className='gd-single-number-label'>
                    {this.props.label}
                </div>
                <div className='gd-single-number-value'>
                    {this.props.value}
                </div>
            </div>
        )
    }
}


class GraphicContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loaded: false, isHovered: false, lastDatum: undefined, hasData: undefined}
        this.handleHover = this.handleHover.bind(this)
    }

    handleHover(e) {
        var isHovered = !this.state.isHovered
        this.setState({isHovered})
    }

    render() {
        var containerWidth = 1200 / this.props.totalSiblings - 60
        if (this.state.loaded) {
            var children = React.Children.map(this.props.children, (child,i)=>{
                return React.cloneElement(child, {
                    width: containerWidth,
                    data: this.state.data,
                    id: this.props.id,
                    source: this.props.source || undefined,
                    onLastUpdateData: this.props.OnLastUpdateData,
                    isHovered: this.state.isHovered,
                    order: i,
                    lastDatum: this.state.lastDatum,
                    dataType: this.props.dataType,
                    yAccessor: this.props.yAccessor,
                    isActive: this.props.isActive,
                    resolution: this.props.resolution,
                    hasData: this.state.hasData
                })
            })
        } else {
            var children =  <div className='gd-loading-graphic'><i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></div>    
        }
        
        return (
            <div 
                onMouseOver={this.handleHover} 
                onMouseOut={this.handleHover} 
                data-tip={this.props.description}
                ref='graphicContainer'
                className='gd-graphic-container' 
                style={{width: containerWidth}}>
                {children}
            </div>
        )
    }

    componentDidUpdate() {
        if (this.props.hasOwnProperty('showTooltip')) {
            ReactTooltip.show(this.refs.graphicContainer)
        }
    }

    componentDidMount() {
        if (this.props.hasOwnProperty('id') && this.props.isActive) {
            var getTheData = this.props.format == 'json' ? d3.json : d3.csv
            getTheData(`data/${this.props.id}.json`, (data)=> {
                if (this.props.format == 'json') this.props.onLastUpdateData(new Date(data.query_result.retrieved_at), this.props.title)
                if (this.props.preprocessor !== undefined) data = this.props.preprocessor(data)
                this.setState({loaded:true, data, lastDatum: data[data.length-1], hasData: data.length})
            })
        } else {
            var args =[100]
            if (this.props.hasOwnProperty('scaffoldData')) args.push(this.props.scaffoldData)
            var data = fakeIt(...args)
            this.setState({loaded: true, data})
        }
        
    }
}

class GraphicDisclaimer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='gd-graphic-disclaimer'>
                {this.props.children}
            </div>
        )
    }
}

class Divider extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='dl-divider' style={{height: this.props.height || 30, marginBottom: this.props.marginBottom || 30}}>
            </div>
        )
    }
}

class DisplayRow extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var children = React.Children.map(this.props.children, (child)=>{
            return React.cloneElement(child, {
                totalSiblings: this.props.children.length,
                onLastUpdateData: this.props.onLastUpdateData
            })
        })
        return (
            <div className='gd-row'>
                {children}
            </div>
        )
    }
}

class Footer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        //var children = React.Children.map(this.props.children, c=><div>{c}</div>)
        return (
            <div className='gd-footer'>
                {this.props.children}
            </div>
        )
    }
}

export { DisplayRow, GraphicPlaceholder, GraphicDisplayStyle, GraphicDisplay, GraphicHeader, Header, DataGraphic, Divider, MainDisclaimer, GraphicContainer, GraphicDisclaimer, SingleNumber, ToplineRow, ToplineElement, Footer }