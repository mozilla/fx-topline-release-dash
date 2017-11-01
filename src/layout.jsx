
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
        return (
            <div>
                <h1 className='header'>{this.props.title}</h1>
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

class DataGraphic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id || Math.floor(Math.random()*100000)
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
        return (
            <div ref='display' className='data-graphic' id={this.state.id}>
            </div>
        )
    }

    componentDidMount() {
        // API call - get that data, then plot it.
        //var dataHarness = fakeIt(100, (i)=>Math.sin(i/10)*10+(Math.random()-.5)*10)
        var args = [100]
        if (this.props.hasOwnProperty('scaffoldData')) args.push(this.props.scaffoldData)
        var dataHarness = fakeIt(...args)
        MG.data_graphic({
            target: '#' + this.state.id,
            data: dataHarness,
            legend: ['Firefox 57'],
            x_accessor: 'x',
            y_accessor: 'y',
            color: 'black',
            area: false,
            width: 400,
            right:30,
            height: 300,
            description: this.props.description,
            title: this.props.title

        })
        //this.showToolTip()
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

class ThreePieceRow extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='three-row'>
                {this.props.children}
            </div>
        )
    }
}

export { ThreePieceRow, GraphicDisplay, Header, DataGraphic, Divider, MainDisclaimer }