var propsLens = Tscope.attr('props');
var typeLens = Tscope.attr('type');

var SvgRect = React.createClass({
  render: function() {
    return <rect x={this.props.x} y={this.props.y}  width={this.props.width} height={this.props.height} fill={this.props.fill} />
  }
});

var SvgCircle = React.createClass({
  onClick: function(){
    this.props.cursor.then(propsLens).then(
      Tscope.attr('stroke')).set('green');
  },
  render: function() {
    return <circle onClick={this.onClick} cx={this.props.cx} cy={this.props.cy} r="40" stroke={this.props.stroke} fill={this.props.fill} />
  }
});

var SvgEditorTable = React.createClass({
  render: function() {
    var self = this;
    var cursor = this.props.cursor;
    return <svg width="900" height="900">
              {cursor.get().map(function(_, index){
                var itemCursor = cursor.then(Tscope.at(index));
                var type = itemCursor.then(typeLens).get();
                var props = itemCursor.then(propsLens).get();
                props.cursor = itemCursor;
                return React.createElement(type, props);
              })}
           </svg>
  }
});

var SvgEditorControlPannel = React.createClass({
  onClick: function(){
    var current = this.props.cursor.then(Tscope.attr('current')).get();
    var fillLens = Tscope.attr('props').then(Tscope.attr('fill'));
    this.props.table.traversal().then(fillLens).set(current);
  },
  onColorSelectClick: function(color){
    var self = this;
    return function(){
      self.props.cursor.then(Tscope.attr('current')).set(color);
    }
  },
  render: function(){
    var self=this;
    var colors = this.props.cursor.then(Tscope.attr('colors')).get();
    var current = this.props.cursor.then(Tscope.attr('current')).get();
    return <div>
            <h3> ControlPannel </h3>
            {colors.map(function(item){
              return <button onClick={self.onColorSelectClick(item)}>{item}</button>
            })}
            <br/>
            <button onClick={this.onClick} type="button">Fill {current}!</button>
           </div>
  }
});

var SvgEditor = React.createClass({
  getInitialState: function(){
    return {
      table: [
        {type: SvgCircle, 
         props: {cx: 40,
                 cy: 40,
                 stroke: "red",
                 fill: "yellow"}
        },
        {type: SvgRect,
         props: {x: 100,
                 y: 100,
                 width: 100,
                 height: 100,
                 fill: "red"}
        }
      ],
      control_pannel: {
        colors: ['red', 'yellow', 'green', 'blue'],
        current: 'red'
      }
    }
  },
  render: function() {
    var self = this;
    var cursor = Tscope.dataCursor(this.state, function(newState){
      self.setState(newState);
    });
    var pannelCursor = cursor.then(Tscope.attr('control_pannel'));
    var tableCursor = cursor.then(Tscope.attr('table'));
    return <div>
             <SvgEditorControlPannel cursor={pannelCursor} table={tableCursor} />
             <SvgEditorTable cursor={tableCursor} />
           </div>
  }
});


setInterval(function() {
  React.render(
    <SvgEditor />,
    document.getElementById('container')
  );
}, 50);
