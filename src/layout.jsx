
import React from 'react'

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

class GraphicDisplay extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='graphic-display'>
                {this.props.children}
            </div>
        )
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var icon = this.props.hasOwnProperty('img') ? <img src={this.props.img} width={60} /> : undefined
        var subtitle = this.props.hasOwnProperty('subtitle') ? <span className='gd-header-subtitle'>{this.props.subtitle}</span> : undefined
        var mainText = <div className='gd-header-text'>{icon} {this.props.title} {subtitle} </div>
        var rightText = this.props.hasOwnProperty('secondText') ? <div className='gd-header-second-text'>{this.props.secondText}</div> : undefined
        
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

            var mgArgs = {
                target: '#' + this.state.id,
                data: this.props.data,
                x_accessor: this.props.xAccessor,
                y_accessor: this.props.yAccessor,
                legend: ['Fx57'],
                markers: [{label: '57', date: new Date('2017-11-14')}],
                area: false,
                interpolate:  d3.curveMonotoneX,
                width: this.props.width,
                right: 30,
                left:30,
                height: 250,
                bottom:20,
                description: this.props.description,
                title: this.props.title
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
        this.state = {loaded: false}
    }

    render() {
        // this is where we clone the children and also get the container siblingCount.
        // this lets us set the width.
        var containerWidth = 1200 / this.props.totalSiblings - 60
        
        if (this.state.loaded) {
            var children = React.Children.map(this.props.children, (child)=>{
                return React.cloneElement(child, {
                    width: containerWidth,
                    data: this.state.data
                })
            })
        } else {
            var children =  <div className='gd-loading-graphic'><i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i></div>    
        }
        
        return (
            <div className='gd-graphic-container' style={{width: containerWidth}}>
                {children}
            </div>
        )
    }

    componentDidMount() {
        if (this.props.hasOwnProperty('apiURI')) {
            d3.csv(this.props.apiURI, (data)=> {
                if (this.props.formatData !== undefined) data = this.props.formatData(data)
                this.setState({loaded:true, data})  
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
                totalSiblings: this.props.children.length
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
        var children = React.Children.map(this.props.children, c=><div>{c}</div>)
        return (
            <div className='gd-footer'>
                {children}
            </div>
        )
    }
}

export { DisplayRow, GraphicDisplay, Header, DataGraphic, Divider, MainDisclaimer, GraphicContainer, GraphicDisclaimer, SingleNumber, ToplineRow, ToplineElement, Footer }