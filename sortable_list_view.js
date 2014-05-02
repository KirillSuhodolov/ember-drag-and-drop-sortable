import ItemView from 'app/views/sortable-list-item'

export default Em.CollectionView.extend({
  init: function() {
    this._super()
    this.set('startIndex', 0);
    this.set('isRemoving', false);    
  },
  // firld for sort property
  positionField: '',
  // model name of dragging item
  includedModel: '',
  // array of sorting model
  sortingArray: '',
  // additional class for drag block
  handle: '',
  tagName: 'ul',
  // view class for each dragging item
  itemViewClass: ItemView.extend({}),
  cursor: 'move',
  classNames: ['list-group'],
  
  didInsertElement: function() {
    this._super();
    var scope = this;
    this.$().sortable({
      connectWith: ".list-group",
      placeholder: "bg-warning placeholder",
      handle: scope.get('handle'),
      cursor: scope.get('cursor'),
      cancel: ".empty",
      axis: 'y',
      start:function (event, ui) {
        scope.set('startIndex', ui.item.index());
      },
      stop:function (event, ui) {
        if (!scope.get('isRemoving')) {
          var objects = scope.get('controller').get(scope.get('sortingArray')),
            startIndex = scope.get('startIndex'),
            currentIndex = ui.item.index(),
            result = [],
            currentObject = objects.objectAt(startIndex);
          if (startIndex < currentIndex) {
            var beforeStart = objects.slice(0, startIndex),
              afterStart = objects.slice(startIndex + 1, currentIndex + 1),
              afterAll = objects.slice(currentIndex + 1, objects.get('length'));
            result.addObjects(beforeStart).addObjects(afterStart).addObject(currentObject).addObjects(afterAll)
          } else if (startIndex > currentIndex) {
            var beforeCurrent = objects.slice(0, currentIndex),
              afterCurrent = objects.slice(currentIndex, startIndex),
              afterAll = objects.slice(startIndex + 1, objects.get('length'));
            result.addObjects(beforeCurrent).addObject(currentObject).addObjects(afterCurrent).addObjects(afterAll)
          }

          result.forEach(function (el, index) {
            el.get(scope.get('includedModel')).set(scope.positionField, index);
            if (el.get(scope.get('includedModel')).get('isDirty')) {
              el.get(scope.get('includedModel')).save();
            }
          });
        } 
        scope.set('isRemoving', false); 
      },

      remove: function(event, ui) {
        var objects = scope.get('controller').get(scope.get('sortingArray')),
          currentObject = objects.objectAt(scope.get('startIndex')); 

        scope.onRemove(currentObject.get(scope.get('includedModel')));

        scope.get('controller.parentController').set('movingObject', currentObject);
        scope.get('controller.parentController').set('slicingArray', objects);

        scope.set('isRemoving', true);
      },

      receive: function(event, ui) {
        var objects = scope.get('controller').get(scope.get('sortingArray')),
          currentIndex = ui.item.index(),
          currentObject = scope.get('controller.parentController.movingObject'), 
          slicingArray = scope.get('controller.parentController.slicingArray'); 
  	
        scope.onReceive(currentObject.get(scope.get('includedModel')));

        currentObject.get(scope.get('includedModel')).set('position', currentIndex);  
        currentObject.get(scope.get('includedModel')).save().then(function(){
          objects.addObject(currentObject);
          objects.forEach(function (el, index) {
            el.get(scope.get('includedModel')).set(scope.positionField, index);
            if (el.get(scope.get('includedModel')).get('isDirty')) {
              el.get(scope.get('includedModel')).save();
            }
          });
        });

        slicingArray.removeObject(currentObject);

        if (slicingArray.get('length')) {
          slicingArray.forEach(function(item, index){
            item.get(scope.get('includedModel')).set(scope.positionField, index);
            if (item.get(scope.get('includedModel')).get('isDirty')) {
              item.get(scope.get('includedModel')).save()
            }
          });
        } else {
          ui.item.remove();
        }

        scope.get('controller.parentController').set('movingObject', null)
      },
    }).disableSelection(); 
  },
  onRemove: function(object) {
  //  callback fires when element removes from colelction
  },
  onReceive: function(object) {
  //  callbaack fires when element receive to collection
  }

  // instances of removing and receiving views are different
});
