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
        this.state = {lastUpdated: {}}
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
        //var rightText = this.props.hasOwnProperty('secondText') ? <div className='gd-header-second-text'>{this.props.secondText}</div> : undefined
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
        this.state = {isHovered: false}
    }

    handleHover(e) {
        var isHovered = !this.state.isHovered
        this.setState({isHovered})
    }

    render() {
        //console.log(this.props.secondText.bind(this)(), this.props.title)
        //<div className='gd-graphic-header-number hide-on-smaller-display'>{typeof this.props.secondText === 'function' ? this.props.secondText.bind(this)() : this.props.secondText}</div>
        var yAccessor = Array.isArray(this.props.yAccessor) ? this.props.yAccessor[0] : this.props.yAccessor
        var singleNumber = dataFormats[this.props.dataType](this.props.lastDatum[yAccessor])
        console.log(dataFormats[this.props.dataType](this.props.lastDatum[yAccessor]), yAccessor, this.props.lastDatum[yAccessor])
        return (
            <div className='gd-graphic-header'>
                <div className="gd-graphic-header-title">{this.props.title}</div>
                <div className="gd-graphic-header-second-text">{singleNumber}</div>
                <div className='gd-graphic-header-download hide-on-monitor-display'>
                    <a style={{display: this.props.source !== undefined ? 'block' : 'none'}} href={this.props.source} target='_blank'>
                        <i className="fa fa-table" aria-hidden="true"></i>
                    </a>
                </div>
                    
            </div>
        )
    }
}

class DataGraphic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id || Math.floor(Math.random()*100000),
            loaded: false
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
        return (
            <div ref='display' className='data-graphic' id={this.state.id}>
            </div>
        )
    }

    componentDidMount() {
        if (this.props.hasOwnProperty('data')) {
            var plotArgs = this.props.plotArgs
            var mgArgs = {
                target: '#' + this.state.id,
                data: this.props.data,
                x_accessor: this.props.xAccessor,
                y_accessor: this.props.yAccessor,
                legend: plotArgs !== undefined ? plotArgs.legend || ['Quantum'] : ['Quantum'],
                markers: [{label: '57', date: new Date('2017-11-14')}],
                area: false,
                interpolate:  d3.curveMonotoneX,
                width: this.props.width,
                right: 40,
                left:40,
                height: 250,
                bottom:20,
                description: this.props.description,
                //title: this.props.title
                top:25
            }
            mgArgs = Object.assign({}, mgArgs, (this.props.plotArgs || {}))
            MG.data_graphic(mgArgs)
        }
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
        this.state = {loaded: false, isHovered: false, lastDatum: undefined}
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
                    yAccessor: this.props.yAccessor
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
        if (this.props.hasOwnProperty('id')) {
            
            var getTheData = this.props.format == 'json' ? d3.json : d3.csv
            getTheData(`data/${this.props.id}.json`, (data)=> {
                if (this.props.format == 'json') this.props.onLastUpdateData(new Date(data.query_result.retrieved_at), this.props.title)
                if (this.props.preprocessor !== undefined) data = this.props.preprocessor(data)
                this.setState({loaded:true, data, lastDatum: data[data.length-1]})
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

export { DisplayRow, GraphicDisplayStyle, GraphicDisplay, GraphicHeader, Header, DataGraphic, Divider, MainDisclaimer, GraphicContainer, GraphicDisclaimer, SingleNumber, ToplineRow, ToplineElement, Footer }