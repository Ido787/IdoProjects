import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Duck from "./Duck";

const DuckContainer = (props) =>  {
    const [ducks, setDucks] = useState([
        {
            id: 'duck1',
            color: 'blue',
            quote: 'קוואק',
        },
        {
            id: 'duck2',
            color: 'green',
            quote: 'קוואק אבל מפחיד רצח',
        },
        {
            id: 'duck3',
            color: 'red',
            quote: `אהרוג אותך בשנתך`,
        }
    ])

    const reorder = (startIndex, endIndex) => {
        const result = Array.from(ducks);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
    
        return result;
    };

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
    
        const newDucks = reorder(
            result.source.index,
            result.destination.index
        );
        setDucks(newDucks)
    }

    const grid = 8;

    const getItemStyle = (isDragging, draggableStyle) => ({
        // change background colour if dragging
        background: isDragging ? "lightblue" : "grey",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,
    
        // styles we need to apply on draggables
        ...draggableStyle
    });
    
    const getListStyle = isDraggingOver => ({
        // background: isDraggingOver ? "lightblue" : "lightgrey",
    });

    return (
        <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {ducks.map((duck, index) => (
                <Draggable key={duck.id} draggableId={duck.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <Duck color={duck.color} quote={duck.quote}/>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
}

export default DuckContainer;