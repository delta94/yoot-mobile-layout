import React from "react";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

class SortableHoc extends React.Component {
  state = {
    items: []
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { items } = this.state;
    if (this.props.onChange) {
      this.props.onChange(
        items[oldIndex].props.index,
        items[newIndex].props.index
      );
    }
    this.setState({
      items: arrayMove(items, oldIndex, newIndex)
    });
  };
  componentDidMount() {
    this.setState({
      items: this.props.children
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.children
    });
  }
  render() {
    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}

const SortableItem = SortableElement(({ item }) => item);
const SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} item={item} />
      ))}
    </ul>
  );
});

class SortableHocItem extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
export { SortableHoc, SortableHocItem };
