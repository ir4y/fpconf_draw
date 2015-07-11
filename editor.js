var propsLens = Tscope.attr('props');
var typeLens = Tscope.attr('type');

var SvgRect = React.createClass({
  onClick: function(e){
    this.props.onSelect(this.props.cursor, e);
  },
  render: function() {
    return <rect onClick={this.onClick} x={this.props.x} y={this.props.y}  width={this.props.width} height={this.props.height} fill={this.props.fill} />
  }
});

var SvgCircle = React.createClass({
  onClick: function(e){
    this.props.onSelect(this.props.cursor, e);
  },
  render: function() {
    return <circle onClick={this.onClick} cx={this.props.cx} cy={this.props.cy} r="40" stroke={this.props.stroke} fill={this.props.fill} />
  }
});

var skip_drop_click_hack;

var SvgEditorTable = React.createClass({
  onSelect: function(itemCursor, e){
    skip_drop_click_hack = true;
    console.log("select");
    if(!e.ctrlKey)
      this.props.cursor.traversal().then(propsLens).then(Tscope.attr('selected')).set(false);
    itemCursor.then(propsLens).then(Tscope.attr('selected')).set(true);
  },
  onClick: function(){
    console.log("drop");
    if(skip_drop_click_hack){
      skip_drop_click_hack = false;
    } else {
      this.props.cursor.traversal().then(propsLens).then(Tscope.attr('selected')).set(false);
    }
  },
  render: function() {
    var self = this;
    var cursor = this.props.cursor;
    return <svg width="900" height="900" onClick={this.onClick}>
              {cursor.get().map(function(_, index){
                var itemCursor = cursor.then(Tscope.at(index));
                var type = itemCursor.then(typeLens).get();
                var props = itemCursor.then(propsLens).get();
                props.cursor = itemCursor;
                props.onSelect = self.onSelect;
                return React.createElement(type, props);
              })}
           </svg>
  }
});

var SvgEditorControlPannel = React.createClass({
  onClick: function(){
    var current = this.props.cursor.then(Tscope.attr('current')).get();
    var fillLens = Tscope.attr('props').then(Tscope.attr('fill'));
    this.props.table.traversal(function(item){
      return item.props.selected
    }).then(fillLens).set(current);
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
    var selected = this.props.table.traversal(function(item){
      return item.props.selected
    }).get();
    return <div>
            <h3> ControlPannel </h3>
            {colors.map(function(item){
              return <button onClick={self.onColorSelectClick(item)}>{item}</button>
            })}
            <br/>
            <button onClick={this.onClick} type="button">Fill {current}!</button>
            <ul>{selected.map(function(item){return <li>{item}</li>})}</ul>
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
                 selected: false,
                 stroke: "red",
                 fill: "yellow"}
        },
        {type: SvgRect,
         props: {x: 100,
                 y: 100,
                 selected: false,
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
