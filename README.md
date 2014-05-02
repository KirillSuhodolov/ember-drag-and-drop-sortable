ember-drag-and-drop-sortable
============================

Sortable drag-and-drop implementation for ember.js. Library for sortable is jQuery-ui, but you can use another. Saving relations throught ember-data.

This sortable view is useful when you need to change position of object or it collection to another.

js

```
SomeSortableView = SortableView.extend({
  // field for sort property
  positionField: '',
  // model name of dragging item
  includedModel: '',
  // array of sorting model
  sortingArray: '',
  // additional class for drag block
  handle: '',
  tagName: 'ul',
  cursor: 'move',
  classNames: ['list-group'],
  // view class for each dragging item
  itemViewClass: ItemView.extend({
    templateName: 'itemView',
    ...
  })
})
```

html

```
{{view 'someSortable' contentBinding='someCollection'}}
```

example
```
collection1
  item1
  item2
  item3

collection2

collection3
  item1
  
collection4
  item1
  item2
  item3
```
